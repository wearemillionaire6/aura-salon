import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AccountTabs } from "./_components/AccountTabs";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  // Fetch or create customer profile
  let { data: customer, error: fetchError } = await supabase
    .from("customers")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching customer profile:", fetchError);
  }

  if (!customer) {
    // Fallback: try finding by email
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("*")
      .eq("email", user.email!)
      .maybeSingle();

    if (existingCustomer) {
      // Link user account
      const { data: updatedCustomer } = await supabase
        .from("customers")
        .update({ auth_user_id: user.id })
        .eq("id", existingCustomer.id)
        .select("*")
        .single();
      customer = updatedCustomer;
    } else {
      // Create new customer profile
      const { data: newCustomer, error: insertError } = await supabase
        .from("customers")
        .insert({
          auth_user_id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split("@")[0],
          phone: user.user_metadata?.phone || "",
        })
        .select("*")
        .single();
      
      if (insertError) {
        console.error("Failed to create customer profile:", insertError);
      } else {
        customer = newCustomer;
      }
    }
  }

  // Fetch real appointments for this customer
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      reference,
      booking_date,
      start_time,
      end_time,
      status,
      deposit_paid_cents,
      stylist_id,
      service_ids,
      booking_addons (
        addon_id,
        addon_name,
        price_cents
      )
    `)
    .eq("customer_id", customer?.id)
    .order("booking_date", { ascending: false });

  return (
    <Container className="py-10 lg:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            My account
          </p>
          <h1 className="mt-2 font-display text-4xl text-[var(--color-ink-900)] sm:text-5xl">
            Welcome back, {customer?.full_name?.split(" ")[0] || "Client"}.
          </h1>
          <p className="text-xs text-[var(--color-ink-500)] mt-1">
            Signed in as <strong>{user.email}</strong>
          </p>
        </div>
      </div>
      <AccountTabs 
        customer={customer} 
        bookings={bookings || []} 
      />
    </Container>
  );
}
