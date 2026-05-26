"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import { Magnet } from "@/components/ui/Magnet";

export interface CtaLink { label: string; href: string }

export interface PageHeroProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  media?: string;
  mediaAlt?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  className?: string;
  fullHeight?: boolean;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

function AnimatedHeadline({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
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
  fullHeight = false,
}: PageHeroProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-[var(--color-bone-50)]",
        fullHeight ? "min-h-screen flex items-center" : "py-24 sm:py-32 lg:py-40",
        className,
      )}
    >
      {/* Ambient floating orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-[var(--color-terracotta-500)] opacity-[0.03] blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[var(--color-sage-400)] opacity-[0.04] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[var(--color-terracotta-300)] opacity-[0.02] blur-[150px] animate-[float_8s_ease-in-out_infinite]" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(182,188,177,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(182,188,177,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <Container>
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className={cn(
            "grid gap-12 lg:gap-20",
            media && "lg:grid-cols-[1.1fr_1fr] lg:items-center",
          )}
        >
          {/* Text content */}
          <div className="flex flex-col gap-6">
            {eyebrow ? (
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-terracotta-500)]"
              >
                {eyebrow}
              </motion.p>
            ) : null}

            <AnimatedHeadline
              text={headline}
              className="font-display text-4xl leading-[1.02] text-[var(--color-ink-900)] sm:text-5xl lg:text-6xl xl:text-7xl"
            />

            {subhead ? (
              <motion.p
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-xl text-lg leading-relaxed text-[var(--color-ink-500)] sm:text-xl"
              >
                {subhead}
              </motion.p>
            ) : null}

            {(primaryCta || secondaryCta) ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-2 flex flex-wrap items-center gap-4"
              >
                {primaryCta ? (
                  <Magnet strength={12}>
                    <Button
                      asChild
                      size="lg"
                      className="shadow-sm bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)] hover:bg-[var(--color-terracotta-700)] hover:shadow-[0_0_24px_rgba(199,118,84,0.25)] transition-all duration-300"
                    >
                      <Link href={primaryCta.href}>
                        {primaryCta.label}
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </Magnet>
                ) : null}
                {secondaryCta ? (
                  <Magnet strength={12}>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="shadow-sm border-[var(--color-ink-900)] text-[var(--color-ink-900)] hover:bg-[var(--color-ink-900)] hover:text-[var(--color-bone-50)] transition-all duration-300"
                    >
                      <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                    </Button>
                  </Magnet>
                ) : null}
              </motion.div>
            ) : null}
          </div>

          {/* Media */}
          {media ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--color-bone-200)] shadow-xl"
            >
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0"
              >
                <Image
                  src={media}
                  alt={mediaAlt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
              {/* Film grain overlay */}
              <div
                className="absolute inset-0 z-10 opacity-[0.03] mix-blend-multiply pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "128px 128px",
                }}
              />
              {/* Gradient vignette */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-ink-900)]/10 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          ) : null}
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      {fullHeight ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown className="size-4 text-[var(--color-ink-500)]" />
          </motion.div>
        </motion.div>
      ) : null}
    </section>
  );
}
