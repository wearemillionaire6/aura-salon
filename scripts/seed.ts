import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Simple env loader for .env.local
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const firstEq = trimmed.indexOf("=");
          if (firstEq !== -1) {
            const key = trimmed.substring(0, firstEq).trim();
            const value = trimmed.substring(firstEq + 1).trim();
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    console.error("Error loading .env.local:", err);
  }
}

async function main() {
  loadEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseKey === "placeholder_until_active") {
    console.error("Supabase credentials not found or placeholder in .env.local. Please make sure the project is active and credentials are set.");
    process.exit(1);
  }

  console.log("Connecting to Supabase at:", supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  // Load JSON fixtures
  const servicesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/services.json"), "utf-8"));
  const stylistsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/stylists.json"), "utf-8"));
  const addonsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/addons.json"), "utf-8"));
  const availabilityData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/availability.json"), "utf-8"));

  console.log("Clearing existing data...");
  // Order matters due to foreign keys
  await supabase.from("booking_addons").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("availability").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("stylist_services").delete().neq("stylist_id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("stylists").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Inserting services...");
  const servicesToInsert = servicesData.map((s: any) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    category: s.category,
    description: s.description,
    duration_minutes: s.durationMin,
    price_cents: Math.round(s.priceUSD * 100),
    deposit_cents: s.depositUSD ? Math.round(s.depositUSD * 100) : Math.round((s.priceUSD * 0.2) * 100), // Default 20% deposit
    image_url: s.image,
    is_active: true,
  }));
  const { error: sError } = await supabase.from("services").insert(servicesToInsert);
  if (sError) throw sError;

  console.log("Inserting stylists...");
  const stylistsToInsert = stylistsData.map((st: any) => ({
    id: st.id,
    name: st.name,
    slug: st.slug,
    title: st.title,
    bio: st.bio,
    avatar_url: st.avatarUrl,
    specialties: st.specialties,
    is_active: true,
  }));
  const { error: stError } = await supabase.from("stylists").insert(stylistsToInsert);
  if (stError) throw stError;

  console.log("Inserting stylist_services relationships...");
  const stylistServicesToInsert: any[] = [];
  stylistsData.forEach((st: any) => {
    if (st.eligibleServiceIds) {
      st.eligibleServiceIds.forEach((sId: string) => {
        stylistServicesToInsert.push({
          stylist_id: st.id,
          service_id: sId,
        });
      });
    }
  });
  const { error: ssError } = await supabase.from("stylist_services").insert(stylistServicesToInsert);
  if (ssError) throw ssError;

  console.log("Inserting availability patterns...");
  const availabilityToInsert: any[] = [];
  const dayMap: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

  availabilityData.forEach((av: any) => {
    Object.entries(av.weekly).forEach(([day, slots]: [string, any]) => {
      const dayOfWeek = dayMap[day.toLowerCase()];
      if (slots && slots.length > 0) {
        slots.forEach((slot: any) => {
          availabilityToInsert.push({
            stylist_id: av.stylistId,
            day_of_week: dayOfWeek,
            start_time: slot.from + ":00",
            end_time: slot.to + ":00",
            is_active: true,
          });
        });
      }
    });
  });
  const { error: avError } = await supabase.from("availability").insert(availabilityToInsert);
  if (avError) throw avError;

  console.log("Seeding complete successfully!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
