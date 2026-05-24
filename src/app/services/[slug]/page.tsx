import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { addons, gallery, services, stylists } from "@/data";
import { ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = services.find((s) => s.slug === slug);
  if (!svc) return { title: "Service" };
  return { title: svc.name, description: svc.description };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = services.find((s) => s.slug === slug);
  if (!svc) notFound();

  const matchedAddOns = addons.filter((a) => svc.addOnIds.includes(a.id));
  const eligibleStylists = stylists.filter((s) =>
    s.eligibleServiceIds.includes(svc.id),
  );
  const relatedGallery = gallery
    .filter((g) => g.category === svc.category)
    .slice(0, 6);

  const priceLabel = `${svc.priceFrom ? "from " : ""}$${svc.priceUSD}`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="flex flex-col gap-5">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: svc.name },
                ]}
              />
              <h1 className="font-display text-4xl leading-[1.05] text-[var(--color-ink-900)] sm:text-5xl lg:text-6xl">
                {svc.name}
              </h1>
              <p className="max-w-xl text-lg text-[var(--color-ink-500)]">
                {svc.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{svc.category}</Badge>
                <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-500)]">
                  <Clock className="size-4" aria-hidden />
                  {svc.durationMin} min
                </span>
                <span aria-hidden className="text-[var(--color-mist-400)]">
                  ·
                </span>
                <span className="text-sm text-[var(--color-ink-900)]">
                  {priceLabel}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href={`/book?service=${svc.slug}`}>
                    Book this · ${svc.priceUSD}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
            {svc.image ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[var(--color-bone-200)]">
                <Image
                  src={svc.image}
                  alt={svc.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* What's included */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="What's included"
            title="Every step of the appointment."
            subtitle="No surprises at checkout — here's what's in the price."
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {svc.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bone-50)] p-4"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-terracotta-500)]"
                  aria-hidden
                />
                <span className="text-sm text-[var(--color-ink-900)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Add-ons */}
      {matchedAddOns.length > 0 ? (
        <section className="bg-[var(--color-bone-50)] py-20 sm:py-24">
          <Container>
            <SectionHeader
              eyebrow="Add-ons"
              title="Pair it with something."
              subtitle="Optional enhancements available for this service. Add at booking or in the chair."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {matchedAddOns.map((addon) => (
                <Card key={addon.id} className="bg-[var(--color-bone-50)]">
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                        {addon.name}
                      </h3>
                      <div className="text-right text-sm whitespace-nowrap text-[var(--color-ink-500)]">
                        <div className="text-[var(--color-ink-900)]">
                          +${addon.priceUSD}
                        </div>
                        {addon.durationMin > 0 ? (
                          <div>+{addon.durationMin} min</div>
                        ) : (
                          <div>no added time</div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-ink-500)]">
                      {addon.description}
                    </p>
                    <div className="pt-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          href={`/book?service=${svc.slug}&addOn=${addon.id}`}
                        >
                          <Sparkles className="mr-1 size-4" aria-hidden />
                          Add
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Eligible stylists */}
      {eligibleStylists.length > 0 ? (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-24">
          <Container>
            <SectionHeader
              eyebrow="Who does this"
              title="Eligible stylists."
              subtitle="Any of these team members can take this service. Pick a person, or let us match you."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eligibleStylists.map((stylist) => {
                const first = stylist.name.split(" ")[0];
                return (
                  <Card key={stylist.id} className="bg-[var(--color-bone-50)]">
                    <CardContent className="flex flex-col items-start gap-4">
                      <div className="relative size-20 overflow-hidden rounded-full bg-[var(--color-bone-200)]">
                        <Image
                          src={stylist.avatarUrl}
                          alt={stylist.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                          {stylist.name}
                        </h3>
                        <p className="text-sm text-[var(--color-ink-500)]">
                          {stylist.title}
                        </p>
                      </div>
                      <Separator />
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/book?service=${svc.slug}&stylist=${stylist.slug}`}
                        >
                          Book with {first}
                          <ArrowRight className="ml-2 size-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Recent work */}
      {relatedGallery.length > 0 ? (
        <section className="bg-[var(--color-bone-50)] py-20 sm:py-24">
          <Container>
            <SectionHeader
              eyebrow="Recent work"
              title={`${svc.category} from the chair.`}
              subtitle="A small selection from the last few months."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGallery.map((g) => (
                <figure
                  key={g.id}
                  className="overflow-hidden rounded-lg bg-[var(--color-bone-200)]"
                >
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={g.imageUrl}
                      alt={g.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {g.caption ? (
                    <figcaption className="px-4 py-3 text-xs text-[var(--color-ink-500)]">
                      {g.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-24">
        <Container>
          <Card className="mx-auto max-w-3xl bg-[var(--color-bone-50)]">
            <CardContent className="flex flex-col items-center gap-5 py-8 text-center">
              <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                {svc.name}
              </p>
              <h2 className="font-display text-3xl leading-tight text-[var(--color-ink-900)] sm:text-4xl">
                Find a time that works.
              </h2>
              <p className="max-w-xl text-[var(--color-ink-500)]">
                {svc.durationMin} minutes · {priceLabel}. Real availability,
                shown by stylist.
              </p>
              <div className="mt-2">
                <Button asChild size="lg">
                  <Link href={`/book?service=${svc.slug}`}>
                    Book this service
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
