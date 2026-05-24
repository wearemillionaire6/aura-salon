import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import { Magnet } from "@/components/ui/Magnet";
import { DecryptedText } from "@/components/ui/DecryptedText";

export interface CtaLink { label: string; href: string }

export interface PageHeroProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  media?: string;          // image URL
  mediaAlt?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  className?: string;
}

export function PageHero({
  eyebrow,
  headline,
  subhead,
  media,
  mediaAlt,
  primaryCta,
  secondaryCta,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden py-20 sm:py-28 bg-[var(--color-bone-50)]", className)}>
      {/* Subtle ambient background grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(182,188,177,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(182,188,177,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <Container>
        <div className={cn("grid gap-12 lg:gap-16", media && "lg:grid-cols-2 lg:items-center")}>
          <div className="flex flex-col gap-5">
            {eyebrow ? (
              <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="font-display text-4xl leading-[1.05] text-[var(--color-ink-900)] sm:text-5xl lg:text-6xl">
              <DecryptedText text={headline} useInView={false} delay={200} />
            </h1>
            {subhead ? (
              <p className="max-w-xl text-lg text-[var(--color-ink-500)]">{subhead}</p>
            ) : null}
            {(primaryCta || secondaryCta) ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {primaryCta ? (
                  <Magnet strength={12}>
                    <Button asChild size="lg" className="shadow-sm">
                      <Link href={primaryCta.href}>
                        {primaryCta.label}
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </Magnet>
                ) : null}
                {secondaryCta ? (
                  <Magnet strength={12}>
                    <Button asChild size="lg" variant="outline" className="shadow-sm">
                      <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                    </Button>
                  </Magnet>
                ) : null}
              </div>
            ) : null}
          </div>
          {media ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[var(--color-bone-200)] shadow-md transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src={media}
                alt={mediaAlt ?? ""}
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
  );
}
