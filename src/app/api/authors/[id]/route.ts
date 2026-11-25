import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      50
    );

    const author = await prisma.user.findFirst({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        avatar: true,
        bio: true,
      },
    });

    if (!author) {
      return NextResponse.json(
        { success: false, message: "লেখক পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const where = {
      authorId: id,
      status: "PUBLISHED" as const,
      publishedAt: { lte: new Date() },
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
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
        author,
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
    console.error("Author details API error:", error);
    return NextResponse.json(
      { success: false, message: "লেখকের তথ্য লোড করা যায়নি" },
      { status: 500 }
    );
  }
}