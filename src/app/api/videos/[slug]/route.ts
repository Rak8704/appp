import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const now = new Date();

    const video = await prisma.video.findFirst({
      where: {
        slug,
        isPublished: true,
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: now } },
        ],
      },
      include: {
        article: {
          include: {
            category: true,
            author: {
              select: {
                id: true,
                name: true,
                slug: true,
                avatar: true,
              },
            },
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
    });

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          message: "ভিডিও পাওয়া যায়নি",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error("Video Details API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "ভিডিও লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}