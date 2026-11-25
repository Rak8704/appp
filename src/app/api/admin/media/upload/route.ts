
import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MIME_EXTENSIONS: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const altTextValue = formData.get("altText");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "কোনো ফাইল পাওয়া যায়নি" },
        { status: 400 }
      );
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

    if (!isVideo && !isImage) {
      return NextResponse.json(
        {
          success: false,
          message: "শুধুমাত্র MP4, WebM, MOV, JPG, PNG ও WebP ফাইল আপলোড করা যাবে",
        },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size <= 0 || file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: isVideo
            ? "ভিডিও ফাইল সর্বোচ্চ ২০০ MB হতে পারবে"
            : "ছবির ফাইল সর্বোচ্চ ১০ MB হতে পারবে",
        },
        { status: 400 }
      );
    }

    const extension = MIME_EXTENSIONS[file.type];

    if (!extension) {
      return NextResponse.json(
        { success: false, message: "ফাইলের ধরন সমর্থিত নয়" },
        { status: 400 }
      );
    }

    const fileName = `${randomUUID()}${extension}`;
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "media"
    );

    await mkdir(uploadDirectory, { recursive: true });

    const filePath = path.join(uploadDirectory, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/media/${fileName}`;

    const altText =
      typeof altTextValue === "string"
        ? altTextValue.trim().slice(0, 500) || null
        : null;

    const media = await prisma.media.create({
      data: {
        fileName: file.name.slice(0, 255),
        fileUrl,
        fileType: file.type,
        fileSize: file.size,
        altText,
        uploadedById: admin.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "ফাইল সফলভাবে আপলোড হয়েছে",
        data: {
          ...media,
          fileUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Media upload error:", error);

    return NextResponse.json(
      { success: false, message: "ফাইল আপলোড করা যায়নি" },
      { status: 500 }
    );
  }
}
