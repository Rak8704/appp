
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { hash } from "bcryptjs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: Context
) {
  try {
    const admin = await getAdminUser();

    if (!admin || admin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "শুধু SUPER_ADMIN এই তথ্য দেখতে পারবে" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "User পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("User Account GET:", error);

    return NextResponse.json(
      { success: false, message: "Account তথ্য লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  try {
    const admin = await getAdminUser();

    if (!admin || admin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "শুধু SUPER_ADMIN Account পরিবর্তন করতে পারবে" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (id === admin.id) {
      return NextResponse.json(
        {
          success: false,
          message: "নিজের Account পরিবর্তনের জন্য Profile পেজ ব্যবহার করুন",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, message: "নাম ২-১০০ অক্ষরের মধ্যে হতে হবে" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "সঠিক Email দিন" },
        { status: 400 }
      );
    }

    if (newPassword && newPassword.length < 10) {
      return NextResponse.json(
        { success: false, message: "Password কমপক্ষে ১০ অক্ষরের হতে হবে" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!target || target.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "এই Account পরিবর্তন করা যাবে না" },
        { status: 404 }
      );
    }

    const passwordHash = newPassword
      ? await hash(newPassword, 12)
      : undefined;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        ...(passwordHash ? { password: passwordHash } : {}),
      },
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
      message: newPassword
        ? "Email এবং Password সফলভাবে আপডেট হয়েছে"
        : "Account তথ্য সফলভাবে আপডেট হয়েছে",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("User Account PATCH:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "এই Email অন্য Account-এ ব্যবহার হচ্ছে" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Account আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}
