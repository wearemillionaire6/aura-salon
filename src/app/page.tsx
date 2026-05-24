import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Sparkles, Leaf, Clock } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FadeUp, StaggerList } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { home } from "@/content";
import { services, stylists, testimonials, getServiceBySlug } from "@/data";

const categoryCards: Array<{
  label: "Hair" | "Nails" | "Skin" | "Spa";
  blurb: string;
}> = [
  { label: "Hair", blurb: "Cuts, lived-in color, and considered finishes." },
  { label: "Nails", blurb: "Dry-prep manicures, restorative pedicures." },
  { label: "Skin", blurb: "Facials, microcurrent, dermaplane." },
  { label: "Spa", blurb: "Massage, body wraps, slow appointments." },
];

function valuePropIcon(name: string) {
  if (name === "Leaf") return <Leaf className="size-5" aria-hidden />;
  if (name === "Clock") return <Clock className="size-5" aria-hidden />;
  return <Sparkles className="size-5" aria-hidden />;
}

function pickFeaturedServices() {
  const slugs = [
    "signature-cut-and-style",
    "highlights-balayage",
    "the-aura-facial",
    "gel-manicure",
    "massage-90",
    "microcurrent-lift",
  ];
  const matched = slugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  if (matched.length >= 6) return matched.slice(0, 6);
  // Fallback: pad with first services
  const seen = new Set(matched.map((s) => s.id));
  for (const svc of services) {
    if (matched.length >= 6) break;
    if (!seen.has(svc.id)) matched.push(svc);
  }
  return matched.slice(0, 6);
}

export default function HomePage() {
  const featured = pickFeaturedServices();
  const featuredStylists = stylists.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={home.hero.eyebrow}
        headline={home.hero.headline}
        subhead={home.hero.subhead}
        primaryCta={home.hero.primaryCta}
        secondaryCta={home.hero.secondaryCta}
        media="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1400&q=85"
        mediaAlt="The front desk at Aura, warm oak under a brass pendant"
      />

      {/* What we do */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="What we do"
              title="Care, by hand."
              subtitle="Hair, nails, skin, and bodywork. Four categories, one room, one bookable calendar."
              align="center"
              className="mx-auto items-center text-center"
            />
          </FadeUp>
          <StaggerList className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((c) => (
              <Link
                key={c.label}
                href={`/services?category=${c.label}`}
                className="group block"
              >
                <Card className="h-44 bg-[var(--color-bone-100)] transition-colors hover:bg-[var(--color-bone-200)]">
                  <CardContent className="flex h-full flex-col items-start justify-between px-6 py-2">
                    <p className="font-display text-2xl text-[var(--color-ink-900)]">
                      {c.label}
                    </p>
                    <div className="flex w-full items-end justify-between">
                      <p className="max-w-[14rem] text-sm text-[var(--color-ink-500)]">
                        {c.blurb}
                      </p>
                      <ArrowRight
                        className="size-4 text-[var(--color-ink-500)] transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </StaggerList>
        </Container>
      </section>

      {/* Featured services */}
      <section className="py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="Featured services"
              title="A small menu, done well."
              subtitle="Six of the appointments our regulars book most. The full list lives on the services page."
            />
          </FadeUp>
          <StaggerList className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((svc) => (
              <Card
                key={svc.id}
                className="overflow-hidden bg-[var(--color-bone-50)] p-0"
              >
                {svc.image ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-bone-200)]">
                    <Image
                      src={svc.image}
                      alt={svc.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <CardContent className="flex flex-col gap-3 px-6 py-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                      {svc.category}
                    </span>
                    <span className="text-xs text-[var(--color-ink-500)]">
                      {svc.durationMin} min · {svc.priceFrom ? "from " : ""}${svc.priceUSD}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                    {svc.name}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-500)] line-clamp-3">
                    {svc.description}
                  </p>
                  <div className="mt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/services/${svc.slug}`}>
                        Book
                        <ArrowRight className="ml-1 size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </StaggerList>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">See the full menu</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Stylist spotlight */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="Stylist spotlight"
              title="A few of the people behind the chair."
              subtitle="Six stylists in all — every one of them takes their own consults."
            />
          </FadeUp>
          <StaggerList className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStylists.map((sty) => {
              const firstName = sty.name.split(" ")[0];
              return (
                <Card key={sty.id} className="bg-[var(--color-bone-50)]">
                  <CardContent className="flex flex-col items-center gap-4 px-6 py-6 text-center">
                    <div className="relative size-28 overflow-hidden rounded-full bg-[var(--color-bone-200)]">
                      <Image
                        src={sty.avatarUrl}
                        alt={sty.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                        {sty.name}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                        {sty.title}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {sty.specialties.map((sp) => (
                        <span
                          key={sp}
                          className="rounded-full border border-[var(--color-mist-400)] bg-transparent px-3 py-1 text-xs text-[var(--color-ink-700)]"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href={`/team/${sty.slug}`}>
                        Book with {firstName}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </StaggerList>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/team">Meet everyone</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow={home.testimonialsHeader.eyebrow}
              title={home.testimonialsHeader.title}
            />
          </FadeUp>
          <StaggerList className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredTestimonials.map((t) => {
              const svc = getServiceBySlug(t.serviceSlug);
              return (
                <Card key={t.id} className="bg-[var(--color-bone-50)]">
                  <CardContent className="flex flex-col gap-4 px-6 py-6">
                    <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < t.rating
                              ? "size-4 fill-[var(--color-terracotta-500)] text-[var(--color-terracotta-500)]"
                              : "size-4 text-[var(--color-mist-400)]"
                          }
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="font-display text-lg italic leading-snug text-[var(--color-ink-700)]">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="mt-2 flex flex-col gap-0.5 border-t border-[var(--color-mist-200)] pt-4">
                      <p className="text-sm font-medium text-[var(--color-ink-900)]">
                        {t.name}
                      </p>
                      {svc ? (
                        <p className="text-xs text-[var(--color-ink-500)]">
                          {svc.name}
                        </p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </StaggerList>
        </Container>
      </section>

      {/* Value props */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-28">
        <Container>
          <StaggerList className="grid gap-6 md:grid-cols-3">
            {home.valueProps.map((vp) => (
              <Card key={vp.title} className="bg-[var(--color-bone-50)]">
                <CardContent className="flex flex-col gap-4 px-6 py-6">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[var(--color-bone-200)] text-[var(--color-terracotta-700)]">
                    {valuePropIcon(vp.icon)}
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                    {vp.title}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-500)]">
                    {vp.blurb}
                  </p>
                </CardContent>
              </Card>
            ))}
          </StaggerList>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <Container>
          <FadeUp>
            <div className="flex flex-col items-center gap-6 rounded-xl bg-[var(--color-ink-900)] px-8 py-16 text-center sm:py-20">
              <h2 className="max-w-2xl font-display text-3xl leading-tight text-[var(--color-bone-50)] sm:text-4xl lg:text-5xl">
                {home.finalCta.headline}
              </h2>
              <p className="max-w-xl text-base text-[var(--color-bone-200)] sm:text-lg">
                {home.finalCta.subhead}
              </p>
              <Button
                asChild
                size="lg"
                className="bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)] hover:bg-[var(--color-terracotta-700)]"
              >
                <Link href={home.finalCta.href}>
                  {home.finalCta.label}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
