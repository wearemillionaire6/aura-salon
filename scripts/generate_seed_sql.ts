import * as fs from "fs";
import * as path from "path";

async function main() {
  const servicesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/services.json"), "utf-8"));
  const stylistsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/stylists.json"), "utf-8"));
  const addonsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/addons.json"), "utf-8"));
  const availabilityData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/availability.json"), "utf-8"));

  let sql = "";

  sql += "-- Seed services\n";
  servicesData.forEach((s: any) => {
    const desc = s.description ? `'${s.description.replace(/'/g, "''")}'` : "NULL";
    const img = s.image ? `'${s.image.replace(/'/g, "''")}'` : "NULL";
    const priceCents = Math.round(s.priceUSD * 100);
    const depositCents = Math.round((s.priceUSD * 0.2) * 100);
    sql += `INSERT INTO public.services (id, name, slug, category, description, duration_minutes, price_cents, deposit_cents, image_url) VALUES ('${s.id}', '${s.name.replace(/'/g, "''")}', '${s.slug}', '${s.category}', ${desc}, ${s.durationMin}, ${priceCents}, ${depositCents}, ${img}) ON CONFLICT (id) DO NOTHING;\n`;
  });

  sql += "\n-- Seed stylists\n";
  stylistsData.forEach((st: any) => {
    const bio = st.bio ? `'${st.bio.replace(/'/g, "''")}'` : "NULL";
    const av = st.avatarUrl ? `'${st.avatarUrl.replace(/'/g, "''")}'` : "NULL";
    const specs = "ARRAY[" + st.specialties.map((sp: string) => `'${sp.replace(/'/g, "''")}'`).join(", ") + "]";
    sql += `INSERT INTO public.stylists (id, name, slug, title, bio, avatar_url, specialties) VALUES ('${st.id}', '${st.name.replace(/'/g, "''")}', '${st.slug}', '${st.title.replace(/'/g, "''")}', ${bio}, ${av}, ${specs}) ON CONFLICT (id) DO NOTHING;\n`;
  });

  sql += "\n-- Seed stylist_services\n";
  stylistsData.forEach((st: any) => {
    if (st.eligibleServiceIds) {
      st.eligibleServiceIds.forEach((sId: string) => {
        sql += `INSERT INTO public.stylist_services (stylist_id, service_id) VALUES ('${st.id}', '${sId}') ON CONFLICT DO NOTHING;\n`;
      });
    }
  });

  sql += "\n-- Seed availability\n";
  const dayMap: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  availabilityData.forEach((av: any) => {
    Object.entries(av.weekly).forEach(([day, slots]: [string, any]) => {
      const dayOfWeek = dayMap[day.toLowerCase()];
      if (slots && slots.length > 0) {
        slots.forEach((slot: any) => {
          sql += `INSERT INTO public.availability (stylist_id, day_of_week, start_time, end_time) VALUES ('${av.stylistId}', ${dayOfWeek}, '${slot.from}:00', '${slot.to}:00');\n`;
        });
      }
    });
  });

  fs.writeFileSync(path.join(process.cwd(), "supabase/seed.sql"), sql);
  console.log("SQL seed file generated at supabase/seed.sql");
}

main().catch((err) => {
  console.error(err);
});
