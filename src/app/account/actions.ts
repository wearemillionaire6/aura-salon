"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to cancel appointments." };
  }

  // Fetch booking to make sure it belongs to this customer
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!customer) {
    return { error: "Customer profile not found." };
  }

  // Update status to cancelled
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("customer_id", customer.id);

  if (error) {
    console.error("Cancel booking error:", error);
    return { error: "Failed to cancel booking. Please try again." };
  }

  revalidatePath("/account");
  return { success: true };
}

export async function updateCustomerProfile(formData: {
  name: string;
  phone: string;
  notes: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update your profile." };
  }

  const { error } = await supabase
    .from("customers")
    .update({
      full_name: formData.name,
      phone: formData.phone,
      notes: formData.notes,
    })
    .eq("auth_user_id", user.id);

  if (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile." };
  }

  revalidatePath("/account");
  return { success: true };
}
