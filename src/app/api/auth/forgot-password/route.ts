
import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email().max(254),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Email প্রদান করুন।" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // একই response ব্যবহার করে Account Enumeration কমানো।
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Account থাকলে Password Reset নির্দেশনা পাঠানো হবে।",
      });
    }

    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      }),
      prisma.passwordResetToken.create({
        data: {
          token: hashedToken,
          userId: user.id,
          expiresAt,
        },
      }),
    ]);

    // Development testing only. Production-এ Email Provider দিয়ে পাঠাতে হবে।
    if (process.env.NODE_ENV !== "production") {
      console.info("PASSWORD_RESET_TOKEN:", rawToken);
    }

    return NextResponse.json({
      success: true,
      message: "Account থাকলে Password Reset নির্দেশনা পাঠানো হবে।",
    });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "অনুরোধ সম্পন্ন করা যায়নি।" },
      { status: 500 }
    );
  }
}
