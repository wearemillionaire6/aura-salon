"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { FadeUp } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/content";

export default function FaqPage() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faq;
    return faq.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        headline="Most-asked questions"
        subhead="Can't find what you're looking for? hello@aurasalon.example"
      />

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <FadeUp>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-ink-500)]"
                  aria-hidden
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the FAQ"
                  aria-label="Search the FAQ"
                  className="h-11 pl-9"
                />
              </div>
            </FadeUp>

            <div className="mt-8">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--color-ink-500)]">
                  No matches for &ldquo;{query}&rdquo;. Try a different word, or{" "}
                  <Link
                    href="/contact"
                    className="underline hover:text-[var(--color-terracotta-700)]"
                  >
                    ask us directly
                  </Link>
                  .
                </p>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {filtered.map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="py-5">
                        <span className="font-display text-lg text-[var(--color-ink-900)]">
                          {item.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-base leading-relaxed text-[var(--color-ink-500)]">
                          {item.a}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            <FadeUp>
              <div className="mt-16 flex flex-col items-center gap-4 border-t border-[var(--color-mist-200)] pt-12 text-center">
                <h2 className="font-display text-2xl text-[var(--color-ink-900)]">
                  Still curious?
                </h2>
                <p className="max-w-md text-sm text-[var(--color-ink-500)]">
                  Send us a note — we read everything and answer within a
                  business day.
                </p>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    Get in touch
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>
    </>
  );
}
