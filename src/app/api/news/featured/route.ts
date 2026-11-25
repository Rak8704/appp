
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const news = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: { lte: new Date() },
      },
      include: {
        category: true,
        author: { select: { name: true, avatar: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 8,
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Featured News API Error:", error);
    return NextResponse.json(
      { success: false, message: "Featured news load failed" },
      { status: 500 }
    );
  }
}

