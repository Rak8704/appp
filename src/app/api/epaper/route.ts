import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      50
    );

    const where = {
      isPublished: true,
      publishedAt: { lte: new Date() },
    };

    const [epapers, total] = await Promise.all([
      prisma.epaper.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.epaper.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: epapers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Epaper API:", error);
    return NextResponse.json(
      { success: false, message: "ই-পেপার লোড করা যায়নি" },
      { status: 500 }
    );
  }
}