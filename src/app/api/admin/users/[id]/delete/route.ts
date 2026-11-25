
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: Context) {
  try {
    const admin = await getAdminUser();

    if (!admin || admin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "শুধু SUPER_ADMIN User Delete করতে পারবেন" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (admin.id === id) {
      return NextResponse.json(
        { success: false, message: "নিজের অ্যাকাউন্ট Delete করা যাবে না" },
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
        { success: false, message: "SUPER_ADMIN অ্যাকাউন্ট Delete করা যাবে না" },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "ইউজার Delete করা হয়েছে",
    });
  } catch (error) {
    console.error("ADMIN_USER_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "ইউজার Delete করা যায়নি। সংশ্লিষ্ট ডাটার সম্পর্ক পরীক্ষা করুন।",
      },
      { status: 500 }
    );
  }
}
