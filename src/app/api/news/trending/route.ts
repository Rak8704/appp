import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      50
    );

    const news = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        isTrending: true,
        publishedAt: { lte: new Date() },
      },
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
      orderBy: [
        { publishedAt: "desc" },
        { viewCount: "desc" },
      ],
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: news,
      total: news.length,
    });
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { success: false, message: "ট্রেন্ডিং নিউজ লোড করা যায়নি" },
      { status: 500 }
    );
  }
}