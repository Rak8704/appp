
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";



const imageSchema = z.object({
  url: z.string().trim().url().max(2000),
  title: z.string().trim().max(300).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  altText: z.string().trim().max(500).optional().nullable(),
  caption: z.string().trim().max(500).optional().nullable(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

const gallerySchema = z.object({
  title: z.string().trim().min(2).max(300),
  slug: z.string().trim().min(2).max(300).optional(),
  description: z.string().max(10000).optional().nullable(),
  coverImage: z.string().url().max(2000).optional().nullable().or(z.literal("")),
  categoryId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  images: z.array(imageSchema).max(100).default([]),
});

const updateSchema = gallerySchema.extend({
  id: z.string().min(1),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0980-\u09FF]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

async function writeAudit(
  userId: string,
  action: string,
  entityId: string,
  details: string,
  ipAddress: string | null
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity: "Gallery",
      entityId,
      details,
      ipAddress,
    },
  });
}

async function createGalleryImages(
  tx: any,
  galleryId: string,
  uploadedById: string,
  images: z.infer<typeof imageSchema>[]
) {
  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    const parsedUrl = new URL(image.url);

    let media = await tx.media.findFirst({
      where: {
        fileUrl: image.url,
        fileType: { startsWith: "image/" },
      },
    });

    if (!media) {
      const fileName =
        decodeURIComponent(parsedUrl.pathname.split("/").pop() || "gallery-image")
          .slice(0, 255);

      media = await tx.media.create({
        data: {
          fileName,
          fileUrl: image.url,
          fileType: "image/remote",
          fileSize: 0,
          altText: image.altText || null,
          uploadedById,
        },
      });
    }

    await tx.galleryImage.create({
      data: {
        galleryId,
        mediaId: media.id,
        title: image.title || null,
        description: image.description || null,
        caption: image.caption || null,
        altText: image.altText || null,
        isFeatured: image.isFeatured,
        sortOrder: image.sortOrder ?? index,
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "অনুমতি নেই। Admin login করুন।" },
        { status: 401 }
      );
    }

    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim() || "";
    const status = params.get("status") || "all";
    const categoryId = params.get("categoryId") || "";
    const featured = params.get("featured") || "all";

    const page = Math.max(1, Number(params.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(params.get("limit") || 12)));

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;
    if (categoryId) where.categoryId = categoryId;
    if (featured === "yes") where.isFeatured = true;
    if (featured === "no") where.isFeatured = false;

    const [galleries, total, categories, totalPublished, totalDraft, totalFeatured] =
      await prisma.$transaction([
        prisma.gallery.findMany({
          where,
          include: {
            category: { select: { id: true, name: true } },
            _count: { select: { images: true } },
            images: {
              orderBy: { sortOrder: "asc" },
              include: { media: true },
            },
          },
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.gallery.count({ where }),
        prisma.category.findMany({
          where: { isActive: true },
          select: { id: true, name: true },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.gallery.count({ where: { isPublished: true } }),
        prisma.gallery.count({ where: { isPublished: false } }),
        prisma.gallery.count({ where: { isFeatured: true } }),
      ]);

    return NextResponse.json({
      success: true,
      galleries,
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalPublished + totalDraft,
        published: totalPublished,
        draft: totalDraft,
        featured: totalFeatured,
      },
    });
  } catch (error) {
    console.error("Admin gallery GET error:", error);
    return NextResponse.json(
      { message: "Gallery data লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json({ message: "অনুমতি নেই।" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = gallerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "তথ্য সঠিক নয়।", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = slugify(data.slug || data.title);

    if (!slug) {
      return NextResponse.json(
        { message: "সঠিক slug দিতে হবে।" },
        { status: 400 }
      );
    }

    const duplicate = await prisma.gallery.findUnique({ where: { slug } });

    if (duplicate) {
      return NextResponse.json(
        { message: "এই slug আগে থেকেই ব্যবহার করা হয়েছে।" },
        { status: 409 }
      );
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { message: "নির্বাচিত Category পাওয়া যায়নি।" },
          { status: 400 }
        );
      }
    }

    const gallery = await prisma.$transaction(async (tx) => {
      const created = await tx.gallery.create({
        data: {
          title: data.title,
          slug,
          description: data.description || null,
          coverImage: data.coverImage || null,
          categoryId: data.categoryId || null,
          isFeatured: data.isFeatured,
          isPublished: data.isPublished,
          publishedAt: data.isPublished ? new Date() : null,
        },
      });

      await createGalleryImages(
        tx,
        created.id,
        admin.id,
        data.images
      );

      return created;
    });

    await writeAudit(
      admin.id,
      "CREATE",
      gallery.id,
      `Created gallery: ${gallery.title}`,
      getIp(request)
    );

    return NextResponse.json(
      { success: true, message: "Gallery তৈরি হয়েছে।", gallery },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin gallery POST error:", error);
    return NextResponse.json(
      { message: "Gallery তৈরি করা যায়নি।" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json({ message: "অনুমতি নেই।" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "তথ্য সঠিক নয়।", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.gallery.findUnique({
      where: { id: data.id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Gallery পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const slug = slugify(data.slug || data.title);

    const duplicate = await prisma.gallery.findFirst({
      where: { slug, NOT: { id: data.id } },
    });

    if (duplicate) {
      return NextResponse.json(
        { message: "এই slug অন্য Gallery ব্যবহার করছে।" },
        { status: 409 }
      );
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { message: "নির্বাচিত Category পাওয়া যায়নি।" },
          { status: 400 }
        );
      }
    }

    const gallery = await prisma.$transaction(async (tx) => {
      if (data.images) {
        await tx.galleryImage.deleteMany({
          where: { galleryId: data.id },
        });

        await createGalleryImages(
          tx,
          data.id,
          admin.id,
          data.images
        );
      }

      return tx.gallery.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug,
          description: data.description || null,
          coverImage: data.coverImage || null,
          categoryId: data.categoryId || null,
          isFeatured: data.isFeatured,
          isPublished: data.isPublished,
          publishedAt: data.isPublished
            ? existing.publishedAt || new Date()
            : null,
        },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
            include: { media: true },
          },
          _count: { select: { images: true } },
        },
      });
    });

    await writeAudit(
      admin.id,
      "UPDATE",
      gallery.id,
      `Updated gallery: ${gallery.title}`,
      getIp(request)
    );

    return NextResponse.json({
      success: true,
      message: "Gallery আপডেট হয়েছে।",
      gallery,
    });
  } catch (error) {
    console.error("Admin gallery PATCH error:", error);
    return NextResponse.json(
      { message: "Gallery আপডেট করা যায়নি।" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json({ message: "অনুমতি নেই।" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Gallery ID প্রয়োজন।" },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.findUnique({ where: { id } });

    if (!gallery) {
      return NextResponse.json(
        { message: "Gallery পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.gallery.delete({ where: { id } });

    await writeAudit(
      admin.id,
      "DELETE",
      id,
      `Deleted gallery: ${gallery.title}`,
      getIp(request)
    );

    return NextResponse.json({
      success: true,
      message: "Gallery Delete হয়েছে।",
    });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json(
      { message: "Gallery Delete করা যায়নি।" },
      { status: 500 }
    );
  }
}
