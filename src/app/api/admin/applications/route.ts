import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  id: z.string().min(1),
  status: z.string().trim().min(1).max(50).optional(),
  adminNotes: z.string().max(5000).nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100);
    const careerId = searchParams.get("careerId");
    const status = searchParams.get("status");

    const where = {
      ...(careerId ? { careerId } : {}),
      ...(status ? { status: status as never } : {}),
    };

    const [applications, total] = await Promise.all([
      prisma.careerApplication.findMany({
        where,
        include: {
          career: {
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.careerApplication.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Career applications:", error);
    return NextResponse.json({ success: false, message: "Applications লোড করা যায়নি" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Application তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, status, adminNotes } = parsed.data;

    if (status === undefined && adminNotes === undefined) {
      return NextResponse.json({ success: false, message: "পরিবর্তন করার তথ্য দিন" }, { status: 400 });
    }

    const application = await prisma.careerApplication.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status: status as never } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
      include: {
        career: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application আপডেট হয়েছে",
      data: application,
    });
  } catch (error) {
    console.error("Update application:", error);
    return NextResponse.json({ success: false, message: "Application আপডেট করা যায়নি" }, { status: 500 });
  }
}