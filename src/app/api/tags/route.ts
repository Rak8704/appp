import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 30, 1),
      100
    );

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tag.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: tags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Tags API error:", error);
    return NextResponse.json(
      { success: false, message: "ট্যাগ লোড করা যায়নি" },
      { status: 500 }
    );
  }
}