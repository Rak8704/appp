import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const createSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  fileUrl: z.string().url().max(2000),
  fileType: z.string().trim().min(1).max(100),
  fileSize: z.number().int().nonnegative(),
  altText: z.string().max(500).nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100);
    const search = searchParams.get("search")?.trim();

    const where = search
      ? { fileName: { contains: search, mode: "insensitive" as const } }
      : {};

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: media,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Media list:", error);
    return NextResponse.json({ success: false, message: "Media লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Media তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const media = await prisma.media.create({
      data: {
        ...parsed.data,
        uploadedById: admin.id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Media record তৈরি হয়েছে", data: media },
      { status: 201 }
    );
  } catch (error) {
    console.error("Media create:", error);
    return NextResponse.json({ success: false, message: "Media তৈরি করা যায়নি" }, { status: 500 });
  }
}