import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["ACTIVE", "UNSUBSCRIBED"]),
});

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET: Newsletter subscribers
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
    const status = searchParams.get("status") || "";

    const where: {
      email?: { contains: string; mode: "insensitive" };
      status?: "ACTIVE" | "UNSUBSCRIBED";
    } = {};

    if (search) {
      where.email = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (status === "ACTIVE" || status === "UNSUBSCRIBED") {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: {
          subscribedAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          status: true,
          subscribedAt: true,
          unsubscribedAt: true,
          updatedAt: true,
        },
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("ADMIN_NEWSLETTER_GET_ERROR:", error);
    return errorResponse("Newsletter subscribers load করতে সমস্যা হয়েছে", 500);
  }
}

// PATCH: Update subscriber status
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
          message: "Invalid newsletter data",
          errors: validation.error.flatten(),
        },
        { status: 422 }
      );
    }

    const { id, status } = validation.data;

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Subscriber পাওয়া যায়নি", 404);
    }

    const updated = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        status,
        unsubscribedAt:
          status === "UNSUBSCRIBED" ? new Date() : null,
      },
      select: {
        id: true,
        email: true,
        status: true,
        subscribedAt: true,
        unsubscribedAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscriber status update হয়েছে",
      data: updated,
    });
  } catch (error) {
    console.error("ADMIN_NEWSLETTER_PATCH_ERROR:", error);
    return errorResponse("Subscriber update করতে সমস্যা হয়েছে", 500);
  }
}

// DELETE: Delete subscriber using ?id=...
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return errorResponse("Subscriber ID প্রয়োজন");
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Subscriber পাওয়া যায়নি", 404);
    }

    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Subscriber delete হয়েছে",
    });
  } catch (error) {
    console.error("ADMIN_NEWSLETTER_DELETE_ERROR:", error);
    return errorResponse("Subscriber delete করতে সমস্যা হয়েছে", 500);
  }
}