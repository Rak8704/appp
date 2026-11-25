import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      100
    );

    const status = searchParams.get("status");

    const where = status
      ? { status: status as never }
      : {};

    const [comments, total, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        prisma.comment.findMany({
          where,
          include: {
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),

        prisma.comment.count({ where }),

        prisma.comment.count({
          where: { status: "PENDING" },
        }),

        prisma.comment.count({
          where: { status: "APPROVED" },
        }),

        prisma.comment.count({
          where: { status: "REJECTED" },
        }),
      ]);

    return NextResponse.json({
      success: true,
      data: comments,
      statistics: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin Comments API:", error);

    return NextResponse.json(
      { success: false, message: "Comments লোড করা যায়নি" },
      { status: 500 }
    );
  }
}