import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/data";
import type { ServiceCategory } from "@/data/types";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Services" };

const CATEGORY_ORDER: ServiceCategory[] = ["Hair", "Nails", "Skin", "Spa"];

const CATEGORY_SUBTITLE: Record<ServiceCategory, string> = {
  Hair: "Cuts, color, and bridal styling — built around your texture, growth pattern, and the way you actually wear your hair.",
  Nails: "Careful prep, non-toxic polish, and gel that lasts. Done in heated stone chairs at the back of the salon.",
  Skin: "Facials, microcurrent, and dermaplaning led by a licensed esthetician with clinical training.",
  Spa: "Massage and full-body treatments in a dim, quiet room — pressure shaped to what's tight that week.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        headline="What we do, and how long it takes."
        subhead="Pricing is transparent; durations are realistic. We'll never make you guess."
      />

      {CATEGORY_ORDER.map((category, idx) => {
        const items = services.filter((s) => s.category === category);
        if (items.length === 0) return null;
        const isAlt = idx % 2 === 1;
        return (
          <section
            key={category}
            className={
              isAlt
                ? "border-y border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-24"
                : "bg-[var(--color-bone-50)] py-20 sm:py-24"
            }
          >
            <Container>
              <SectionHeader
                eyebrow={category}
                title={`${category} services`}
                subtitle={CATEGORY_SUBTITLE[category]}
              />
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((svc) => (
                  <Card
                    key={svc.id}
                    className="overflow-hidden bg-[var(--color-bone-50)] py-0"
                  >
                    {svc.image ? (
                      <div className="relative aspect-[5/3] w-full overflow-hidden bg-[var(--color-bone-200)]">
                        <Image
                          src={svc.image}
                          alt={svc.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <CardContent className="flex flex-col gap-4 py-6">
                      <h3 className="font-display text-2xl leading-tight text-[var(--color-ink-900)]">
                        {svc.name}
                      </h3>
                      <p className="text-sm text-[var(--color-ink-500)]">
                        {svc.description.split(".")[0]}.
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-ink-500)]">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5" aria-hidden />
                          {svc.durationMin} min
                        </span>
                        <span aria-hidden className="text-[var(--color-mist-400)]">
                          ·
                        </span>
                        <span className="text-[var(--color-ink-900)]">
                          {svc.priceFrom ? "from " : ""}${svc.priceUSD}
                        </span>
                      </div>
                      <div className="pt-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/services/${svc.slug}`}>
                            View details
                            <ArrowRight className="ml-2 size-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
