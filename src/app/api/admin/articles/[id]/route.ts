import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const updateSchema = z.object({
  title: z.string().trim().min(5).max(300).optional(),
  slug: z.string().trim().min(3).max(300).optional(),
  excerpt: z.string().max(1000).nullable().optional(),
  content: z.string().min(10).optional(),
  coverImage: z.string().max(1000).nullable().optional(),
  categoryId: z.string().min(1).optional(),
  authorId: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
});

export async function GET(
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

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        comments: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("Article Details API:", error);

    return NextResponse.json(
      { success: false, message: "Article লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

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
    const parsed = updateSchema.safeParse(await request.json());

    if (!parsed.success || Object.keys(parsed.data || {}).length === 0) {
      return NextResponse.json(
        { success: false, message: "সঠিক Article তথ্য প্রদান করুন" },
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

    if (parsed.data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parsed.data.categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { success: false, message: "Category পাওয়া যায়নি" },
          { status: 400 }
        );
      }
    }

    if (parsed.data.authorId) {
      const author = await prisma.user.findFirst({
        where: {
          id: parsed.data.authorId,
          isActive: true,
        },
        select: { id: true },
      });

      if (!author) {
        return NextResponse.json(
          { success: false, message: "Author পাওয়া যায়নি" },
          { status: 400 }
        );
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: parsed.data,
      include: {
        category: true,
        author: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article আপডেট হয়েছে",
      data: article,
    });
  } catch (error) {
    console.error("Update Article API:", error);

    return NextResponse.json(
      { success: false, message: "Article আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}