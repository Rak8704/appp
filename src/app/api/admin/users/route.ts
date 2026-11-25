
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { hasAdminPermission } from "@/lib/admin-permissions";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const canView = await hasAdminPermission(
      admin.id,
      admin.role,
      "canViewUsers"
    );

    if (!canView) {
      return NextResponse.json(
        {
          success: false,
          message: "User List দেখার অনুমতি নেই",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      100
    );

    const search = searchParams.get("search")?.trim();
    const role = searchParams.get("role");
    const active = searchParams.get("active");

    const where = {
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(role ? { role: role as never } : {}),
      ...(active === "true" ? { isActive: true } : {}),
      ...(active === "false" ? { isActive: false } : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          bio: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin Users API:", error);

    return NextResponse.json(
      {
        success: false,
        message: "ইউজার তালিকা লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}
