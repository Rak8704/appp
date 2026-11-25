import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const { id } = await params;
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "সঠিক status দিন" }, { status: 400 });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({
      success: true,
      message: "Comment status আপডেট হয়েছে",
      data: comment,
    });
  } catch (error) {
    console.error("Comment moderation:", error);
    return NextResponse.json({ success: false, message: "Comment আপডেট করা যায়নি" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.comment.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Comment মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    console.error("Delete comment:", error);
    return NextResponse.json({ success: false, message: "Comment মুছে ফেলা যায়নি" }, { status: 500 });
  }
}