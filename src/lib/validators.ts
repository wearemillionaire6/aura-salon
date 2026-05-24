import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  message: z.string().min(10, "Just a few more words — at least 10 characters."),
});
export type ContactForm = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email."),
});
export type Newsletter = z.infer<typeof newsletterSchema>;

export const bookingDetailsSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(10, "Enter a valid phone number."),
  notes: z.string().max(500, "Notes must be under 500 characters.").optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to the cancellation policy." }) }),
});
export type BookingDetails = z.infer<typeof bookingDetailsSchema>;
