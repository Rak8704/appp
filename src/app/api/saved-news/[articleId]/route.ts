
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ articleId: string }> }
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
        { success: false, message: "অনুগ্রহ করে আবার Login করুন।" },
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

    const { articleId } = await context.params;

    const result = await prisma.savedNews.deleteMany({
      where: {
        userId: user.id,
        articleId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Saved News পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Saved News থেকে সরানো হয়েছে।",
    });
  } catch (error) {
    console.error("SAVED_NEWS_DELETE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Saved News সরানো যায়নি।" },
      { status: 500 }
    );
  }
}
