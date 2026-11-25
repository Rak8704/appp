import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const now = new Date();

    const gallery = await prisma.gallery.findFirst({
      where: {
        slug,
        isPublished: true,
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: now } },
        ],
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            media: true,
          },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          message: "গ্যালারি পাওয়া যায়নি",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Gallery Details API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "গ্যালারি লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}