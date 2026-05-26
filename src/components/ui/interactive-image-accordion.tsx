"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Accordion data — themed for Aura Salon ── */
interface AccordionItemData {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
}

const defaultItems: AccordionItemData[] = [
  {
    id: 1,
    title: "Hair",
    subtitle: "Cuts, color & considered finishes",
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
    href: "/services?category=Hair",
  },
  {
    id: 2,
    title: "Nails",
    subtitle: "Dry-prep manicures & pedicures",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1974&auto=format&fit=crop",
    href: "/services?category=Nails",
  },
  {
    id: 3,
    title: "Skin",
    subtitle: "Facials, microcurrent & dermaplane",
    imageUrl:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    href: "/services?category=Skin",
  },
  {
    id: 4,
    title: "Spa",
    subtitle: "Massage, wraps & slow treatments",
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop",
    href: "/services?category=Spa",
  },
  {
    id: 5,
    title: "Bridal",
    subtitle: "Wedding-day beauty & trial sessions",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop",
    href: "/services",
  },
];

/* ── Single accordion panel ── */
function AccordionPanel({
  item,
  isActive,
  onMouseEnter,
}: {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
}) {
  return (
    <motion.div
      className={cn(
        "relative h-[450px] overflow-hidden cursor-pointer",
        "transition-[width] duration-700 ease-in-out",
        isActive ? "w-[400px]" : "w-[60px]",
      )}
      onMouseEnter={onMouseEnter}
      layout
    >
      {/* Background image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Active state content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            <h3 className="text-white text-2xl font-semibold mb-1">
              {item.title}
            </h3>
            <p className="text-white/70 text-sm mb-4">{item.subtitle}</p>
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 text-label-caps text-white border-b border-white/40 pb-1 hover:border-white transition-all"
            >
              Explore
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inactive vertical label */}
      <span
        className={cn(
          "absolute text-white text-lg font-semibold whitespace-nowrap",
          "transition-all duration-500 ease-in-out",
          isActive
            ? "opacity-0 bottom-6 left-1/2 -translate-x-1/2 rotate-0"
            : "opacity-100 bottom-24 left-1/2 -translate-x-1/2 rotate-90",
        )}
      >
        {item.title}
      </span>
    </motion.div>
  );
}

/* ── Main exported component ── */
export interface InteractiveImageAccordionProps {
  items?: AccordionItemData[];
  defaultActiveIndex?: number;
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function InteractiveImageAccordion({
  items = defaultItems,
  defaultActiveIndex = 3,
  heading = "Every visit, considered.",
  subheading = "Hair, nails, skin, spa, and bridal — five categories of care under one roof, by stylists who take the time to listen.",
  ctaLabel = "Book an appointment",
  ctaHref = "/book",
  className,
}: InteractiveImageAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  const handleItemHover = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <div className={cn("font-sans", className)}>
      <section className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left: text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-5/12 text-center md:text-left"
          >
            <span className="text-label-caps text-[var(--color-outline)] tracking-widest block mb-4">
              OUR SERVICES
            </span>
            <h2 className="text-headline-md md:text-display-lg-mobile text-[var(--color-on-surface)] leading-tight tracking-tight">
              {heading}
            </h2>
            <p className="mt-6 text-body-lg text-[var(--color-on-surface-variant)] max-w-xl mx-auto md:mx-0">
              {subheading}
            </p>
            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-block bg-[var(--color-primary)] text-[var(--color-on-primary)] px-8 py-4 text-label-caps hover:opacity-90 active:scale-[0.98] transition-all duration-300"
              >
                {ctaLabel}
              </Link>
            </div>
          </motion.div>

          {/* Right: image accordion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-7/12"
          >
            <div className="flex flex-row items-center justify-center gap-3 overflow-x-auto p-2">
              {items.map((item, index) => (
                <AccordionPanel
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
