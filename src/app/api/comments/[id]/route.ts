
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Login করুন।" },
        { status: 401 }
      );
    }

    const session = await verifyAuthToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "আবার Login করুন।" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, isActive: true },
    });

    if (!user?.isActive) {
      return NextResponse.json(
        { success: false, message: "Account সক্রিয় নয়।" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const result = await prisma.comment.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "নিজের Comment পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment Delete হয়েছে।",
    });
  } catch (error) {
    console.error("COMMENT_DELETE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Comment Delete করা যায়নি।" },
      { status: 500 }
    );
  }
}
