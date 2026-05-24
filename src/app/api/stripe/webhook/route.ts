import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24-preview" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Received Stripe event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    const reference = session.metadata?.reference;

    if (bookingId) {
      console.log(`Fulfilling booking: ${bookingId} (Ref: ${reference})`);
      
      const supabase = createAdminClient();
      const { data: success, error: updateError } = await supabase
        .rpc("confirm_booking_admin", {
          booking_uuid: bookingId,
          payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
        });

      if (updateError || !success) {
        console.error("Failed to update booking status in webhook:", updateError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      // Fetch booking details to send confirmation email
      const { data: booking } = await supabase
        .from("bookings")
        .select(`
          id,
          reference,
          booking_date,
          start_time,
          customer_id
        `)
        .eq("id", bookingId)
        .single();

      if (!booking) {
        console.error("Booking not found after confirmation in webhook");
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      console.log("Booking successfully confirmed in DB:", booking);

      // Fetch customer details using customer_id
      const { data: customer } = await supabase
        .from("customers")
        .select("full_name, email, phone")
        .eq("id", booking.customer_id)
        .single();

      if (customer) {
        try {
          const { sendConfirmationEmail } = await import("@/lib/email/sender");
          await sendConfirmationEmail({
            email: customer.email,
            name: customer.full_name,
            reference: booking.reference,
            date: booking.booking_date,
            time: booking.start_time,
          });
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
