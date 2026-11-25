
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
    const category = searchParams.get("category");

    const where = {
      status: "PUBLISHED" as const,
      publishedAt: { lte: new Date() },
      ...(category ? { category: { slug: category } } : {}),
    };

    const [news, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, name: true, avatar: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json(
      { success: false, message: "à¦¸à¦‚à¦¬à¦¾à¦¦ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿" },
      { status: 500 }
    );
  }
}

