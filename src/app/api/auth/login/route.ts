import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createAuthToken, COOKIE_NAME } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "সঠিক Email ও Password প্রদান করুন।",
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Email অথবা Password সঠিক নয়।",
        },
        { status: 401 }
      );
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      return NextResponse.json(
        {
          success: false,
          message: "Email অথবা Password সঠিক নয়।",
        },
        { status: 401 }
      );
    }

    const token = await createAuthToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Login সফল হয়েছে।",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Login করা সম্ভব হয়নি।",
      },
      { status: 500 }
    );
  }
}