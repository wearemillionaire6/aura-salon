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

  // 2. Find or create customer
  let customerId: string;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", details.email)
    .maybeSingle();

  if (existingCustomer) {
    customerId = existingCustomer.id;
    await supabase
      .from("customers")
      .update({ full_name: details.name, phone: details.phone })
      .eq("id", customerId);
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: newCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({
        full_name: details.name,
        email: details.email,
        phone: details.phone,
        auth_user_id: user?.id || null,
      })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      console.error("Customer creation error:", customerError);
      return { error: "Failed to create customer profile." };
    }
    customerId = newCustomer.id;
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

  // 4. Generate confirmation reference
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

  // 5. Create pending booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      reference: ref,
      customer_id: customerId,
      stylist_id: stylistId === "any" ? null : stylistId,
      service_ids: serviceIds,
      booking_date: date,
      start_time: time.includes(":") && time.split(":").length === 2 ? time + ":00" : time,
      end_time: endTime,
      status: "pending",
      deposit_paid_cents: depositCents,
      special_requests: details.notes,
    })
    .select("id")
    .single();

  if (bookingError || !booking) {
    console.error("Booking creation error:", bookingError);
    return { error: "Failed to create booking." };
  }

  // 6. Insert booking addons
  if (selectedAddons.length > 0) {
    const addonsToInsert = selectedAddons.map((a) => ({
      booking_id: booking.id,
      addon_id: a.id,
      addon_name: a.name,
      price_cents: Math.round(a.priceUSD * 100),
    }));
    await supabase.from("booking_addons").insert(addonsToInsert);
  }

  // 7. Create Stripe Checkout Session
  try {
    const hostHeaders = await headers();
    const origin = hostHeaders.get("origin") || "http://localhost:3000";

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
        booking_id: booking.id,
        reference: ref,
      },
      success_url: `${origin}/book?step=confirmed&reference=${ref}&booking_id=${booking.id}`,
      cancel_url: `${origin}/book?step=review`,
    });

    await supabase
      .from("bookings")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", booking.id);

    return { checkoutUrl: session.url };
  } catch (stripeError: any) {
    console.error("Stripe Checkout session creation error:", stripeError);
    // Delete pending booking so it's not orphaned
    await supabase.from("bookings").delete().eq("id", booking.id);
    return { error: `Stripe payment setup error: ${stripeError.message}` };
  }
}
