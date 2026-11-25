import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  title: z.string().trim().min(2).max(250).optional(),
  slug: z.string().trim().min(2).max(250).optional(),
  description: z.string().max(5000).nullable().optional(),
  videoUrl: z.string().url().max(2000).optional(),
  thumbnail: z.string().url().max(2000).nullable().optional(),
  articleId: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const { id } = await params;
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success || Object.keys(parsed.data || {}).length === 0) {
      return NextResponse.json({ success: false, message: "সঠিক Video তথ্য দিন" }, { status: 400 });
    }

    const video = await prisma.video.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, message: "Video আপডেট হয়েছে", data: video });
  } catch (error) {
    console.error("Update video:", error);
    return NextResponse.json({ success: false, message: "Video আপডেট করা যায়নি" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.video.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Video মুছে ফেলা হয়েছে" });
  } catch (error) {
    console.error("Delete video:", error);
    return NextResponse.json({ success: false, message: "Video মুছে ফেলা যায়নি" }, { status: 500 });
  }
}