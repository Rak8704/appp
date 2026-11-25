import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200),
  department: z.string().max(150).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  employmentType: z.string().max(100).nullable().optional(),
  description: z.string().min(10),
  requirements: z.string().nullable().optional(),
  salary: z.string().max(150).nullable().optional(),
  deadline: z.coerce.date().nullable().optional(),
  isActive: z.boolean().optional(),
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

    const [careers, total] = await Promise.all([
      prisma.career.findMany({
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.career.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: careers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin careers:", error);
    return NextResponse.json({ success: false, message: "Career লোড করা যায়নি" }, { status: 500 });
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
        { success: false, message: "Career তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const career = await prisma.career.create({
      data: {
        ...parsed.data,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Career তৈরি হয়েছে", data: career },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create career:", error);
    return NextResponse.json({ success: false, message: "Career তৈরি করা যায়নি" }, { status: 500 });
  }
}