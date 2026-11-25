import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  editionDate: z.coerce.date().optional(),
  pdfUrl: z.string().url().max(2000).optional(),
  coverImage: z.string().url().max(2000).nullable().optional(),
  isPublished: z.boolean().optional(),
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
      return NextResponse.json({ success: false, message: "সঠিক ই-পেপার তথ্য দিন" }, { status: 400 });
    }

    const epaper = await prisma.epaper.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, message: "ই-পেপার আপডেট হয়েছে", data: epaper });
  } catch (error) {
    console.error("Update epaper:", error);
    return NextResponse.json({ success: false, message: "ই-পেপার আপডেট করা যায়নি" }, { status: 500 });
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
    await prisma.epaper.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "ই-পেপার মুছে ফেলা হয়েছে" });
  } catch (error) {
    console.error("Delete epaper:", error);
    return NextResponse.json({ success: false, message: "ই-পেপার মুছে ফেলা যায়নি" }, { status: 500 });
  }
}