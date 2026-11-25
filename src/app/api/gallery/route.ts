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

    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          _count: {
            select: {
              images: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.gallery.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: galleries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Gallery API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "গ্যালারি লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}