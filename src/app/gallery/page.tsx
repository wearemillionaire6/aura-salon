"use client";

import * as React from "react";
import Image from "next/image";
import { gallery, type GalleryImage } from "@/data";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Hair", "Nails", "Skin", "Spa"] as const;

export default function GalleryPage() {
  const [active, setActive] = React.useState<(typeof CATEGORIES)[number]>("All");
  const [lightbox, setLightbox] = React.useState<GalleryImage | null>(null);

  const filtered = active === "All" ? gallery : gallery.filter((g) => g.category === active);

  return (
    <main className="pt-32">
      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] mb-16">
        <span className="text-label-caps text-[var(--color-primary)] mb-4 block">Gallery</span>
        <h1 className="text-display-lg-mobile md:text-display-lg max-w-3xl mb-6">The work, close up.</h1>
        <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-xl">
          Real clients, natural light, zero retouching. Filtered by category or browse them all.
        </p>
      </header>

      {/* Category pills */}
      <div className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] mb-12">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? gallery.length : gallery.filter((g) => g.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  "flex-shrink-0 px-6 py-3 text-label-caps transition-all duration-200",
                  active === cat
                    ? "bg-[var(--color-on-surface)] text-[var(--color-on-primary)]"
                    : "border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-cream)]",
                )}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] pb-[var(--spacing-section-lg)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightbox(img)}
              className="group relative aspect-square overflow-hidden bg-[var(--color-surface-cream)]"
            >
              <Image
                src={img.imageUrl}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[var(--color-on-surface)]/0 group-hover:bg-[var(--color-on-surface)]/30 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-on-surface)]/90 backdrop-blur-sm p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-h-[85vh] max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.alt}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-on-surface)] shadow-md"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {lightbox.caption && (
              <p className="mt-4 text-center text-body-sm text-[var(--color-surface-cream)]/70">
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
