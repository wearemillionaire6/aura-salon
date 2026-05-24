"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { stylists } from "@/data";
import type { Stylist } from "@/data";
import {
  type TodaysAppointment,
} from "@/lib/admin-data";
import { formatDuration, formatPrice } from "@/lib/booking-helpers";
import { Clock, DollarSign, User } from "lucide-react";
import { cn } from "@/lib/utils";

const START_HOUR = 8; // 08:00
const END_HOUR = 20; // 20:00
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 720
const PIXELS_PER_MIN = 1.1; // 12h * 60 * 1.1 ≈ 792px tall
const TIMELINE_HEIGHT = TOTAL_MINUTES * PIXELS_PER_MIN;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const CATEGORY_STYLES: Record<
  string,
  { block: string; accent: string; pill: string }
> = {
  Hair: {
    block:
      "bg-[var(--color-terracotta-500)]/25 border-[var(--color-terracotta-500)]/40 text-[var(--color-terracotta-700)]",
    accent: "bg-[var(--color-terracotta-500)]",
    pill: "bg-[var(--color-terracotta-500)]/15 text-[var(--color-terracotta-700)] border-[var(--color-terracotta-500)]/30",
  },
  Nails: {
    block:
      "bg-[var(--color-sage-400)]/30 border-[var(--color-sage-400)]/50 text-[var(--color-sage-600)]",
    accent: "bg-[var(--color-sage-400)]",
    pill: "bg-[var(--color-sage-400)]/20 text-[var(--color-sage-600)] border-[var(--color-sage-400)]/40",
  },
  Skin: {
    block:
      "bg-[var(--color-mist-200)] border-[var(--color-mist-400)]/60 text-[var(--color-ink-700)]",
    accent: "bg-[var(--color-mist-400)]",
    pill: "bg-[var(--color-mist-200)] text-[var(--color-ink-700)] border-[var(--color-mist-400)]/60",
  },
  Spa: {
    block:
      "bg-[var(--color-bone-200)] border-[var(--color-bone-200)]/80 text-[var(--color-ink-700)]",
    accent: "bg-[var(--color-bone-200)]",
    pill: "bg-[var(--color-bone-200)] text-[var(--color-ink-700)] border-[var(--color-bone-200)]",
  },
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Hair;
}

interface AppointmentBlockProps {
  appt: TodaysAppointment;
  onClick: (appt: TodaysAppointment) => void;
}

function AppointmentBlock({ appt, onClick }: AppointmentBlockProps) {
  const startMin = timeToMinutes(appt.startTime) - START_HOUR * 60;
  const top = startMin * PIXELS_PER_MIN;
  const height = appt.durationMin * PIXELS_PER_MIN;
  const style = getCategoryStyle(appt.category);
  const endLabel = minutesToLabel(
    timeToMinutes(appt.startTime) + appt.durationMin,
  );

  return (
    <button
      type="button"
      onClick={() => onClick(appt)}
      style={{ top, height }}
      className={cn(
        "absolute left-1 right-1 overflow-hidden rounded-md border px-2 py-1.5 text-left text-xs shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1",
        style.block,
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn("inline-block size-1.5 rounded-full", style.accent)}
        />
        <span className="font-medium tabular-nums">
          {appt.startTime} – {endLabel}
        </span>
      </div>
      <div className="mt-0.5 line-clamp-1 font-medium text-[var(--color-ink-900)]">
        {appt.serviceName}
      </div>
      <div className="mt-0.5 line-clamp-1 text-[10px] text-[var(--color-ink-500)]">
        {appt.clientName}
      </div>
    </button>
  );
}

export function DayCalendar({ appointments = [] }: { appointments?: TodaysAppointment[] }) {
  const [selected, setSelected] = React.useState<TodaysAppointment | null>(
    null,
  );

  const apptsByStylist = React.useMemo(() => {
    const map = new Map<string, TodaysAppointment[]>();
    for (const a of appointments) {
      const arr = map.get(a.stylistId) ?? [];
      arr.push(a);
      map.set(a.stylistId, arr);
    }
    return map;
  }, [appointments]);

  const hourLabels = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i,
  );

  const selectedStylist: Stylist | undefined = selected
    ? stylists.find((s) => s.id === selected.stylistId)
    : undefined;
  const selectedStyle = selected ? getCategoryStyle(selected.category) : null;
  const selectedEndLabel = selected
    ? minutesToLabel(
        timeToMinutes(selected.startTime) + selected.durationMin,
      )
    : null;

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
        <div className="overflow-x-auto">
          <div
            className="grid min-w-fit"
            style={{
              gridTemplateColumns: `64px repeat(${stylists.length}, minmax(160px, 1fr))`,
            }}
          >
            {/* Header row */}
            <div className="sticky left-0 z-20 border-b border-r border-[var(--color-border)] bg-[var(--color-card)]" />
            {stylists.map((sty) => (
              <div
                key={sty.id}
                className="border-b border-r border-[var(--color-border)] bg-[var(--color-card)] px-3 py-3 last:border-r-0"
              >
                <div className="font-display text-sm font-medium text-[var(--color-ink-900)]">
                  {sty.name}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--color-ink-500)]">
                  {sty.title}
                </div>
              </div>
            ))}

            {/* Time axis + columns */}
            <div
              className="sticky left-0 z-10 border-r border-[var(--color-border)] bg-[var(--color-card)]"
              style={{ height: TIMELINE_HEIGHT }}
            >
              {hourLabels.map((h, idx) => (
                <div
                  key={h}
                  className="absolute right-2 -translate-y-1/2 text-[10px] tabular-nums text-[var(--color-ink-500)]"
                  style={{ top: idx * 60 * PIXELS_PER_MIN }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {stylists.map((sty) => {
              const appts = apptsByStylist.get(sty.id) ?? [];
              return (
                <div
                  key={sty.id}
                  className="relative border-r border-[var(--color-border)] last:border-r-0"
                  style={{ height: TIMELINE_HEIGHT }}
                >
                  {/* hour gridlines */}
                  {hourLabels.map((h, idx) => (
                    <div
                      key={h}
                      className="absolute right-0 left-0 border-t border-[var(--color-border)]/40"
                      style={{ top: idx * 60 * PIXELS_PER_MIN }}
                    />
                  ))}

                  {/* Appointments */}
                  {appts.map((a) => (
                    <AppointmentBlock
                      key={a.id}
                      appt={a}
                      onClick={setSelected}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          {selected && selectedStyle && selectedEndLabel ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("border", selectedStyle.pill)}
                  >
                    {selected.category}
                  </Badge>
                  <Badge
                    variant={
                      selected.status === "confirmed" ? "secondary" : "outline"
                    }
                  >
                    {selected.status === "confirmed"
                      ? "Confirmed"
                      : "Deposit pending"}
                  </Badge>
                </div>
                <DialogTitle className="mt-2 font-display text-2xl">
                  {selected.serviceName}
                </DialogTitle>
                <DialogDescription>
                  {selectedStylist?.name ?? "Stylist"} ·{" "}
                  {selectedStylist?.title ?? ""}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] p-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[var(--color-terracotta-500)] font-medium text-[var(--color-primary-foreground)]">
                    {getInitials(selected.clientName)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-ink-900)]">
                      {selected.clientName}
                    </div>
                    <div className="text-xs text-[var(--color-ink-500)]">
                      <User className="mr-1 inline size-3" />
                      Client
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 size-4 text-[var(--color-ink-500)]" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-500)]">
                        Time
                      </div>
                      <div className="font-medium tabular-nums">
                        {selected.startTime} – {selectedEndLabel}
                      </div>
                      <div className="text-xs text-[var(--color-ink-500)]">
                        {formatDuration(selected.durationMin)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="mt-0.5 size-4 text-[var(--color-ink-500)]" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-500)]">
                        Price
                      </div>
                      <div className="font-medium">
                        {formatPrice(selected.priceUSD)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    toast.success(
                      `Cancelled · ${selected.serviceName} at ${selected.startTime}`,
                    );
                    setSelected(null);
                  }}
                >
                  Cancel appt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success(
                      `${selected.clientName} checked in for ${selected.serviceName}`,
                    );
                  }}
                >
                  Check in
                </Button>
                <Button
                  onClick={() => {
                    toast.success(
                      `Marked complete · ${selected.serviceName}`,
                    );
                    setSelected(null);
                  }}
                >
                  Mark complete
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
