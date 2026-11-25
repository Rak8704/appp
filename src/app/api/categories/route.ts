
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                status: "PUBLISHED",
                publishedAt: { lte: new Date() },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { success: false, message: "Categories load failed" },
      { status: 500 }
    );
  }
}

