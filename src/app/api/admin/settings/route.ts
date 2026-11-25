import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const schema = z.object({
  settings: z.array(
    z.object({
      key: z.string().trim().min(1).max(150),
      value: z.string().max(10000),
    })
  ).min(1).max(100),
});

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Admin settings:", error);
    return NextResponse.json({ success: false, message: "Settings লোড করা যায়নি" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ success: false, message: "অনুমতি নেই" }, { status: 403 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Settings তথ্য সঠিক নয়", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(
      parsed.data.settings.map(({ key, value }) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Settings আপডেট হয়েছে",
      data: results,
    });
  } catch (error) {
    console.error("Update settings:", error);
    return NextResponse.json({ success: false, message: "Settings আপডেট করা যায়নি" }, { status: 500 });
  }
}