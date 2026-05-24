"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBookingStore } from "@/lib/booking-store";
import { bookingDetailsSchema, type BookingDetails } from "@/lib/validators";
import { FormField, PhoneInput } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function DetailsStep() {
  const details = useBookingStore((s) => s.details);
  const setDetails = useBookingStore((s) => s.setDetails);
  const next = useBookingStore((s) => s.next);
  const prev = useBookingStore((s) => s.prev);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingDetails>({
    resolver: zodResolver(bookingDetailsSchema) as unknown as Resolver<BookingDetails>,
    defaultValues: {
      name: details.name,
      email: details.email,
      phone: details.phone,
      notes: details.notes,
      // start uncontrolled-false; user must explicitly tick
      consent: (details.consent ? true : undefined) as unknown as true,
    },
    mode: "onBlur",
  });

  const consentChecked = watch("consent") === true;
  const notesValue = watch("notes") ?? "";

  const onSubmit = handleSubmit((values) => {
    setDetails({
      name: values.name,
      email: values.email,
      phone: values.phone,
      notes: values.notes ?? "",
      consent: true,
    });
    next();
  });

  return (
    <FadeUp>
      <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
        <div>
          <h2 className="font-display text-2xl text-[var(--color-ink-900)] sm:text-3xl">
            Your details
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            We&apos;ll send your confirmation here. Notes are optional — let us know
            about allergies, sensitivities, or anything we should plan for.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="book-name" label="Full name" required error={errors.name?.message}>
            <Input
              autoComplete="name"
              placeholder="Jordan Lee"
              {...register("name")}
            />
          </FormField>
          <FormField id="book-email" label="Email" required error={errors.email?.message}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
            />
          </FormField>
        </div>

        <FormField id="book-phone" label="Phone" required error={errors.phone?.message}>
          <PhoneInput
            {...register("phone")}
            onChange={(e) => setValue("phone", e.target.value, { shouldValidate: true })}
          />
        </FormField>

        <FormField
          id="book-notes"
          label="Notes"
          description={`Optional — ${notesValue.length}/500`}
          error={errors.notes?.message}
        >
          <Textarea
            rows={4}
            maxLength={500}
            placeholder="Allergies, sensitivities, reference photos welcome at the appointment..."
            {...register("notes")}
          />
        </FormField>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="sr-only"
              {...register("consent")}
            />
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                consentChecked
                  ? "border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
                  : "border-[var(--color-mist-400)] bg-[var(--color-bone-50)]"
              )}
              aria-hidden
            >
              {consentChecked ? <Check className="size-3" /> : null}
            </span>
            <span className="text-[var(--color-ink-700)]">
              I&apos;ve read and agree to the{" "}
              <span className="font-medium text-[var(--color-ink-900)]">
                24-hour cancellation policy
              </span>
              .
            </span>
          </label>
          {errors.consent ? (
            <p
              role="alert"
              className="text-xs text-[var(--color-destructive,#B43E2E)]"
            >
              {errors.consent.message as string}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" size="lg" onClick={() => prev()}>
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            Continue
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </form>
    </FadeUp>
  );
}
