import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin || !["SUPER_ADMIN", "ADMIN"].includes(admin.role)) {
      return NextResponse.json(
        { success: false, message: "Audit Logs দেখার অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 30, 1), 100);
    const userId = searchParams.get("userId");
    const action = searchParams.get("action");
    const entity = searchParams.get("entity");

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where = {
      ...(userId ? { userId } : {}),
      ...(action ? { action: { contains: action, mode: "insensitive" as const } } : {}),
      ...(entity ? { entity: { contains: entity, mode: "insensitive" as const } } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Audit logs:", error);
    return NextResponse.json(
      { success: false, message: "Audit Logs লোড করা যায়নি" },
      { status: 500 }
    );
  }
}