
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const job = await prisma.career.findFirst({
      where: {
        slug,
        isActive: true,
        OR: [
          { deadline: null },
          { deadline: { gte: new Date() } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        department: true,
        location: true,
        employmentType: true,
        description: true,
        requirements: true,
        salary: true,
        deadline: true,
        createdAt: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("CAREER_DETAILS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Job Details পাওয়া যায়নি।" },
      { status: 500 }
    );
  }
}
