import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const SEO_DEFAULTS = [
  { key: "seo_title", value: "" },
  { key: "seo_description", value: "" },
  { key: "seo_keywords", value: "" },
  { key: "seo_og_image", value: "" },
  { key: "seo_twitter_handle", value: "" },
  { key: "seo_canonical_url", value: "" },
  { key: "seo_robots", value: "index, follow" },
] as const;

const updateSchema = z.object({
  settings: z
    .array(
      z.object({
        key: z.string(),
        value: z.string().max(5000),
      })
    )
    .min(1),
});

const allowedKeys = new Set<string>(
  SEO_DEFAULTS.map((item) => item.key)
);

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET: SEO settings
export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const savedSettings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: SEO_DEFAULTS.map((item) => item.key),
        },
      },
      select: {
        key: true,
        value: true,
        updatedAt: true,
      },
    });

    const savedMap = new Map(
      savedSettings.map((setting) => [setting.key, setting])
    );

    const data = SEO_DEFAULTS.map((defaultSetting) => {
      const saved = savedMap.get(defaultSetting.key);

      return {
        key: defaultSetting.key,
        value: saved?.value ?? defaultSetting.value,
        updatedAt: saved?.updatedAt ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ADMIN_SEO_GET_ERROR:", error);
    return errorResponse("SEO settings load করতে সমস্যা হয়েছে", 500);
  }
}

// PATCH: Update SEO settings
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid SEO settings",
          errors: validation.error.flatten(),
        },
        { status: 422 }
      );
    }

    const settings = validation.data.settings;

    // Reject unknown keys and duplicate keys
    const receivedKeys = settings.map((setting) => setting.key);

    if (
      settings.some((setting) => !allowedKeys.has(setting.key)) ||
      new Set(receivedKeys).size !== receivedKeys.length
    ) {
      return errorResponse("এক বা একাধিক SEO setting key সঠিক নয়", 422);
    }

    // Validate canonical URL when provided
    const canonicalUrl = settings.find(
      (setting) => setting.key === "seo_canonical_url"
    )?.value;

    if (canonicalUrl) {
      try {
        new URL(canonicalUrl);
      } catch {
        return errorResponse("Canonical URL সঠিক URL হতে হবে", 422);
      }
    }

    // Validate Open Graph image URL when provided
    const ogImage = settings.find(
      (setting) => setting.key === "seo_og_image"
    )?.value;

    if (ogImage) {
      try {
        new URL(ogImage);
      } catch {
        return errorResponse("Open Graph image URL সঠিক URL হতে হবে", 422);
      }
    }

    await prisma.$transaction(
      settings.map((setting) =>
        prisma.siteSetting.upsert({
          where: {
            key: setting.key,
          },
          update: {
            value: setting.value,
          },
          create: {
            key: setting.key,
            value: setting.value,
          },
        })
      )
    );

    const data = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: SEO_DEFAULTS.map((item) => item.key),
        },
      },
      select: {
        key: true,
        value: true,
        updatedAt: true,
      },
    });

    const savedMap = new Map(data.map((item) => [item.key, item]));

    return NextResponse.json({
      success: true,
      message: "SEO settings successfully updated",
      data: SEO_DEFAULTS.map((item) => ({
        key: item.key,
        value: savedMap.get(item.key)?.value ?? item.value,
        updatedAt: savedMap.get(item.key)?.updatedAt ?? null,
      })),
    });
  } catch (error) {
    console.error("ADMIN_SEO_PATCH_ERROR:", error);
    return errorResponse("SEO settings update করতে সমস্যা হয়েছে", 500);
  }
}