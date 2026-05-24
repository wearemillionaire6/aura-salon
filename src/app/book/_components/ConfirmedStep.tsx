"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/lib/booking-store";
import { services, addons, stylists } from "@/data";
import { formatDuration, formatPrice } from "@/lib/booking-helpers";
import { FadeUp } from "@/components/motion/FadeUp";
import { CalendarPlus, CheckCircle2, MapPin, RotateCcw, User } from "lucide-react";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toICSDateUTC(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
    d.getUTCDate()
  )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(
    d.getUTCSeconds()
  )}Z`;
}

function buildICS({
  ref,
  startISO,
  endISO,
  summary,
}: {
  ref: string;
  startISO: Date;
  endISO: Date;
  summary: string;
}): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aura Salon//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${ref}@aurasalon.example`,
    `DTSTAMP:${toICSDateUTC(new Date())}`,
    `DTSTART:${toICSDateUTC(startISO)}`,
    `DTEND:${toICSDateUTC(endISO)}`,
    `SUMMARY:Aura Salon: ${summary}`,
    "LOCATION:342 Bleecker St, New York, NY 10014",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function ConfirmedStep() {
  const ref = useBookingStore((s) => s.confirmationRef);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const addOnIds = useBookingStore((s) => s.addOnIds);
  const stylistId = useBookingStore((s) => s.stylistId);
  const date = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const details = useBookingStore((s) => s.details);
  const reset = useBookingStore((s) => s.reset);
  const totals = useBookingStore.getState().getTotals();

  const chosenServices = serviceIds
    .map((id) => services.find((x) => x.id === id))
    .filter(Boolean) as (typeof services)[number][];
  const chosenAddOns = addOnIds
    .map((id) => addons.find((x) => x.id === id))
    .filter(Boolean) as (typeof addons)[number][];
  const stylist =
    stylistId === "any" ? null : stylists.find((s) => s.id === stylistId);

  const handleDownloadICS = () => {
    if (!date || !time || !ref) return;
    const [hh, mm] = time.split(":").map(Number);
    const start = new Date(`${date}T00:00:00`);
    start.setHours(hh, mm, 0, 0);
    const end = new Date(start.getTime() + totals.durationMin * 60 * 1000);
    const summary = chosenServices.map((s) => s.name).join(", ") || "Appointment";
    const ics = buildICS({ ref, startISO: start, endISO: end, summary });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ref}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-16 lg:py-24">
      <FadeUp>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-sage-400)]/20">
            <CheckCircle2
              className="size-10 text-[var(--color-sage-600)]"
              aria-hidden
            />
          </span>
          <div>
            <h1 className="font-display text-4xl text-[var(--color-ink-900)] sm:text-5xl">
              You&apos;re on the books.
            </h1>
            <p className="mt-3 text-sm text-[var(--color-ink-500)]">
              Confirmation ref:{" "}
              <span className="font-mono text-[var(--color-ink-900)]">
                {ref ?? "—"}
              </span>
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              A receipt is on its way to {details.email || "your inbox"}.
            </p>
          </div>

          <Card className="w-full bg-[var(--color-bone-50)] text-left">
            <CardContent className="flex flex-col gap-4 py-6">
              <section className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                  Services
                </p>
                <ul className="flex flex-col gap-1 text-sm">
                  {chosenServices.map((svc) => (
                    <li
                      key={svc.id}
                      className="flex justify-between gap-2"
                    >
                      <span className="text-[var(--color-ink-900)]">{svc.name}</span>
                      <span className="text-[var(--color-ink-500)]">
                        {formatDuration(svc.durationMin)}
                      </span>
                    </li>
                  ))}
                  {chosenAddOns.map((addon) => (
                    <li
                      key={addon.id}
                      className="flex justify-between gap-2 text-[var(--color-ink-500)]"
                    >
                      <span>+ {addon.name}</span>
                      <span>{formatDuration(addon.durationMin)}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <Separator />
              <section className="flex flex-col gap-1 text-sm">
                <p className="inline-flex items-center gap-2 text-[var(--color-ink-900)]">
                  <User className="size-3.5 text-[var(--color-ink-500)]" aria-hidden />
                  {stylist ? stylist.name : "Any available stylist"}
                </p>
                <p className="text-[var(--color-ink-700)]">
                  {date && time
                    ? `${format(parseISO(date), "EEEE, MMMM d")} · ${time}`
                    : "—"}
                </p>
                <p className="inline-flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
                  <MapPin className="size-3" aria-hidden />
                  342 Bleecker St, New York, NY 10014
                </p>
              </section>
              <Separator />
              <section className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink-500)]">
                  {formatDuration(totals.durationMin)} · total
                </span>
                <span className="font-display text-xl text-[var(--color-ink-900)]">
                  {formatPrice(totals.priceUSD, totals.priceFrom)}
                </span>
              </section>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" size="lg" onClick={handleDownloadICS}>
              <CalendarPlus className="mr-1 size-4" />
              Add to calendar
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/account">Manage booking</Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="ghost"
              onClick={() => reset()}
            >
              <RotateCcw className="mr-1 size-4" />
              Book another
            </Button>
          </div>
        </div>
      </FadeUp>
    </Container>
  );
}
