import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const createSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(150),
  description: z.string().max(1000).nullable().optional(),
  image: z.string().max(1000).nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
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
      Math.max(Number(searchParams.get("limit")) || 50, 1),
      100
    );

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        include: {
          _count: {
            select: { articles: true },
          },
        },
        orderBy: [
          { sortOrder: "asc" },
          { name: "asc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin Categories API:", error);

    return NextResponse.json(
      { success: false, message: "Category লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const parsed = createSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Category তথ্য সঠিক নয়",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        ...parsed.data,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "নতুন Category তৈরি হয়েছে",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Category API:", error);

    return NextResponse.json(
      { success: false, message: "Category তৈরি করা যায়নি" },
      { status: 500 }
    );
  }
}