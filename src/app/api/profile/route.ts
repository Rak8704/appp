
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyAuthToken(token);

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      bio: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user || !user.isActive) return null;

  return user;
}

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  avatar: z.string().max(500).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
}).refine(
  (data) =>
    data.name !== undefined ||
    data.avatar !== undefined ||
    data.bio !== undefined,
  { message: "Update করার জন্য অন্তত একটি Field দিন।" }
);

// GET: নিজের Profile দেখা
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "অনুগ্রহ করে Login করুন।" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("PROFILE_GET_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Profile পাওয়া যায়নি।" },
      { status: 500 }
    );
  }
}

// PATCH: নিজের Profile Update
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "অনুগ্রহ করে Login করুন।" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "সঠিক Profile তথ্য প্রদান করুন।",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.bio !== undefined && { bio: data.bio }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile সফলভাবে Update হয়েছে।",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Profile Update করা যায়নি।" },
      { status: 500 }
    );
  }
}
