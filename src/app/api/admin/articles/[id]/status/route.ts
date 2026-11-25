import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Article status প্রদান করুন" },
        { status: 400 }
      );
    }

    const existing = await prisma.article.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Article পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const status = parsed.data.status;

    const article = await prisma.article.update({
      where: { id },
      data: {
        status,
        ...(status === "PUBLISHED"
          ? { publishedAt: new Date() }
          : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article status পরিবর্তন হয়েছে",
      data: article,
    });
  } catch (error) {
    console.error("Article Status API:", error);

    return NextResponse.json(
      { success: false, message: "Article status পরিবর্তন করা যায়নি" },
      { status: 500 }
    );
  }
}