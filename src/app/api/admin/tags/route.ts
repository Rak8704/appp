import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const createSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(150),
});

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 50, 1),
      100
    );

    const search = searchParams.get("search")?.trim();

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        include: {
          _count: {
            select: { articles: true },
          },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tag.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin Tags API:", error);

    return NextResponse.json(
      { success: false, message: "Tags লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const parsed = createSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Tag-এর তথ্য সঠিক নয়",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: parsed.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "নতুন Tag তৈরি হয়েছে",
        data: tag,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Tag API:", error);

    return NextResponse.json(
      { success: false, message: "Tag তৈরি করা যায়নি" },
      { status: 500 }
    );
  }
}