import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  editionDate: z.coerce.date(),
  pdfUrl: z.string().url().max(2000),
  coverImage: z.string().url().max(2000).nullable().optional(),
  isPublished: z.boolean().optional(),
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

    const [epapers, total] = await Promise.all([
      prisma.epaper.findMany({
        orderBy: { editionDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.epaper.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: epapers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin epaper:", error);
    return NextResponse.json({ success: false, message: "ই-পেপার লোড করা যায়নি" }, { status: 500 });
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
        { success: false, message: "ই-পেপারের তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const epaper = await prisma.epaper.create({
      data: {
        ...parsed.data,
        isPublished: parsed.data.isPublished ?? false,
      },
    });

    return NextResponse.json(
      { success: true, message: "ই-পেপার তৈরি হয়েছে", data: epaper },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create epaper:", error);
    return NextResponse.json({ success: false, message: "ই-পেপার তৈরি করা যায়নি" }, { status: 500 });
  }
}