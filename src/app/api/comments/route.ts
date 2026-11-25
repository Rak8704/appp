
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const commentSchema = z.object({
  articleId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  content: z.string().trim().min(3).max(5000),
});

export async function GET(request: NextRequest) {
  try {
    const articleId = request.nextUrl.searchParams.get("articleId");
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 20));

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: "Article ID প্রয়োজন।" },
        { status: 400 }
      );
    }

    const [comments, total] = await prisma.$transaction([
      prisma.comment.findMany({
        where: {
          articleId,
          status: "APPROVED",
          article: {
            status: "PUBLISHED",
            publishedAt: { lte: new Date() },
          },
        },
        select: {
          id: true,
          name: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          articleId,
          status: "APPROVED",
          article: {
            status: "PUBLISHED",
            publishedAt: { lte: new Date() },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("COMMENTS_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Comments পাওয়া যায়নি।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = commentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "সঠিক Comment তথ্য দিন।",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { articleId, name, email, content } = parsed.data;

    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "সংবাদ পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    let userId: string | undefined;
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (token) {
      const session = await verifyAuthToken(token);

      if (session) {
        const user = await prisma.user.findUnique({
          where: { id: session.userId },
          select: { id: true, isActive: true },
        });

        if (user?.isActive) userId = user.id;
      }
    }

    const comment = await prisma.comment.create({
      data: {
        articleId,
        name,
        email: email.toLowerCase(),
        content,
        status: "PENDING",
        ...(userId ? { userId } : {}),
      },
      select: {
        id: true,
        name: true,
        content: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment জমা হয়েছে। অনুমোদনের পর প্রকাশিত হবে।",
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("COMMENTS_POST_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Comment জমা দেওয়া যায়নি।" },
      { status: 500 }
    );
  }
}
