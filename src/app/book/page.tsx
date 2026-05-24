"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { useBookingStore } from "@/lib/booking-store";
import { ProgressBar } from "./_components/ProgressBar";
import { ServiceStep } from "./_components/ServiceStep";
import { StylistStep } from "./_components/StylistStep";
import { SlotStep } from "./_components/SlotStep";
import { DetailsStep } from "./_components/DetailsStep";
import { ReviewStep } from "./_components/ReviewStep";
import { ConfirmedStep } from "./_components/ConfirmedStep";
import { SummaryPanel } from "./_components/SummaryPanel";

function BookingWizardInner() {
  const step = useBookingStore((s) => s.step);
  const params = useSearchParams();

  // Deep-link: preselect service / stylist via query params
  const setServiceFromSlug = useBookingStore((s) => s.setServiceFromSlug);
  const setStylistFromSlug = useBookingStore((s) => s.setStylistFromSlug);
  useEffect(() => {
    const svc = params.get("service");
    const sty = params.get("stylist");
    if (svc) setServiceFromSlug(svc);
    if (sty) setStylistFromSlug(sty);
  }, [params, setServiceFromSlug, setStylistFromSlug]);

  // If confirmed step, render full-bleed confirmation
  if (step === "confirmed") {
    return <ConfirmedStep />;
  }

  return (
    <Container className="py-10 lg:py-16">
      <div className="mx-auto mb-10 max-w-3xl">
        <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
          Book an appointment
        </p>
        <h1 className="mt-2 font-display text-4xl text-[var(--color-ink-900)] sm:text-5xl">
          Find your time at Aura.
        </h1>
        <ProgressBar />
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {step === "service" && <ServiceStep />}
          {step === "stylist" && <StylistStep />}
          {step === "slot" && <SlotStep />}
          {step === "details" && <DetailsStep />}
          {step === "review" && <ReviewStep />}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SummaryPanel />
        </aside>
      </div>
    </Container>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingWizardInner />
    </Suspense>
  );
}
