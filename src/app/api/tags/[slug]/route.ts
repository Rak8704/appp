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

    const tag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      return NextResponse.json(
        { success: false, message: "ট্যাগ পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const where = {
      tagId: tag.id,
      article: {
        status: "PUBLISHED" as const,
        publishedAt: { lte: new Date() },
      },
    };

    const [taggedArticles, total] = await Promise.all([
      prisma.articleTag.findMany({
        where,
        include: {
          article: {
            include: {
              category: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          article: { publishedAt: "desc" },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.articleTag.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tag,
        articles: taggedArticles.map((item) => item.article),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Tag details API error:", error);
    return NextResponse.json(
      { success: false, message: "ট্যাগের সংবাদ লোড করা যায়নি" },
      { status: 500 }
    );
  }
}