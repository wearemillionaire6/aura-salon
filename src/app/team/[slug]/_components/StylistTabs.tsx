"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  GalleryImage,
  Service,
  StylistAvailability,
  Testimonial,
} from "@/data/types";

interface StylistTabsProps {
  stylistSlug: string;
  eligibleServices: Service[];
  portfolioImages: GalleryImage[];
  reviews: (Testimonial & { serviceName?: string })[];
  schedule?: StylistAvailability;
}

const DAY_LABELS: { key: keyof StylistAvailability["weekly"]; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

function formatWindows(
  windows: { from: string; to: string }[],
): string {
  if (windows.length === 0) return "Off";
  // First window as the main window; any subsequent windows are breaks
  if (windows.length === 1) {
    return `${windows[0].from}–${windows[0].to}`;
  }
  const main = `${windows[0].from}–${windows[windows.length - 1].to}`;
  // Identify gap between first and second window as break
  const breakStart = windows[0].to;
  const breakEnd = windows[1].from;
  return `${main} · ${breakStart}–${breakEnd} break`;
}

export function StylistTabs({
  stylistSlug,
  eligibleServices,
  portfolioImages,
  reviews,
  schedule,
}: StylistTabsProps) {
  return (
    <Tabs defaultValue="services" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>

      {/* Services */}
      <TabsContent value="services" className="mt-2">
        <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-bone-50)]">
          {eligibleServices.map((svc) => (
            <li
              key={svc.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <p className="font-display text-lg text-[var(--color-ink-900)]">
                  {svc.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-ink-500)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden />
                    {svc.durationMin} min
                  </span>
                  <span aria-hidden className="text-[var(--color-mist-400)]">·</span>
                  <span className="text-[var(--color-ink-900)]">
                    {svc.priceFrom ? "from " : ""}${svc.priceUSD}
                  </span>
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/book?service=${svc.slug}&stylist=${stylistSlug}`}
                >
                  Book this
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </TabsContent>

      {/* Portfolio */}
      <TabsContent value="portfolio" className="mt-2">
        {portfolioImages.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {portfolioImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--color-bone-200)]"
              >
                <Image
                  src={img.imageUrl}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bone-50)] px-6 py-10">
            <p className="text-sm text-[var(--color-ink-500)]">
              No portfolio images for this stylist yet.
            </p>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-terracotta-500)] transition-colors hover:opacity-80"
            >
              Browse the full gallery
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        )}
      </TabsContent>

      {/* Reviews */}
      <TabsContent value="reviews" className="mt-2">
        {reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bone-50)] px-5 py-5"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < rev.rating
                          ? "size-4 fill-[var(--color-terracotta-500)] text-[var(--color-terracotta-500)]"
                          : "size-4 text-[var(--color-mist-400)]"
                      }
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-ink-900)]">
                  &ldquo;{rev.text}&rdquo;
                </p>
                <p className="text-xs text-[var(--color-ink-500)]">
                  {rev.name}
                  {rev.serviceName ? ` · ${rev.serviceName}` : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bone-50)] px-6 py-10">
            <p className="text-sm text-[var(--color-ink-500)]">
              No reviews to display yet.
            </p>
          </div>
        )}
      </TabsContent>

      {/* Schedule */}
      <TabsContent value="schedule" className="mt-2">
        {schedule ? (
          <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bone-50)] px-6 py-6">
            <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
              Usually available
            </p>
            <ul className="divide-y divide-[var(--color-border)]">
              {DAY_LABELS.map(({ key, label }) => {
                const windows = schedule.weekly[key];
                return (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-4 py-2.5 text-sm"
                  >
                    <span className="font-medium text-[var(--color-ink-900)]">
                      {label}
                    </span>
                    <span className="text-[var(--color-ink-500)]">
                      {formatWindows(windows)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="pt-2">
              <Button asChild>
                <Link href={`/book?stylist=${stylistSlug}`}>
                  View live availability
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bone-50)] px-6 py-10">
            <p className="text-sm text-[var(--color-ink-500)]">
              Schedule unavailable.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
