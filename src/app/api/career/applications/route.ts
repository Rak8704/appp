
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const applicationSchema = z.object({
  careerId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(25),
  resumeUrl: z.string().url().max(1000).optional().or(z.literal("")),
  coverLetter: z.string().max(10000).optional(),
});

const statusSchema = z.object({
  email: z.string().trim().email().max(254),
});

export async function GET(request: NextRequest) {
  try {
    const parsed = statusSchema.safeParse({
      email: request.nextUrl.searchParams.get("email"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Email প্রদান করুন।" },
        { status: 400 }
      );
    }

    const applications = await prisma.careerApplication.findMany({
      where: {
        email: parsed.data.email.toLowerCase(),
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        career: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("CAREER_APPLICATIONS_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Applications পাওয়া যায়নি।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = applicationSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "সঠিক Application তথ্য প্রদান করুন।",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const email = data.email.toLowerCase();

    const career = await prisma.career.findFirst({
      where: {
        id: data.careerId,
        isActive: true,
        OR: [
          { deadline: null },
          { deadline: { gte: new Date() } },
        ],
      },
      select: { id: true },
    });

    if (!career) {
      return NextResponse.json(
        { success: false, message: "Job আর Application গ্রহণ করছে না।" },
        { status: 404 }
      );
    }

    const application = await prisma.careerApplication.create({
      data: {
        careerId: data.careerId,
        name: data.name,
        email,
        phone: data.phone,
        resumeUrl: data.resumeUrl || null,
        coverLetter: data.coverLetter || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job Application সফলভাবে জমা হয়েছে।",
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CAREER_APPLICATION_POST_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Application জমা দেওয়া যায়নি।" },
      { status: 500 }
    );
  }
}
