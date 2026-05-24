"use client";

import { useBookingStore } from "@/lib/booking-store";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "service", label: "Service" },
  { key: "stylist", label: "Stylist" },
  { key: "slot", label: "Date & time" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
] as const;

export function ProgressBar() {
  const step = useBookingStore((s) => s.step);
  const idx = STEPS.findIndex((s) => s.key === step);
  return (
    <ol className="mt-8 flex flex-wrap items-center gap-2 sm:gap-4">
      {STEPS.map((s, i) => {
        const active = i === idx;
        const done = i < idx;
        return (
          <li key={s.key} className="flex items-center gap-2 sm:gap-4">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-sans",
                done && "bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]",
                active && "bg-[var(--color-ink-900)] text-[var(--color-bone-50)]",
                !active && !done && "bg-[var(--color-mist-200)] text-[var(--color-ink-500)]"
              )}
              aria-current={active ? "step" : undefined}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                active
                  ? "font-medium text-[var(--color-ink-900)]"
                  : "text-[var(--color-ink-500)]"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className="hidden h-px w-6 bg-[var(--color-mist-400)] sm:block"
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
