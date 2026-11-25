
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

async function getUserId(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifyAuthToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, isActive: true },
  });

  return user?.isActive ? user.id : null;
}

const schema = z.object({
  articleId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login করুন।" },
        { status: 401 }
      );
    }

    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 12));

    const [items, total] = await prisma.$transaction([
      prisma.readingHistory.findMany({
        where: { userId },
        include: {
          article: {
            include: {
              category: true,
              author: { select: { id: true, name: true, avatar: true } },
            },
          },
        },
        orderBy: { viewedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.readingHistory.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("READING_HISTORY_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Reading History পাওয়া যায়নি।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login করুন।" },
        { status: 401 }
      );
    }

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "সঠিক Article ID দিন।" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findFirst({
      where: {
        id: parsed.data.articleId,
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "সংবাদটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const history = await prisma.readingHistory.create({
      data: {
        userId,
        articleId: article.id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Reading History Update হয়েছে।", data: history },
      { status: 201 }
    );
  } catch (error) {
    console.error("READING_HISTORY_POST_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Reading History Save করা যায়নি।" },
      { status: 500 }
    );
  }
}
