import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      50
    );

    const category = await prisma.category.findFirst({
      where: { slug, isActive: true },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "ক্যাটাগরি পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const where = {
      categoryId: category.id,
      status: "PUBLISHED" as const,
      publishedAt: { lte: new Date() },
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
            },
          },
          category: true,
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        category,
        articles,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Category details API error:", error);
    return NextResponse.json(
      { success: false, message: "ক্যাটাগরি লোড করা যায়নি" },
      { status: 500 }
    );
  }
}