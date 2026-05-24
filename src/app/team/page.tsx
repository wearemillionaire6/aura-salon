import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { stylists } from "@/data";

export const metadata = { title: "Our Team" };

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="The team"
        headline="The people who'll actually be at your appointment."
        subhead="Six stylists. One floor. Each picked for their hands and for the way they listen."
      />

      <section className="bg-[var(--color-bone-50)] py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stylists.map((sty) => {
              const firstName = sty.name.split(" ")[0];
              return (
                <Card
                  key={sty.id}
                  className="overflow-hidden bg-[var(--color-bone-50)] py-0 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-bone-200)]">
                    <Image
                      src={sty.avatarUrl}
                      alt={sty.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex flex-col gap-4 py-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-2xl leading-tight text-[var(--color-ink-900)]">
                        {sty.name}
                      </h3>
                      <p className="text-sm italic text-[var(--color-ink-500)]">
                        {sty.title}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sty.specialties.slice(0, 3).map((spec) => (
                        <Badge
                          key={spec}
                          variant="outline"
                          className="bg-[var(--color-bone-100)]"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <p className="line-clamp-2 text-sm text-[var(--color-ink-500)]">
                      {sty.bio}
                    </p>
                    <Link
                      href={`https://instagram.com/${sty.instagramHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-500)] transition-colors hover:text-[var(--color-terracotta-500)]"
                    >
                      <Instagram className="size-3.5" aria-hidden />
                      {sty.instagramHandle}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/team/${sty.slug}`}>View profile</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/book?stylist=${sty.slug}`}>
                          {`Book with ${firstName}`}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
