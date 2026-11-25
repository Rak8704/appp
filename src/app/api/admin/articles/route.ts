
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const createSchema = z.object({
  title: z.string().trim().min(5).max(300),
  slug: z.string().trim().min(3).max(300),
  excerpt: z.string().max(1000).optional().nullable(),
  content: z.string().min(10),
  coverImage: z.string().max(1000).optional().nullable(),
  categoryId: z.string().min(1),
  authorId: z.string().min(1).optional(),
  status: z
    .enum(["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED"])
    .optional(),
  isFeatured: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  seoTitle: z.string().max(300).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  seoKeywords: z.string().max(1000).optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      100
    );

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");

    const where = {
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                slug: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(status ? { status: status as never } : {}),
      ...(categoryId ? { categoryId } : {}),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.article.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin Articles API GET:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Article তালিকা লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "অনুমতি নেই",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Article-এর তথ্য সঠিক নয়",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Category check
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category পাওয়া যায়নি",
        },
        { status: 400 }
      );
    }

    // Author check
    const authorId = data.authorId || admin.id;

    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!author || !author.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Author পাওয়া যায়নি বা নিষ্ক্রিয়",
        },
        { status: 400 }
      );
    }

    // Duplicate slug check
    const existingArticle = await prisma.article.findUnique({
      where: {
        slug: data.slug,
      },
      select: {
        id: true,
      },
    });

    if (existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "এই Slug দিয়ে ইতোমধ্যে Article তৈরি হয়েছে",
        },
        { status: 400 }
      );
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? null,
        content: data.content,
        coverImage: data.coverImage ?? null,

        // SEO fields
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        seoKeywords: data.seoKeywords ?? null,

        categoryId: data.categoryId,
        authorId,

        status: data.status || "DRAFT",

        isFeatured: data.isFeatured ?? false,
        isBreaking: data.isBreaking ?? false,
        isTrending: data.isTrending ?? false,

        publishedAt:
          data.publishedAt ??
          (data.status === "PUBLISHED" ? new Date() : null),
      },

      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "নতুন Article তৈরি হয়েছে",
        data: article,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Article API:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Article তৈরি করা যায়নি",
      },
      { status: 500 }
    );
  }
}
