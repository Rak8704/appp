
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 20));

    const [notifications, total, unread] = await prisma.$transaction([
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: user.id },
      }),
      prisma.notification.count({
        where: { userId: user.id, isRead: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount: unread,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("NOTIFICATIONS_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Notifications পাওয়া যায়নি।" },
      { status: 500 }
    );
  }
}
