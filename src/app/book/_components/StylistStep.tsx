"use client";

import Image from "next/image";
import { useBookingStore } from "@/lib/booking-store";
import { services, stylists } from "@/data";
import { cn } from "@/lib/utils";
import {
  getSlotsForStylistOnDate,
  getNextDays,
} from "@/lib/booking-helpers";
import { FadeUp } from "@/components/motion/FadeUp";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { StepNav } from "./StepNav";

export function StylistStep() {
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const stylistId = useBookingStore((s) => s.stylistId);
  const setStylist = useBookingStore((s) => s.setStylist);
  const totalDuration = useBookingStore.getState().getTotals().durationMin;

  // Build list of eligible stylists: each chosen service's eligibleStylistIds must include their id
  const eligible = stylists.filter((sty) =>
    serviceIds.every((sid) => {
      const svc = services.find((x) => x.id === sid);
      return svc?.eligibleStylistIds.includes(sty.id);
    })
  );

  // Tomorrow's date (idx 1 in next-14)
  const days = getNextDays(2);
  const tomorrowISO = days[1]?.date ?? days[0].date;

  return (
    <FadeUp>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-2xl text-[var(--color-ink-900)] sm:text-3xl">
            Choose a stylist
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            Pick someone specific, or let us find the earliest opening across the team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStylist("any")}
          aria-pressed={stylistId === "any"}
          className={cn(
            "flex items-center gap-4 rounded-lg border bg-[var(--color-bone-50)] p-4 text-left transition-all",
            "hover:border-[var(--color-ink-500)]",
            stylistId === "any" &&
              "border-[var(--color-terracotta-500)] bg-[var(--color-bone-200)] ring-2 ring-[var(--color-terracotta-500)] ring-offset-2 ring-offset-[var(--color-bone-50)]"
          )}
        >
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
              stylistId === "any"
                ? "bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
                : "bg-[var(--color-mist-200)] text-[var(--color-ink-500)]"
            )}
            aria-hidden
          >
            <Sparkles className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg text-[var(--color-ink-900)]">
              Any available stylist
            </span>
            <span className="block text-xs text-[var(--color-ink-500)]">
              We&apos;ll match you with the earliest opening across the team.
            </span>
          </span>
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
              stylistId === "any"
                ? "border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
                : "border-[var(--color-mist-400)] bg-[var(--color-bone-50)]"
            )}
            aria-hidden
          >
            {stylistId === "any" ? <Check className="size-3" /> : null}
          </span>
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          {eligible.map((sty) => {
            const selected = stylistId === sty.id;
            const slots = getSlotsForStylistOnDate(
              sty.id,
              tomorrowISO,
              Math.max(totalDuration, 30)
            );
            const next = slots[0];
            return (
              <button
                key={sty.id}
                type="button"
                onClick={() => setStylist(sty.id)}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border bg-[var(--color-bone-50)] p-4 text-left transition-all",
                  "hover:border-[var(--color-ink-500)]",
                  selected &&
                    "border-[var(--color-terracotta-500)] bg-[var(--color-bone-200)] ring-2 ring-[var(--color-terracotta-500)] ring-offset-2 ring-offset-[var(--color-bone-50)]"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--color-bone-200)]">
                    {sty.avatarUrl ? (
                      <Image
                        src={sty.avatarUrl}
                        alt={sty.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-base text-[var(--color-ink-900)]">
                      {sty.name}
                    </span>
                    <span className="block text-xs text-[var(--color-ink-500)]">
                      {sty.title}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
                        : "border-[var(--color-mist-400)] bg-[var(--color-bone-50)]"
                    )}
                    aria-hidden
                  >
                    {selected ? <Check className="size-3" /> : null}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sty.specialties.slice(0, 3).map((spec) => (
                    <Badge
                      key={spec}
                      variant="outline"
                      className="border-[var(--color-mist-400)] bg-[var(--color-bone-50)] text-[var(--color-ink-500)]"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-ink-500)]">
                  {next
                    ? `Next available tomorrow at ${next}`
                    : "No tomorrow availability — check later dates"}
                </p>
              </button>
            );
          })}
        </div>

        {eligible.length === 0 ? (
          <p className="rounded-md border border-[var(--color-mist-400)] bg-[var(--color-bone-100)] p-4 text-sm text-[var(--color-ink-500)]">
            No single stylist on staff performs all of those services together.
            Try splitting the booking, or use{" "}
            <span className="font-medium text-[var(--color-ink-900)]">
              Any available stylist
            </span>{" "}
            and we&apos;ll coordinate.
          </p>
        ) : null}

        <StepNav />
      </div>
    </FadeUp>
  );
}
