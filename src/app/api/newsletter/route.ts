
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email().max(254),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Email প্রদান করুন।" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing?.status === "ACTIVE") {
      return NextResponse.json({
        success: true,
        message: "এই Email ইতিমধ্যে Newsletter-এ যুক্ত আছে।",
      });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        status: "ACTIVE",
        unsubscribedAt: null,
        subscribedAt: new Date(),
      },
      create: { email },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Newsletter Subscription সফল হয়েছে।",
        data: subscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("NEWSLETTER_SUBSCRIBE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Subscription করা যায়নি।" },
      { status: 500 }
    );
  }
}
