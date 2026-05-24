"use client";

import { useEffect, useState } from "react";
import { useBookingStore } from "@/lib/booking-store";
import { stylists } from "@/data";
import { cn } from "@/lib/utils";
import {
  getNextDays,
  getSlotsForStylistOnDate,
  getSlotsForAnyStylist,
  formatDuration,
} from "@/lib/booking-helpers";
import { FadeUp } from "@/components/motion/FadeUp";
import { Clock, Lock } from "lucide-react";
import { StepNav } from "./StepNav";

function useLockRemaining(lockUntil: number | null): string | null {
  const [remaining, setRemaining] = useState<string | null>(null);
  useEffect(() => {
    if (!lockUntil) {
      setRemaining(null);
      return;
    }
    const tick = () => {
      const ms = lockUntil - Date.now();
      if (ms <= 0) {
        setRemaining(null);
        return;
      }
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      setRemaining(`${min}:${String(sec).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockUntil]);
  return remaining;
}

export function SlotStep() {
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const stylistId = useBookingStore((s) => s.stylistId);
  const date = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const setSlot = useBookingStore((s) => s.setSlot);
  const slotLockUntil = useBookingStore((s) => s.slotLockUntil);
  const errors = useBookingStore((s) => s.errors);

  const totals = useBookingStore.getState().getTotals();
  const duration = Math.max(totals.durationMin, 30);

  const days = getNextDays(14);
  const [selectedDate, setSelectedDate] = useState<string>(
    date ?? days[0].date
  );

  const remaining = useLockRemaining(slotLockUntil);

  return (
    <FadeUp>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-2xl text-[var(--color-ink-900)] sm:text-3xl">
            Pick a date & time
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            Total appointment length: {formatDuration(duration)}.
            {stylistId === "any"
              ? " Showing the earliest slot per stylist."
              : ""}
          </p>
        </div>

        {/* Date picker — horizontal scroll of next 14 days */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {days.map((d) => {
            const active = d.date === selectedDate;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                aria-pressed={active}
                className={cn(
                  "flex min-w-[78px] shrink-0 flex-col items-center gap-0.5 rounded-md border bg-[var(--color-bone-50)] px-3 py-3 text-center transition-colors",
                  "hover:border-[var(--color-ink-500)]",
                  active &&
                    "border-[var(--color-terracotta-500)] bg-[var(--color-bone-200)] ring-2 ring-[var(--color-terracotta-500)]"
                )}
              >
                <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                  {d.weekday}
                </span>
                <span className="font-display text-base text-[var(--color-ink-900)]">
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slots */}
        <div className="flex flex-col gap-4">
          {stylistId === "any" ? (
            <AnySlots
              dateISO={selectedDate}
              duration={duration}
              serviceIds={serviceIds}
              selectedTime={date === selectedDate ? time : null}
              onPick={(t) => setSlot(selectedDate, t)}
            />
          ) : (
            <SpecificStylistSlots
              stylistId={stylistId}
              dateISO={selectedDate}
              duration={duration}
              selectedTime={date === selectedDate ? time : null}
              onPick={(t) => setSlot(selectedDate, t)}
            />
          )}
        </div>

        {date && time && remaining ? (
          <div className="flex items-center gap-2 rounded-md border border-[var(--color-mist-400)] bg-[var(--color-bone-100)] px-3 py-2 text-xs text-[var(--color-ink-500)]">
            <Lock className="size-3.5" aria-hidden />
            Holding {time} for {remaining}
          </div>
        ) : null}

        {errors.slot ? (
          <p
            role="alert"
            className="text-sm text-[var(--color-destructive,#B43E2E)]"
          >
            {errors.slot}
          </p>
        ) : null}

        <StepNav nextDisabled={!date || !time} />
      </div>
    </FadeUp>
  );
}

function SpecificStylistSlots({
  stylistId,
  dateISO,
  duration,
  selectedTime,
  onPick,
}: {
  stylistId: string;
  dateISO: string;
  duration: number;
  selectedTime: string | null;
  onPick: (t: string) => void;
}) {
  const slots = getSlotsForStylistOnDate(stylistId, dateISO, duration);
  if (slots.length === 0) {
    return (
      <p className="text-sm text-[var(--color-ink-500)]">
        No openings on this day. Try another date.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {slots.map((t) => {
        const active = selectedTime === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onPick(t)}
            aria-pressed={active}
            className={cn(
              "rounded-md border bg-[var(--color-bone-50)] px-3 py-2 text-sm text-[var(--color-ink-900)] transition-colors",
              "hover:border-[var(--color-ink-500)]",
              active &&
                "border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3" aria-hidden />
              {t}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AnySlots({
  dateISO,
  duration,
  serviceIds,
  selectedTime,
  onPick,
}: {
  dateISO: string;
  duration: number;
  serviceIds: string[];
  selectedTime: string | null;
  onPick: (t: string) => void;
}) {
  const setStylist = useBookingStore((s) => s.setStylist);
  const grouped = getSlotsForAnyStylist(dateISO, duration, serviceIds);
  if (grouped.length === 0) {
    return (
      <p className="text-sm text-[var(--color-ink-500)]">
        No team availability for this date. Try another day.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {grouped.map(({ stylistId: sid, slot }) => {
        const sty = stylists.find((s) => s.id === sid);
        if (!sty) return null;
        const active = selectedTime === slot;
        return (
          <div
            key={sid}
            className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bone-50)] p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-sm text-[var(--color-ink-900)]">
                {sty.name}
              </p>
              <p className="text-xs text-[var(--color-ink-500)]">
                {sty.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStylist(sid);
                onPick(slot);
              }}
              aria-pressed={active}
              className={cn(
                "self-start rounded-md border bg-[var(--color-bone-50)] px-3 py-2 text-sm text-[var(--color-ink-900)] transition-colors",
                "hover:border-[var(--color-ink-500)]",
                active &&
                  "border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3" aria-hidden />
                Earliest: {slot}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
