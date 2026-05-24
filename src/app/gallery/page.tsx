"use client";

import * as React from "react";
import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { FadeUp } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { gallery } from "@/data";
import { galleryIntros } from "@/content";
import { cn } from "@/lib/utils";

type Category = keyof typeof galleryIntros;

const categories: Category[] = ["All", "Hair", "Nails", "Skin", "Spa", "Interior"];

export default function GalleryPage() {
  const [selected, setSelected] = React.useState<Category>("All");

  const filtered = React.useMemo(() => {
    if (selected === "All") return gallery;
    return gallery.filter((img) => img.category === selected);
  }, [selected]);

  const intro = galleryIntros[selected];

  return (
    <>
      <PageHero
        eyebrow={galleryIntros.All.eyebrow}
        headline={galleryIntros.All.title}
        subhead={galleryIntros.All.subhead}
      />

      <section className="py-12 sm:py-16">
        <Container>
          {/* Filter row */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = cat === selected;
              return (
                <Button
                  key={cat}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelected(cat)}
                  className={cn(
                    active &&
                      "bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)] hover:bg-[var(--color-terracotta-700)]",
                  )}
                  aria-pressed={active}
                >
                  {cat}
                </Button>
              );
            })}
          </div>

          {/* Intro for current filter */}
          <FadeUp>
            <div className="mt-10 max-w-2xl">
              <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                {intro.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-2xl text-[var(--color-ink-900)] sm:text-3xl">
                {intro.title}
              </h2>
              <p className="mt-3 text-base text-[var(--color-ink-500)]">
                {intro.subhead}
              </p>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Grid */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((img) => (
              <Dialog key={img.id}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group relative block aspect-[3/4] w-full overflow-hidden rounded-lg bg-[var(--color-bone-200)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                    aria-label={img.alt}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogTitle className="sr-only">{img.alt}</DialogTitle>
                  <DialogDescription className="sr-only">
                    {img.caption ?? img.alt}
                  </DialogDescription>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[var(--color-bone-200)]">
                    <Image
                      src={img.imageUrl}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 768px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-[var(--color-ink-500)]">
                    {img.caption ?? img.alt}
                  </p>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-center text-sm text-[var(--color-ink-500)]">
              Nothing here yet for this category. Check back soon.
            </p>
          ) : null}
        </Container>
      </section>
    </>
  );
}
