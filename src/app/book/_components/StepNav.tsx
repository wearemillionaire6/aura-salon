"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/booking-store";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface StepNavProps {
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  hideBack?: boolean;
  hideNext?: boolean;
  nextType?: "button" | "submit";
}

export function StepNav({
  backLabel = "Back",
  nextLabel = "Continue",
  nextDisabled,
  onNext,
  onBack,
  hideBack,
  hideNext,
  nextType = "button",
}: StepNavProps) {
  const next = useBookingStore((s) => s.next);
  const prev = useBookingStore((s) => s.prev);
  const step = useBookingStore((s) => s.step);
  return (
    <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      {!hideBack && step !== "service" ? (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => (onBack ? onBack() : prev())}
        >
          <ArrowLeft className="mr-1 size-4" />
          {backLabel}
        </Button>
      ) : (
        <span />
      )}
      {!hideNext ? (
        <Button
          type={nextType}
          size="lg"
          disabled={nextDisabled}
          onClick={() => {
            if (nextType === "submit") return;
            if (onNext) onNext();
            else next();
          }}
        >
          {nextLabel}
          <ArrowRight className="ml-1 size-4" />
        </Button>
      ) : null}
    </div>
  );
}
