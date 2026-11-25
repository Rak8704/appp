import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  slug: z.string().trim().min(2).max(200).optional(),
  description: z.string().max(3000).nullable().optional(),
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
      return NextResponse.json({ success: false, message: "সঠিক Gallery তথ্য দিন" }, { status: 400 });
    }

    const gallery = await prisma.gallery.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, message: "Gallery আপডেট হয়েছে", data: gallery });
  } catch (error) {
    console.error("Update gallery:", error);
    return NextResponse.json({ success: false, message: "Gallery আপডেট করা যায়নি" }, { status: 500 });
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

    await prisma.gallery.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Gallery মুছে ফেলা হয়েছে" });
  } catch (error) {
    console.error("Delete gallery:", error);
    return NextResponse.json({ success: false, message: "Gallery মুছে ফেলা যায়নি" }, { status: 500 });
  }
}