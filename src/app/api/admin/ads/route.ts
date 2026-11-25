import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { AdPosition } from "@/generated/prisma/client";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  imageUrl: z.string().url().max(2000).nullable().optional(),
  targetUrl: z.string().url().max(2000).nullable().optional(),
  position: z.nativeEnum(AdPosition),
  isActive: z.boolean().optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  sortOrder: z.number().int().optional(),
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

    const [ads, total] = await Promise.all([
      prisma.advertisement.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.advertisement.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: ads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin ads:", error);
    return NextResponse.json({ success: false, message: "বিজ্ঞাপন লোড করা যায়নি" }, { status: 500 });
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
        { success: false, message: "বিজ্ঞাপনের তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const ad = await prisma.advertisement.create({
      data: {
        ...parsed.data,
        isActive: parsed.data.isActive ?? true,
        sortOrder: parsed.data.sortOrder ?? 0,
      },
    });

    return NextResponse.json(
      { success: true, message: "বিজ্ঞাপন তৈরি হয়েছে", data: ad },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create ad:", error);
    return NextResponse.json({ success: false, message: "বিজ্ঞাপন তৈরি করা যায়নি" }, { status: 500 });
  }
}