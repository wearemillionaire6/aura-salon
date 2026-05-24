"use client";

import { useBookingStore } from "@/lib/booking-store";
import { services, addons, stylists } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDuration, formatPrice } from "@/lib/booking-helpers";
import { Calendar, Clock, Sparkles, User } from "lucide-react";
import { format, parseISO } from "date-fns";

export function SummaryPanel() {
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const addOnIds = useBookingStore((s) => s.addOnIds);
  const stylistId = useBookingStore((s) => s.stylistId);
  const date = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const totals = useBookingStore.getState().getTotals();
  // also subscribe so panel re-renders as state updates
  useBookingStore((s) => s.step);

  const chosenServices = serviceIds
    .map((id) => services.find((x) => x.id === id))
    .filter(Boolean) as (typeof services)[number][];
  const chosenAddOns = addOnIds
    .map((id) => addons.find((x) => x.id === id))
    .filter(Boolean) as (typeof addons)[number][];
  const stylist =
    stylistId === "any" ? null : stylists.find((s) => s.id === stylistId);

  const empty = serviceIds.length === 0;

  return (
    <Card className="border-[var(--color-mist-400)] bg-[var(--color-bone-200)]">
      <CardContent className="flex flex-col gap-4 py-6">
        <h3 className="font-display text-lg text-[var(--color-ink-900)]">
          Your booking
        </h3>

        {empty ? (
          <p className="text-sm text-[var(--color-ink-500)]">
            Pick a service to get started →
          </p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {chosenServices.map((svc) => (
              <li
                key={svc.id}
                className="flex items-baseline justify-between gap-2"
              >
                <span className="text-[var(--color-ink-900)]">{svc.name}</span>
                <span className="text-right text-[var(--color-ink-500)]">
                  {formatDuration(svc.durationMin)} ·{" "}
                  <span className="text-[var(--color-ink-900)]">
                    {formatPrice(svc.priceUSD, svc.priceFrom)}
                  </span>
                </span>
              </li>
            ))}
            {chosenAddOns.map((addon) => (
              <li
                key={addon.id}
                className="flex items-baseline justify-between gap-2 text-[var(--color-ink-500)]"
              >
                <span>+ {addon.name}</span>
                <span>
                  {formatDuration(addon.durationMin)} ·{" "}
                  <span className="text-[var(--color-ink-900)]">
                    ${addon.priceUSD}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}

        <Separator className="bg-[var(--color-mist-400)]" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="size-3.5 text-[var(--color-ink-500)]" aria-hidden />
            {stylist ? (
              <span className="text-[var(--color-ink-900)]">{stylist.name}</span>
            ) : stylistId === "any" && serviceIds.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[var(--color-ink-500)]">
                <Sparkles className="size-3" aria-hidden /> Any available stylist
              </span>
            ) : (
              <span className="text-[var(--color-ink-500)]">
                Choose your stylist →
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar
              className="size-3.5 text-[var(--color-ink-500)]"
              aria-hidden
            />
            {date && time ? (
              <span className="text-[var(--color-ink-900)]">
                {format(parseISO(date), "EEE, MMM d")} · {time}
              </span>
            ) : (
              <span className="text-[var(--color-ink-500)]">
                Choose your time →
              </span>
            )}
          </div>
        </div>

        <Separator className="bg-[var(--color-mist-400)]" />

        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-[var(--color-ink-500)]">
            <Clock className="size-3.5" aria-hidden />
            {formatDuration(totals.durationMin)}
          </span>
          <span className="font-display text-xl text-[var(--color-ink-900)]">
            {formatPrice(totals.priceUSD, totals.priceFrom)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
