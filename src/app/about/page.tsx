import Image from "next/image";
import Link from "next/link";
import { stylists } from "@/data";

const values = [
  {
    title: "Intentional beauty",
    text: "Every service begins with a conversation. We work with what you arrived with — never a formula.",
  },
  {
    title: "Transparent pricing",
    text: "No hidden charges. Quoted price is the final price, before gratuity.",
  },
  {
    title: "Clean formulations",
    text: "Olaplex, Davines, Tata Harper, and a short list of products we actually use ourselves.",
  },
  {
    title: "Slow appointments",
    text: "Chairs are spaced far apart. Music is low. No double-booking, ever.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-32">
      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] mb-[var(--spacing-section-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)] items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <span className="text-label-caps text-[var(--color-primary)] mb-4 block">About Us</span>
            <h1 className="text-display-lg-mobile md:text-display-lg mb-6">A room with a point of view.</h1>
            <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-md">
              Aura opened in 2019 with four chairs and a belief that the salon experience should feel as good as the result.
            </p>
          </div>
          <div className="md:col-span-7 order-1 md:order-2 mb-10 md:mb-0">
            <div className="relative overflow-hidden aspect-[4/5] md:aspect-[1.2/1]">
              <Image
                src="/images/hero.png"
                alt="Aura salon interior"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Values */}
      <section className="bg-[var(--color-surface-cream)] py-[var(--spacing-section-lg)]">
        <div className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)]">
          <div className="mb-16">
            <span className="text-label-caps text-[var(--color-outline)] block mb-4">WHAT WE STAND FOR</span>
            <h2 className="text-headline-md">Four ideas behind the work.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
            {values.map((v, i) => (
              <div key={v.title} className="p-8 border-l border-[var(--color-outline-variant)]/20">
                <div className="flex gap-4 items-start">
                  <span className="text-headline-sm text-[var(--color-primary)] font-light">{i + 1}</span>
                  <div>
                    <h3 className="text-title-lg mb-3">{v.title}</h3>
                    <p className="text-body-sm text-[var(--color-on-surface-variant)]">{v.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="py-[var(--spacing-section-lg)]">
        <div className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)]">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-label-caps text-[var(--color-outline)] block mb-4">THE TEAM</span>
              <h2 className="text-headline-md">Six stylists. One standard.</h2>
            </div>
            <Link
              href="/team"
              className="hidden md:inline-flex text-label-caps text-[var(--color-on-secondary-container)] border border-[var(--color-outline-variant)]/30 px-6 py-3 hover:bg-[var(--color-surface-cream)] transition-all"
            >
              Meet everyone
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
            {stylists.slice(0, 3).map((sty) => (
              <Link key={sty.id} href={`/team/${sty.slug}`} className="group">
                <div className="relative aspect-[3/4] bg-[var(--color-surface-cream)] overflow-hidden mb-6">
                  <Image
                    src={sty.avatarUrl}
                    alt={sty.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-title-lg mb-1">{sty.name}</h3>
                <p className="text-label-caps text-[var(--color-outline)]">{sty.title.toUpperCase()}</p>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link
              href="/team"
              className="text-label-caps border border-[var(--color-outline-variant)]/30 px-8 py-4 hover:bg-[var(--color-surface-cream)] transition-all"
            >
              Meet everyone
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[var(--spacing-section-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] max-w-[1200px] mx-auto">
        <div className="relative bg-[var(--color-on-surface)] text-[var(--color-on-primary)] p-12 md:p-24 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <h2 className="text-headline-md mb-6 relative z-10">Ready to see the difference?</h2>
          <p className="text-body-lg mb-10 text-[var(--color-surface-cream)]/80 max-w-md mx-auto relative z-10">
            Book online any time. Walk-ins welcome when we have the space.
          </p>
          <div className="relative z-10">
            <Link
              href="/book"
              className="inline-block bg-[var(--color-primary)] text-[var(--color-on-primary)] px-10 py-5 text-label-caps hover:opacity-90 transition-all"
            >
              Book an appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
