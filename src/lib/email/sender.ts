import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const isMock = !resendApiKey || resendApiKey.startsWith("re_Mock") || resendApiKey === "placeholder";

const resend = isMock ? null : new Resend(resendApiKey);

interface EmailParams {
  email: string;
  name: string;
  reference: string;
  date: string;
  time: string;
  type?: "24h" | "2h";
}

export async function sendConfirmationEmail({ email, name, reference, date, time }: EmailParams) {
  const subject = `Your booking is confirmed: ${reference}`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1c1917; background-color: #fafaf9;">
      <h2 style="font-weight: 300; font-size: 24px; letter-spacing: 0.05em; border-bottom: 1px solid #e7e5e4; padding-bottom: 15px; margin-bottom: 20px;">
        AURA SALON
      </h2>
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6;">
        Hello ${name},
      </p>
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6;">
        Your appointment has been successfully confirmed. Here are your booking details:
      </p>
      
      <div style="background-color: #f5f5f4; border: 1px solid #e7e5e4; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #78716c; width: 120px;">Reference:</td>
            <td style="padding: 5px 0; font-size: 14px; font-weight: 500;">${reference}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #78716c;">Date:</td>
            <td style="padding: 5px 0; font-size: 14px;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #78716c;">Time:</td>
            <td style="padding: 5px 0; font-size: 14px;">${time}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 14px; color: #78716c; font-weight: 300; line-height: 1.6; margin-top: 30px;">
        Need to reschedule or cancel? You can manage your appointment from your customer portal at least 24 hours prior to the start time.
      </p>
      <p style="font-size: 14px; font-weight: 400; color: #78716c; margin-top: 40px; border-top: 1px solid #e7e5e4; padding-top: 15px;">
        Aura Salon · 342 Bleecker St, New York, NY 10014
      </p>
    </div>
  `;

  if (isMock) {
    console.log(`[MOCK EMAIL CONFIRMATION] Sending to ${email}:`, { subject, reference, date, time });
    return { success: true, mock: true };
  }

  try {
    const data = await resend!.emails.send({
      from: "Aura Salon <appointments@aurasalon.com>",
      to: [email],
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend confirmation email error:", error);
    throw error;
  }
}

export async function sendReminderEmail({ email, name, reference, date, time, type }: EmailParams) {
  const prefix = type === "2h" ? "2-Hour Reminder" : "24-Hour Reminder";
  const subject = `${prefix}: Your Aura Salon appointment is upcoming (${reference})`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1c1917; background-color: #fafaf9;">
      <h2 style="font-weight: 300; font-size: 24px; letter-spacing: 0.05em; border-bottom: 1px solid #e7e5e4; padding-bottom: 15px; margin-bottom: 20px;">
        AURA SALON
      </h2>
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6;">
        Hello ${name},
      </p>
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6;">
        This is a friendly reminder that you have an upcoming appointment with us:
      </p>
      
      <div style="background-color: #f5f5f4; border: 1px solid #e7e5e4; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #78716c; width: 120px;">Reference:</td>
            <td style="padding: 5px 0; font-size: 14px; font-weight: 500;">${reference}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #78716c;">Date:</td>
            <td style="padding: 5px 0; font-size: 14px;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 14px; color: #78716c;">Time:</td>
            <td style="padding: 5px 0; font-size: 14px;">${time}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 14px; color: #78716c; font-weight: 300; line-height: 1.6; margin-top: 30px;">
        We look forward to seeing you. Please arrive 5 minutes early for check-in.
      </p>
      <p style="font-size: 14px; font-weight: 400; color: #78716c; margin-top: 40px; border-top: 1px solid #e7e5e4; padding-top: 15px;">
        Aura Salon · 342 Bleecker St, New York, NY 10014
      </p>
    </div>
  `;

  if (isMock) {
    console.log(`[MOCK EMAIL REMINDER - ${type}] Sending to ${email}:`, { subject, reference, date, time });
    return { success: true, mock: true };
  }

  try {
    const data = await resend!.emails.send({
      from: "Aura Salon <appointments@aurasalon.com>",
      to: [email],
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend reminder email error:", error);
    throw error;
  }
}
