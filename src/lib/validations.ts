import { z } from "zod";

export const inquirySchema = z.object({
  parentName: z.string().min(2, "Parent name is required"),
  parentEmail: z.email("Valid email is required"),
  childAge: z.string().min(1, "Child age is required"),
  country: z.string().min(2, "Country is required"),
  whatsapp: z.string().min(7, "WhatsApp number is required").max(25, "WhatsApp number is too long"),
  preferredTime: z.string().min(2, "Preferred time is required"),
  message: z.string().min(10, "Please share details").max(600, "Message is too long")
});

export type InquiryInput = z.infer<typeof inquirySchema>;
