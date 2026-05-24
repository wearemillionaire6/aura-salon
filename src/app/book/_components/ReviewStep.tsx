"use client";

import { useBookingStore } from "@/lib/booking-store";
import { services, addons, stylists } from "@/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp } from "@/components/motion/FadeUp";
import { formatPrice, formatDuration } from "@/lib/booking-helpers";
import { ArrowLeft, Calendar, Clock, Loader2, MapPin, User } from "lucide-react";
import { format, parseISO } from "date-fns";

export function ReviewStep() {
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const addOnIds = useBookingStore((s) => s.addOnIds);
  const stylistId = useBookingStore((s) => s.stylistId);
  const date = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const details = useBookingStore((s) => s.details);
  const submit = useBookingStore((s) => s.submit);
  const submitting = useBookingStore((s) => s.submitting);
  const prev = useBookingStore((s) => s.prev);

  const chosenServices = serviceIds
    .map((id) => services.find((x) => x.id === id))
    .filter(Boolean) as (typeof services)[number][];
  const chosenAddOns = addOnIds
    .map((id) => addons.find((x) => x.id === id))
    .filter(Boolean) as (typeof addons)[number][];
  const stylist =
    stylistId === "any" ? null : stylists.find((s) => s.id === stylistId);
  const totals = useBookingStore.getState().getTotals();

  return (
    <FadeUp>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-2xl text-[var(--color-ink-900)] sm:text-3xl">
            Review & confirm
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            One last look — confirm to lock the appointment.
          </p>
        </div>

        <Card className="bg-[var(--color-bone-50)]">
          <CardContent className="flex flex-col gap-5 py-6">
            <section className="flex flex-col gap-2">
              <h3 className="text-xs font-sans uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                Services
              </h3>
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
            </section>

            <Separator />

            <section className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-4 text-[var(--color-ink-500)]" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                    Stylist
                  </p>
                  <p className="text-[var(--color-ink-900)]">
                    {stylist ? `${stylist.name} · ${stylist.title}` : "Any available stylist"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 size-4 text-[var(--color-ink-500)]" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                    Date & time
                  </p>
                  <p className="text-[var(--color-ink-900)]">
                    {date && time
                      ? `${format(parseISO(date), "EEEE, MMMM d")} · ${time}`
                      : "—"}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section className="flex flex-col gap-1 text-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                Your details
              </p>
              <p className="text-[var(--color-ink-900)]">{details.name}</p>
              <p className="text-[var(--color-ink-500)]">{details.email}</p>
              <p className="text-[var(--color-ink-500)]">{details.phone}</p>
              {details.notes ? (
                <p className="mt-2 text-[var(--color-ink-700)]">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                    Notes ·
                  </span>{" "}
                  {details.notes}
                </p>
              ) : null}
            </section>

            <Separator />

            <section className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-[var(--color-ink-500)]">
                <Clock className="size-3.5" aria-hidden />
                {formatDuration(totals.durationMin)}
              </span>
              <span className="font-display text-xl text-[var(--color-ink-900)]">
                {formatPrice(totals.priceUSD, totals.priceFrom)}
              </span>
            </section>
          </CardContent>
        </Card>

        <div className="rounded-md border border-[var(--color-mist-400)] bg-[var(--color-bone-100)] p-4 text-xs text-[var(--color-ink-500)]">
          <p className="font-medium text-[var(--color-ink-900)]">
            24-hour cancellation policy
          </p>
          <p className="mt-1">
            Free changes up to 24 hours before your appointment. After that, a 50%
            fee applies. No-shows are charged in full.
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5">
            <MapPin className="size-3" aria-hidden />
            342 Bleecker St, New York, NY 10014
          </p>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => prev()}
            disabled={submitting}
          >
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Button>
          <Button
            type="button"
            size="lg"
            disabled={submitting}
            onClick={() => submit()}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-1 size-4 animate-spin" />
                Confirming…
              </>
            ) : (
              "Confirm booking"
            )}
          </Button>
        </div>
      </div>
    </FadeUp>
  );
}
