import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();

    const data = Object.fromEntries(
      settings.map((setting) => [setting.key, setting.value])
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Site settings API:", error);
    return NextResponse.json(
      { success: false, message: "সাইট সেটিংস লোড করা যায়নি" },
      { status: 500 }
    );
  }
}