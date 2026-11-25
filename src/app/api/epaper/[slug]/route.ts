import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const epaper = await prisma.epaper.findFirst({
      where: {
        slug,
        isPublished: true,
        publishedAt: { lte: new Date() },
      },
    });

    if (!epaper) {
      return NextResponse.json(
        { success: false, message: "ই-পেপার পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: epaper,
    });
  } catch (error) {
    console.error("Epaper details API:", error);
    return NextResponse.json(
      { success: false, message: "ই-পেপার লোড করা যায়নি" },
      { status: 500 }
    );
  }
}