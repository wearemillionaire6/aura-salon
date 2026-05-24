import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendReminderEmail } from "@/lib/email/sender";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: reminders, error } = await supabase.rpc("get_upcoming_reminders_admin");

  if (error) {
    console.error("Error fetching reminders from DB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`Found ${reminders?.length || 0} reminders to send.`);

  const results = [];

  if (reminders && reminders.length > 0) {
    for (const r of reminders) {
      try {
        await sendReminderEmail({
          email: r.customer_email,
          name: r.customer_name,
          reference: r.reference,
          date: r.booking_date,
          time: r.start_time,
          type: r.reminder_type as "24h" | "2h",
        });

        const fieldToUpdate = r.reminder_type === "2h" ? { reminder_2h_sent: true } : { reminder_24h_sent: true };

        const { error: updateError } = await supabase
          .from("bookings")
          .update(fieldToUpdate)
          .eq("id", r.booking_id);

        if (updateError) {
          console.error(`Failed to update booking reminder sent flag for ${r.booking_id}:`, updateError);
        }

        results.push({ booking_id: r.booking_id, status: "sent", type: r.reminder_type });
      } catch (err: any) {
        console.error(`Failed to send email to ${r.customer_email}:`, err);
        results.push({ booking_id: r.booking_id, status: "failed", error: err.message });
      }
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
