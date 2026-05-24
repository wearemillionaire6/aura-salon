import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Instagram } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  availability,
  gallery,
  services,
  stylists,
  testimonials,
} from "@/data";
import { StylistTabs } from "./_components/StylistTabs";

export async function generateStaticParams() {
  return stylists.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sty = stylists.find((s) => s.slug === slug);
  if (!sty) return { title: "Stylist" };
  return {
    title: `${sty.name} · ${sty.title}`,
    description: sty.bio.slice(0, 160),
  };
}

export default async function StylistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sty = stylists.find((s) => s.slug === slug);
  if (!sty) notFound();

  const firstName = sty.name.split(" ")[0];

  // Eligible services
  const eligibleServices = services.filter((svc) =>
    svc.eligibleStylistIds.includes(sty.id),
  );
  const eligibleServiceSlugs = new Set(eligibleServices.map((s) => s.slug));

  // Portfolio: gallery with stylistId match, fallback to category match if empty
  let portfolioImages = gallery.filter((g) => g.stylistId === sty.id);
  if (portfolioImages.length === 0) {
    const categories = new Set(eligibleServices.map((s) => s.category));
    portfolioImages = gallery
      .filter((g) => g.category !== "Interior" && categories.has(g.category as never))
      .slice(0, 6);
  }

  // Reviews: testimonials whose service slug is in eligible services
  const reviews = testimonials
    .filter((t) => eligibleServiceSlugs.has(t.serviceSlug))
    .map((t) => {
      const svc = services.find((s) => s.slug === t.serviceSlug);
      return { ...t, serviceName: svc?.name };
    });

  // Schedule snippet
  const scheduleSnippet = availability.find((a) => a.stylistId === sty.id);

  // Bio paragraphs (split by sentence — simple sentence chunks)
  const bioSentences = sty.bio
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  return (
    <>
      <section className="bg-[var(--color-bone-50)] pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Team", href: "/team" },
              { label: sty.name },
            ]}
          />
        </Container>
      </section>

      <section className="bg-[var(--color-bone-50)] py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
            {/* Portrait */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[var(--color-bone-200)]">
              <Image
                src={sty.avatarUrl}
                alt={sty.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Bio block */}
            <div className="flex flex-col gap-5">
              <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                {sty.title}
              </p>
              <h1 className="font-display text-4xl leading-[1.05] text-[var(--color-ink-900)] sm:text-5xl">
                {sty.name}
              </h1>
              <div className="flex flex-col gap-3 text-base text-[var(--color-ink-500)] sm:text-lg">
                {bioSentences.map((sentence, i) => (
                  <p key={i}>{sentence}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sty.specialties.map((spec) => (
                  <Badge
                    key={spec}
                    variant="outline"
                    className="bg-[var(--color-bone-100)]"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href={`https://instagram.com/${sty.instagramHandle.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-500)] transition-colors hover:text-[var(--color-terracotta-500)]"
                >
                  <Instagram className="size-4" aria-hidden />
                  {sty.instagramHandle}
                </Link>
                <span
                  className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bone-100)] px-3 py-1 text-xs text-[var(--color-ink-900)]"
                >
                  {sty.yearsExperience} years experience
                </span>
              </div>
              <div className="pt-3">
                <Button asChild size="lg">
                  <Link href={`/book?stylist=${sty.slug}`}>
                    {`Book with ${firstName}`}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bone-100)] py-16 sm:py-20">
        <Container>
          <StylistTabs
            stylistSlug={sty.slug}
            eligibleServices={eligibleServices}
            portfolioImages={portfolioImages}
            reviews={reviews}
            schedule={scheduleSnippet}
          />
        </Container>
      </section>
    </>
  );
}
