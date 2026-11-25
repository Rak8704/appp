import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { AdPosition } from "@/generated/prisma/client";

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  imageUrl: z.string().url().max(2000).nullable().optional(),
  targetUrl: z.string().url().max(2000).nullable().optional(),
  position: z.nativeEnum(AdPosition),
  isActive: z.boolean().optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  sortOrder: z.number().int().optional(),
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
      return NextResponse.json({ success: false, message: "সঠিক বিজ্ঞাপন তথ্য দিন" }, { status: 400 });
    }

    const ad = await prisma.advertisement.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, message: "বিজ্ঞাপন আপডেট হয়েছে", data: ad });
  } catch (error) {
    console.error("Update ad:", error);
    return NextResponse.json({ success: false, message: "বিজ্ঞাপন আপডেট করা যায়নি" }, { status: 500 });
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
    await prisma.advertisement.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "বিজ্ঞাপন মুছে ফেলা হয়েছে" });
  } catch (error) {
    console.error("Delete ad:", error);
    return NextResponse.json({ success: false, message: "বিজ্ঞাপন মুছে ফেলা যায়নি" }, { status: 500 });
  }
}