import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().nullable(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "সঠিক তথ্য প্রদান করুন",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে",
        data: { id: contact.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API:", error);
    return NextResponse.json(
      { success: false, message: "বার্তা পাঠানো যায়নি" },
      { status: 500 }
    );
  }
}