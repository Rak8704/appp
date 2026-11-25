import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  slug: z.string().trim().min(2).max(150).optional(),
  description: z.string().max(1000).nullable().optional(),
  image: z.string().max(1000).nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const parsed = updateSchema.safeParse(await request.json());

    if (!parsed.success || Object.keys(parsed.data || {}).length === 0) {
      return NextResponse.json(
        { success: false, message: "সঠিক Category তথ্য দিন" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Category পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
      success: true,
      message: "Category আপডেট হয়েছে",
      data: category,
    });
  } catch (error) {
    console.error("Update Category API:", error);

    return NextResponse.json(
      { success: false, message: "Category আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    if (category._count.articles > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "এই Category-তে Article রয়েছে। আগে Article অন্য Category-তে সরান।",
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Category মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    console.error("Delete Category API:", error);

    return NextResponse.json(
      { success: false, message: "Category মুছে ফেলা যায়নি" },
      { status: 500 }
    );
  }
}