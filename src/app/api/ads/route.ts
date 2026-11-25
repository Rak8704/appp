import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    const now = new Date();

    const ads = await prisma.advertisement.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
          ...(position ? [{ position: position as never }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: ads,
      total: ads.length,
    });
  } catch (error) {
    console.error("Ads API:", error);
    return NextResponse.json(
      { success: false, message: "বিজ্ঞাপন লোড করা যায়নি" },
      { status: 500 }
    );
  }
}