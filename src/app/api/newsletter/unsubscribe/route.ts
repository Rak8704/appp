
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(10).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Unsubscribe Token দিন।" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: parsed.data.token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: "Unsubscribe Token পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    if (subscriber.status === "UNSUBSCRIBED") {
      return NextResponse.json({
        success: true,
        message: "আপনি ইতিমধ্যে Unsubscribe করেছেন।",
      });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Newsletter থেকে Unsubscribe সফল হয়েছে।",
    });
  } catch (error) {
    console.error("NEWSLETTER_UNSUBSCRIBE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Unsubscribe করা যায়নি।" },
      { status: 500 }
    );
  }
}
