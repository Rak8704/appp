
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(25).optional(),
  title: z.string().trim().min(5).max(250),
  content: z.string().trim().min(50).max(20000),
  source: z.string().trim().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "সঠিক সংবাদ তথ্য প্রদান করুন।",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const submission = await prisma.newsSubmission.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        title: data.title,
        content: data.content,
        source: data.source || null,
        status: "PENDING",
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "আপনার সংবাদ জমা হয়েছে। যাচাইয়ের পর প্রকাশের সিদ্ধান্ত নেওয়া হবে।",
        data: submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SUBMIT_NEWS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "সংবাদ জমা দেওয়া যায়নি।" },
      { status: 500 }
    );
  }
}
