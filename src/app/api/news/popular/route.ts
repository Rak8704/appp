
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const news = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      include: {
        category: true,
      },
      orderBy: { viewCount: "desc" },
      take: 10,
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Popular News API Error:", error);
    return NextResponse.json(
      { success: false, message: "Popular news load failed" },
      { status: 500 }
    );
  }
}

