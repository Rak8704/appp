import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  id: z.string().min(1),
  status: z.string().trim().min(1).max(50).optional(),
  adminNote: z.string().max(5000).nullable().optional(),
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
    const status = searchParams.get("status");

    const where = status ? { status: status as never } : {};

    const [submissions, total] = await Promise.all([
      prisma.newsSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsSubmission.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("News submissions:", error);
    return NextResponse.json({ success: false, message: "News submissions লোড করা যায়নি" }, { status: 500 });
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
        { success: false, message: "Submission তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, status, adminNote } = parsed.data;

    if (status === undefined && adminNote === undefined) {
      return NextResponse.json({ success: false, message: "পরিবর্তনের তথ্য দিন" }, { status: 400 });
    }

    const submission = await prisma.newsSubmission.update({
      where: { id },
      data: {
        ...(status !== undefined ? { status: status as never } : {}),
        ...(adminNote !== undefined ? { adminNote } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "News submission আপডেট হয়েছে",
      data: submission,
    });
  } catch (error) {
    console.error("Update submission:", error);
    return NextResponse.json({ success: false, message: "Submission আপডেট করা যায়নি" }, { status: 500 });
  }
}