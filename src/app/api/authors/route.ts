import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      100
    );

    const where = {
      isActive: true,
      articles: {
        some: {
          status: "PUBLISHED" as const,
          publishedAt: { lte: new Date() },
        },
      },
    };

    const [authors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          avatar: true,
          bio: true,
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
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: authors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Authors API error:", error);
    return NextResponse.json(
      { success: false, message: "লেখকদের তালিকা লোড করা যায়নি" },
      { status: 500 }
    );
  }
}