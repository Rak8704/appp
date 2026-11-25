import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const statusSchema = z.object({
  isActive: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (id === admin.id) {
      return NextResponse.json(
        { success: false, message: "নিজের অ্যাকাউন্ট নিষ্ক্রিয় করতে পারবেন না" },
        { status: 400 }
      );
    }

    const parsed = statusSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক status প্রদান করুন" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!target) {
      return NextResponse.json(
        { success: false, message: "ইউজার পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    if (
      target.role === "SUPER_ADMIN" &&
      admin.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { success: false, message: "Super Admin পরিবর্তনের অনুমতি নেই" },
        { status: 403 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: parsed.data.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "ইউজার status আপডেট হয়েছে",
      data: updated,
    });
  } catch (error) {
    console.error("User Status API:", error);

    return NextResponse.json(
      { success: false, message: "Status পরিবর্তন করা যায়নি" },
      { status: 500 }
    );
  }
}