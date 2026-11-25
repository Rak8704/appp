
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const news = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        isBreaking: true,
        publishedAt: { lte: new Date() },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Breaking News API Error:", error);
    return NextResponse.json(
      { success: false, message: "Breaking news load failed" },
      { status: 500 }
    );
  }
}

