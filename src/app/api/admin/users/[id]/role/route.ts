
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  role: z.enum(["ADMIN", "EDITOR", "REPORTER", "READER"]),
});

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const admin = await getAdminUser();

    if (!admin || admin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "শুধু SUPER_ADMIN Role পরিবর্তন করতে পারবেন" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const validation = schema.safeParse(await request.json());

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Role নির্বাচন করুন" },
        { status: 400 }
      );
    }

    if (admin.id === id) {
      return NextResponse.json(
        { success: false, message: "নিজের Role পরিবর্তন করা যাবে না" },
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

    if (target.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "অন্য SUPER_ADMIN-এর Role পরিবর্তন করা যাবে না" },
        { status: 403 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: validation.data.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User Role পরিবর্তন হয়েছে",
      data: user,
    });
  } catch (error) {
    console.error("ADMIN_USER_ROLE_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Role পরিবর্তন করা যায়নি" },
      { status: 500 }
    );
  }
}
