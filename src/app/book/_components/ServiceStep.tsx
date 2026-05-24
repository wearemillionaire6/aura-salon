"use client";

import { useBookingStore } from "@/lib/booking-store";
import { services, addons } from "@/data";
import type { ServiceCategory } from "@/data/types";
import { cn } from "@/lib/utils";
import { formatPrice, formatDuration } from "@/lib/booking-helpers";
import { FadeUp } from "@/components/motion/FadeUp";
import { Check, Clock } from "lucide-react";
import { StepNav } from "./StepNav";

const CATEGORY_ORDER: ServiceCategory[] = ["Hair", "Nails", "Skin", "Spa"];

export function ServiceStep() {
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const addOnIds = useBookingStore((s) => s.addOnIds);
  const toggleService = useBookingStore((s) => s.toggleService);
  const toggleAddOn = useBookingStore((s) => s.toggleAddOn);
  const errors = useBookingStore((s) => s.errors);

  return (
    <FadeUp>
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="font-display text-2xl text-[var(--color-ink-900)] sm:text-3xl">
            Choose your services
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            Pick one or more — we&apos;ll book them back-to-back if possible.
          </p>
        </div>

        {CATEGORY_ORDER.map((category) => {
          const items = services.filter((s) => s.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="flex flex-col gap-4">
              <h3 className="font-display text-lg text-[var(--color-ink-900)]">
                {category}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((svc) => {
                  const selected = serviceIds.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => toggleService(svc.id)}
                      aria-pressed={selected}
                      className={cn(
                        "group flex flex-col gap-2 rounded-lg border bg-[var(--color-bone-50)] p-4 text-left transition-all",
                        "hover:border-[var(--color-ink-500)]",
                        selected &&
                          "border-[var(--color-terracotta-500)] bg-[var(--color-bone-200)] ring-2 ring-[var(--color-terracotta-500)] ring-offset-2 ring-offset-[var(--color-bone-50)]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-display text-base text-[var(--color-ink-900)]">
                          {svc.name}
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
                      <p className="text-xs text-[var(--color-ink-500)] line-clamp-2">
                        {svc.description.split(".")[0]}.
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-ink-500)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" aria-hidden />
                          {formatDuration(svc.durationMin)}
                        </span>
                        <span aria-hidden className="text-[var(--color-mist-400)]">
                          ·
                        </span>
                        <span className="text-[var(--color-ink-900)]">
                          {formatPrice(svc.priceUSD, svc.priceFrom)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-8">
          <div>
            <h3 className="font-display text-lg text-[var(--color-ink-900)]">
              Add-ons
            </h3>
            <p className="mt-1 text-xs text-[var(--color-ink-500)]">
              Optional treatments tacked onto your appointment.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {addons.map((addon) => {
              const checked = addOnIds.includes(addon.id);
              return (
                <li key={addon.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-md border bg-[var(--color-bone-50)] px-3 py-3 text-sm transition-colors",
                      "hover:border-[var(--color-ink-500)]",
                      checked &&
                        "border-[var(--color-terracotta-500)] bg-[var(--color-bone-200)]"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleAddOn(addon.id)}
                    />
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                        checked
                          ? "border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
                          : "border-[var(--color-mist-400)] bg-[var(--color-bone-50)]"
                      )}
                      aria-hidden
                    >
                      {checked ? <Check className="size-3" /> : null}
                    </span>
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="font-medium text-[var(--color-ink-900)]">
                        {addon.name}
                      </span>
                      <span className="text-xs text-[var(--color-ink-500)]">
                        +${addon.priceUSD} · +{addon.durationMin} min
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        {errors.service ? (
          <p
            role="alert"
            className="text-sm text-[var(--color-destructive,#B43E2E)]"
          >
            {errors.service}
          </p>
        ) : null}

        <StepNav nextDisabled={serviceIds.length === 0} hideBack />
      </div>
    </FadeUp>
  );
}
