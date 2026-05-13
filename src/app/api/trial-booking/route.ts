import { NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations";
import { siteConfig } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const adminEmail = process.env.RESEND_TO_EMAIL ?? siteConfig.email;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.trialBooking.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Failed to fetch trial bookings", error);
    return NextResponse.json(
      { success: false, message: "Could not fetch bookings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Please check your form details."
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const booking = await prisma.trialBooking.create({
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

    if (resend) {
      await resend.emails.send({
        from: "Quran Academy <onboarding@resend.dev>",
        to: [adminEmail],
        subject: "New Free Trial Booking",
        html: `
          <h2>New Trial Booking</h2>
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

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully. We will contact you shortly.",
      booking
    });
  } catch (error) {
    console.error("Trial booking submission failed", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
