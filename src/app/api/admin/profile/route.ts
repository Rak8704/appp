
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { compare, hash } from "bcryptjs";

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile GET:", error);

    return NextResponse.json(
      { success: false, message: "Profile লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
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
        { success: false, message: "নতুন Password কমপক্ষে ১০ অক্ষরের হতে হবে" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Account পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const emailChanged = email !== currentUser.email;
    const passwordChanged = Boolean(newPassword);

    if (emailChanged || passwordChanged) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "বর্তমান Password প্রয়োজন" },
          { status: 400 }
        );
      }

      const validPassword = await compare(
        currentPassword,
        currentUser.password
      );

      if (!validPassword) {
        return NextResponse.json(
          { success: false, message: "বর্তমান Password সঠিক নয়" },
          { status: 400 }
        );
      }
    }

    const passwordHash = passwordChanged
      ? await hash(newPassword, 12)
      : undefined;

    const updated = await prisma.user.update({
      where: { id: admin.id },
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
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile সফলভাবে আপডেট হয়েছে",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("Profile PATCH:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "এই Email ইতোমধ্যে ব্যবহার করা হয়েছে" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Profile আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}
