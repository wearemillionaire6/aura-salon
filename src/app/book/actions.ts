"use server";

import { createClient } from "@/lib/supabase/server";
import { services, addons } from "@/data";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24-preview" as any, // fallback
});

interface BookingPayload {
  serviceIds: string[];
  addOnIds: string[];
  stylistId: string;
  date: string;
  time: string;
  details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
}

export async function initiateBooking(payload: BookingPayload) {
  const { serviceIds, addOnIds, stylistId, date, time, details } = payload;

  if (!serviceIds.length || !date || !time || !details.email || !details.name || !details.phone) {
    return { error: "Missing required booking details." };
  }

  const supabase = await createClient();

  // 1. Double-booking check
  const { data: conflictingBookings, error: conflictError } = await supabase
    .from("bookings")
    .select("id")
    .eq("booking_date", date)
    .eq("start_time", time.includes(":") && time.split(":").length === 2 ? time + ":00" : time)
    .eq("stylist_id", stylistId === "any" ? null : stylistId)
    .eq("status", "confirmed");

  if (conflictError) {
    console.error("Conflict check error:", conflictError);
    return { error: "Database error. Please try again." };
  }

  if (conflictingBookings && conflictingBookings.length > 0) {
    return { error: "This slot is no longer available. Please choose another time." };
  }

  // 2. Find or create customer via SECURITY DEFINER RPC to bypass SELECT/INSERT RLS restrictions for guest checkout
  const { data: { user } } = await supabase.auth.getUser();
  const { data: customerId, error: customerError } = await supabase
    .rpc("get_or_create_customer", {
      p_name: details.name,
      p_email: details.email,
      p_phone: details.phone,
      p_auth_user_id: user?.id || null,
    });

  if (customerError || !customerId) {
    console.error("Customer lookup/creation error via RPC:", customerError);
    return { error: "Failed to create or retrieve customer profile." };
  }

  // 3. Calculate Prices & Deposit
  const selectedServices = serviceIds
    .map((id) => services.find((x) => x.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const selectedAddons = addOnIds
    .map((id) => addons.find((x) => x.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);

  const totalServicesPrice = selectedServices.reduce((acc, s) => acc + s.priceUSD, 0);
  const totalAddonsPrice = selectedAddons.reduce((acc, a) => acc + a.priceUSD, 0);
  const totalPrice = totalServicesPrice + totalAddonsPrice;
  const depositCents = Math.round(totalPrice * 0.2 * 100); // 20% deposit

  // 4. Generate confirmation reference & Booking ID upfront (RLS-compliant insertion)
  const bookingId = crypto.randomUUID();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "AURA-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }

  // Calculate duration and end time
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.durationMin, 0) +
                        selectedAddons.reduce((acc, a) => acc + a.durationMin, 0);
  const [sh, sm] = time.split(":").map(Number);
  const startMins = sh * 60 + sm;
  const endMins = startMins + totalDuration;
  const eh = String(Math.floor(endMins / 60)).padStart(2, "0");
  const em = String(endMins % 60).padStart(2, "0");
  const endTime = `${eh}:${em}:00`;

  // 5. Determine Stripe Mode & Setup Checkout Session (if not mock)
  const hostHeaders = await headers();
  const origin = hostHeaders.get("origin") || "http://localhost:3000";

  const isStripeMock = !process.env.STRIPE_SECRET_KEY || 
                       process.env.STRIPE_SECRET_KEY.startsWith("sk_test_51MockKey") ||
                       process.env.STRIPE_SECRET_KEY === "placeholder_until_active";

  let stripeSessionId: string | null = null;
  let checkoutUrl = "";
  let bookingStatus = "pending";

  if (isStripeMock) {
    console.log(`[MOCK STRIPE CHECKOUT] Confirming booking immediately: ${bookingId} (Ref: ${ref})`);
    bookingStatus = "confirmed";
    checkoutUrl = `${origin}/book?step=confirmed&reference=${ref}&booking_id=${bookingId}`;
  } else {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Aura Salon Booking Deposit (${ref})`,
                description: `Services: ${selectedServices.map(s => s.name).join(", ")}. Date: ${date} at ${time}.`,
              },
              unit_amount: depositCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          booking_id: bookingId,
          reference: ref,
        },
        success_url: `${origin}/book?step=confirmed&reference=${ref}&booking_id=${bookingId}`,
        cancel_url: `${origin}/book?step=review`,
      });
      stripeSessionId = session.id;
      checkoutUrl = session.url || "";
    } catch (stripeError: any) {
      console.error("Stripe Checkout session creation error:", stripeError);
      return { error: `Stripe payment setup error: ${stripeError.message}` };
    }
  }

  // 6. Create booking (pure INSERT statement to avoid RETURNING/SELECT RLS restrictions)
  const { error: bookingError } = await supabase
    .from("bookings")
    .insert({
      id: bookingId,
      reference: ref,
      customer_id: customerId,
      stylist_id: stylistId === "any" ? null : stylistId,
      service_ids: serviceIds,
      booking_date: date,
      start_time: time.includes(":") && time.split(":").length === 2 ? time + ":00" : time,
      end_time: endTime,
      status: bookingStatus,
      deposit_paid_cents: depositCents,
      special_requests: details.notes,
      stripe_checkout_session_id: stripeSessionId,
    });

  if (bookingError) {
    console.error("Booking creation error:", bookingError);
    return { error: "Failed to create booking." };
  }

  // 7. Insert booking addons (pure INSERT statement)
  if (selectedAddons.length > 0) {
    const addonsToInsert = selectedAddons.map((a) => ({
      booking_id: bookingId,
      addon_id: a.id,
      addon_name: a.name,
      price_cents: Math.round(a.priceUSD * 100),
    }));
    const { error: addonsError } = await supabase.from("booking_addons").insert(addonsToInsert);
    if (addonsError) {
      console.error("Failed to insert booking addons:", addonsError);
    }
  }

  // 8. If mock stripe, trigger confirmation email immediately
  if (isStripeMock) {
    try {
      const { sendConfirmationEmail } = await import("@/lib/email/sender");
      await sendConfirmationEmail({
        email: details.email,
        name: details.name,
        reference: ref,
        date: date,
        time: time,
      });
    } catch (emailErr) {
      console.error("Failed to send confirmation email in mock flow:", emailErr);
    }
  }

  return { checkoutUrl };
}
