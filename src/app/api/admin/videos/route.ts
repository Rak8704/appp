import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  title: z.string().trim().min(2).max(250),
  slug: z.string().trim().min(2).max(250),
  description: z.string().max(5000).nullable().optional(),
  videoUrl: z.string().url().max(2000),
  thumbnail: z.string().url().max(2000).nullable().optional(),
  articleId: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
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

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        include: {
          article: { select: { id: true, title: true, slug: true } },
          uploadedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.video.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: videos,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin videos:", error);
    return NextResponse.json({ success: false, message: "Videos লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Video তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        ...parsed.data,
        uploadedById: admin.id,
        isPublished: parsed.data.isPublished ?? false,
      },
    });

    return NextResponse.json(
      { success: true, message: "Video তৈরি হয়েছে", data: video },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create video:", error);
    return NextResponse.json({ success: false, message: "Video তৈরি করা যায়নি" }, { status: 500 });
  }
}