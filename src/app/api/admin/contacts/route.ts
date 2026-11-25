import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const updateSchema = z.object({
  id: z.string().min(1),
  isRead: z.boolean(),
});

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET: Contact messages
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 20)
    );

    const search = searchParams.get("search")?.trim() || "";
    const readFilter = searchParams.get("read");

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        subject?: { contains: string; mode: "insensitive" };
      }>;
      isRead?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    if (readFilter === "true") {
      where.isRead = true;
    } else if (readFilter === "false") {
      where.isRead = false;
    }

    const [data, total, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          subject: true,
          message: true,
          isRead: true,
          createdAt: true,
        },
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({
        where: { isRead: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("ADMIN_CONTACTS_GET_ERROR:", error);
    return errorResponse("Contact messages load করতে সমস্যা হয়েছে", 500);
  }
}

// PATCH: Mark message as read/unread
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid contact message data",
          errors: validation.error.flatten(),
        },
        { status: 422 }
      );
    }

    const { id, isRead } = validation.data;

    const existing = await prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Contact message পাওয়া যায়নি", 404);
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Contact message status update হয়েছে",
      data: updated,
    });
  } catch (error) {
    console.error("ADMIN_CONTACTS_PATCH_ERROR:", error);
    return errorResponse("Contact message update করতে সমস্যা হয়েছে", 500);
  }
}

// DELETE: Delete contact message using ?id=...
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return errorResponse("Contact message ID প্রয়োজন");
    }

    const existing = await prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Contact message পাওয়া যায়নি", 404);
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Contact message delete হয়েছে",
    });
  } catch (error) {
    console.error("ADMIN_CONTACTS_DELETE_ERROR:", error);
    return errorResponse("Contact message delete করতে সমস্যা হয়েছে", 500);
  }
}