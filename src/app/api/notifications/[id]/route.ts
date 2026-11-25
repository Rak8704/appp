
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const updateSchema = z.object({
  isRead: z.boolean(),
});

async function getUserId(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifyAuthToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, isActive: true },
  });

  return user?.isActive ? user.id : null;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login করুন।" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const parsed = updateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক তথ্য প্রদান করুন।" },
        { status: 400 }
      );
    }

    const result = await prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isRead: parsed.data.isRead,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Notification পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    return NextResponse.json({
      success: true,
      message: "Notification Update হয়েছে।",
      data: notification,
    });
  } catch (error) {
    console.error("NOTIFICATION_PATCH_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Notification Update করা যায়নি।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login করুন।" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const result = await prisma.notification.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Notification পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification Delete হয়েছে।",
    });
  } catch (error) {
    console.error("NOTIFICATION_DELETE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Notification Delete করা যায়নি।" },
      { status: 500 }
    );
  }
}
