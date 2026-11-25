import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 12, 1),
      50
    );

    const now = new Date();

    const where = {
      isPublished: true,
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: now } },
      ],
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
              publishedAt: true,
            },
          },
          uploadedBy: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.video.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Videos API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "ভিডিও লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}