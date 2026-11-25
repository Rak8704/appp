
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10));

    const where = {
      isActive: true,
      OR: [
        { deadline: null },
        { deadline: { gte: new Date() } },
      ],
    };

    const [jobs, total] = await prisma.$transaction([
      prisma.career.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          department: true,
          location: true,
          employmentType: true,
          salary: true,
          deadline: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.career.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("CAREER_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Career List পাওয়া যায়নি।" },
      { status: 500 }
    );
  }
}
