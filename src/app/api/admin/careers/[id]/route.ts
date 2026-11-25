
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const updateSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  slug: z.string().trim().min(2).max(200).optional(),
  department: z.string().max(150).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  employmentType: z.string().max(100).nullable().optional(),
  description: z.string().min(10).optional(),
  requirements: z.string().nullable().optional(),
  salary: z.string().max(150).nullable().optional(),
  deadline: z.coerce.date().nullable().optional(),
  isActive: z.boolean().optional(),
});

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const parsed = updateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Career তথ্য সঠিক নয়",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existing = await prisma.career.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Job পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const career = await prisma.career.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
      success: true,
      message: "Job আপডেট হয়েছে",
      data: career,
    });
  } catch (error) {
    console.error("Career update:", error);

    return NextResponse.json(
      { success: false, message: "Job আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existing = await prisma.career.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Job পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    if (existing._count.applications > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "এই Job-এ Application আছে। Delete না করে Inactive করুন।",
        },
        { status: 409 }
      );
    }

    await prisma.career.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Job Delete হয়েছে",
    });
  } catch (error) {
    console.error("Career delete:", error);

    return NextResponse.json(
      { success: false, message: "Job Delete করা যায়নি" },
      { status: 500 }
    );
  }
}
