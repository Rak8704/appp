
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(32).max(128),
  password: z.string().min(8).max(72),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Token ও Password প্রদান করুন।" },
        { status: 400 }
      );
    }

    const hashedToken = createHash("sha256")
      .update(parsed.data.token)
      .digest("hex");

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetRecord || resetRecord.expiresAt <= new Date()) {
      return NextResponse.json(
        { success: false, message: "Token অবৈধ অথবা মেয়াদ শেষ।" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(parsed.data.password, 12);

    // Transaction ensures token is consumed with the password update.
    await prisma.$transaction(async (tx) => {
      const result = await tx.passwordResetToken.deleteMany({
        where: {
          id: resetRecord.id,
          token: hashedToken,
          expiresAt: { gt: new Date() },
        },
      });

      if (result.count !== 1) {
        throw new Error("RESET_TOKEN_ALREADY_USED");
      }

      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.deleteMany({
        where: { userId: resetRecord.userId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Password সফলভাবে পরিবর্তন হয়েছে।",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RESET_TOKEN_ALREADY_USED") {
      return NextResponse.json(
        { success: false, message: "Token অবৈধ অথবা ইতিমধ্যে ব্যবহার হয়েছে।" },
        { status: 400 }
      );
    }

    console.error("RESET_PASSWORD_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Password পরিবর্তন করা যায়নি।" },
      { status: 500 }
    );
  }
}
