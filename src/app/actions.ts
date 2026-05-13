"use server";

import { Resend } from "resend";
import { inquirySchema, type InquiryInput } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const adminEmail = process.env.RESEND_TO_EMAIL ?? siteConfig.email;

export type FormState = {
  success: boolean;
  message: string;
};

export async function submitInquiry(input: InquiryInput): Promise<FormState> {
  const parsed = inquirySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please check your form details"
    };
  }

  try {
    const data = parsed.data;

    if (prisma.inquiry?.create) {
      await prisma.inquiry.create({
        data: {
          parentName: data.parentName,
          parentEmail: data.parentEmail,
          childAge: data.childAge,
          country: data.country,
          whatsapp: data.whatsapp,
          preferredTime: data.preferredTime,
          message: data.message
        }
      });
    }

    if (resend) {
      await resend.emails.send({
        from: "Quran Academy <onboarding@resend.dev>",
        to: [adminEmail],
        subject: "New Free Trial Inquiry",
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>Parent Name:</strong> ${data.parentName}</p>
          <p><strong>Parent Email:</strong> ${data.parentEmail}</p>
          <p><strong>Child Age:</strong> ${data.childAge}</p>
          <p><strong>Country:</strong> ${data.country}</p>
          <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
          <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
          <p><strong>Message:</strong> ${data.message}</p>
        `
      });

      await resend.emails.send({
        from: "Hafiz Kamran Hameed Quran Academy <onboarding@resend.dev>",
        to: [data.parentEmail],
        subject: "Free Quran Trial Request Received",
        html: `
          <h2>Assalamu Alaikum ${data.parentName},</h2>
          <p>JazakAllah khair for contacting ${siteConfig.name}.</p>
          <p>We have received your request and our team will contact you shortly on WhatsApp to schedule your free trial class.</p>
          <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
          <p>May Allah bless your Quran learning journey.</p>
        `
      });
    }

    return {
      success: true,
      message: "Inquiry submitted successfully. We will contact you shortly."
    };
  } catch (error) {
    console.error("Inquiry submission failed", error);
    return {
      success: false,
      message: "Something went wrong. Please try again."
    };
  }
}
