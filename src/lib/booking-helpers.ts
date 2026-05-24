import { availability, services, stylists } from "@/data";
import type { StylistAvailability } from "@/data/types";
import { addDays, format, parseISO } from "date-fns";

const SLOT_INCREMENT = 30; // minutes

export function getNextDays(
  n: number,
): { date: string; label: string; weekday: string }[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = addDays(today, i);
    return {
      date: format(d, "yyyy-MM-dd"),
      label: format(d, "MMM d"),
      weekday: format(d, "EEE"),
    };
  });
}

const WEEKDAY_KEYS: Record<string, keyof StylistAvailability["weekly"]> = {
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
  Sun: "sun",
};

export function getSlotsForStylistOnDate(
  stylistId: string,
  dateISO: string,
  durationMin: number,
): string[] {
  const av = availability.find((a) => a.stylistId === stylistId);
  if (!av) return [];
  if (av.daysOff.includes(dateISO)) return [];
  const weekday = format(parseISO(dateISO), "EEE");
  const key = WEEKDAY_KEYS[weekday];
  const windows = av.weekly[key];
  if (!windows || windows.length === 0) return [];

  // Generate candidate slots in increments
  const slots: string[] = [];
  for (const w of windows) {
    const [openH, openM] = w.from.split(":").map(Number);
    const [closeH, closeM] = w.to.split(":").map(Number);
    let mins = openH * 60 + openM;
    const last = closeH * 60 + closeM - durationMin;
    while (mins <= last) {
      const hh = String(Math.floor(mins / 60)).padStart(2, "0");
      const mm = String(mins % 60).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      mins += SLOT_INCREMENT;
    }
  }
  // Remove slots that conflict with booked
  const booked = av.bookedSlots.filter((b) => b.date === dateISO);
  return slots.filter((s) => {
    const [sh, sm] = s.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = start + durationMin;
    return !booked.some((b) => {
      const [bh, bm] = b.time.split(":").map(Number);
      const bStart = bh * 60 + bm;
      const bEnd = bStart + b.durationMin;
      return start < bEnd && end > bStart;
    });
  });
}

export function getSlotsForAnyStylist(
  dateISO: string,
  durationMin: number,
  serviceIds: string[],
): { stylistId: string; slot: string }[] {
  // For "any available" — flatten earliest available slot per stylist who can perform ALL chosen services
  const eligible = stylists.filter((s) =>
    serviceIds.every((sid) => {
      const svc = services.find((x) => x.id === sid);
      return svc?.eligibleStylistIds.includes(s.id);
    }),
  );
  const result: { stylistId: string; slot: string }[] = [];
  for (const sty of eligible) {
    const slots = getSlotsForStylistOnDate(sty.id, dateISO, durationMin);
    if (slots.length) result.push({ stylistId: sty.id, slot: slots[0] });
  }
  return result;
}

export function formatPrice(priceUSD: number, priceFrom: boolean = false): string {
  return `${priceFrom ? "from " : ""}$${priceUSD.toLocaleString("en-US")}`;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
