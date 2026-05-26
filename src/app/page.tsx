import Image from "next/image";
import Link from "next/link";
import { home } from "@/content";
import { services, stylists, testimonials, getServiceBySlug } from "@/data";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";

function pickFeaturedServices() {
  const slugs = [
    "signature-cut-and-style",
    "highlights-balayage",
    "the-aura-facial",
    "gel-manicure",
    "massage-90",
    "microcurrent-lift",
  ];
  const matched = slugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  if (matched.length >= 6) return matched.slice(0, 6);
  const seen = new Set(matched.map((s) => s.id));
  for (const svc of services) {
    if (matched.length >= 6) break;
    if (!seen.has(svc.id)) matched.push(svc);
  }
  return matched.slice(0, 6);
}

export default function HomePage() {
  const featured = pickFeaturedServices();
  const featuredStylists = stylists.slice(0, 3);

  return (
    <main className="pt-20">
      {/* ──── HERO ──── */}
      <section className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] max-w-[1200px] mx-auto py-[var(--spacing-section-sm)] md:py-[var(--spacing-section-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)] items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <span className="text-label-caps text-[var(--color-outline)] tracking-widest block mb-4">
              AURA SALON &amp; SPA · WEST VILLAGE
            </span>
            <h1 className="text-display-lg-mobile md:text-display-lg mb-6 leading-tight">
              A destination salon for the way you actually live.
            </h1>
            <p className="text-body-lg text-[var(--color-on-surface-variant)] mb-10 max-w-md">
              Hair, nails, skin, and bodywork in a quiet, considered space — by stylists who take the time to listen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-8 py-4 text-label-caps text-center hover:opacity-90 transition-all"
              >
                Book an appointment
              </Link>
              <Link
                href="/team"
                className="bg-[var(--color-surface-cream)] text-[var(--color-on-surface)] px-8 py-4 text-label-caps text-center border border-[var(--color-outline-variant)]/20 hover:bg-[var(--color-surface-container)] transition-all"
              >
                Meet the team
              </Link>
            </div>
          </div>
          <div className="md:col-span-7 order-1 md:order-2 mb-10 md:mb-0">
            <div className="relative overflow-hidden aspect-[4/5] md:aspect-[1.2/1]">
              <Image
                src="/images/hero.png"
                alt="Aura Salon Interior — warm oak under brass pendants"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──── CATEGORIES — Interactive Accordion ──── */}
      <section className="bg-[var(--color-surface-cream)] overflow-hidden">
        <InteractiveImageAccordion />
      </section>

      {/* ──── FEATURED SERVICES ──── */}
      <section className="py-[var(--spacing-section-lg)] bg-[var(--color-surface)]" id="services">
        <div className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] max-w-[1200px] mx-auto">
          <div className="mb-16">
            <span className="text-label-caps text-[var(--color-outline)] block mb-4">FEATURED SERVICES</span>
            <h2 className="text-headline-md mb-4">A small menu, done well.</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">Six of the appointments our regulars book most.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-[var(--spacing-gutter)]">
            {featured.map((svc) => (
              <div key={svc.id} className="group">
                {svc.image && (
                  <div className="aspect-square overflow-hidden mb-6 bg-[var(--color-surface-cream)]">
                    <Image
                      src={svc.image}
                      alt={svc.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-label-caps text-[var(--color-outline)]">
                    {svc.category.toUpperCase()} · {svc.durationMin} MIN · {svc.priceFrom ? "FROM " : ""}${svc.priceUSD}
                  </span>
                </div>
                <h3 className="text-title-lg mb-3">{svc.name}</h3>
                <p className="text-body-sm text-[var(--color-on-surface-variant)] mb-6 line-clamp-3">
                  {svc.description}
                </p>
                <Link
                  href={`/services/${svc.slug}`}
                  className="inline-flex items-center gap-2 text-label-caps text-[var(--color-primary)] border-b border-[var(--color-primary)]/20 pb-1 hover:border-[var(--color-primary)] transition-all"
                >
                  Book
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <Link
              href="/services"
              className="px-12 py-5 text-label-caps border border-[var(--color-outline-variant)]/30 hover:bg-[var(--color-surface-cream)] transition-all"
            >
              See the full menu
            </Link>
          </div>
        </div>
      </section>

      {/* ──── STYLIST SPOTLIGHT ──── */}
      <section className="py-[var(--spacing-section-lg)] bg-[var(--color-surface-cream)]" id="team">
        <div className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-label-caps text-[var(--color-outline)] block mb-4">STYLIST SPOTLIGHT</span>
            <h2 className="text-headline-md mb-4">A few of the people behind the chair.</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">Six stylists in all — every one of them takes their own consults.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
            {featuredStylists.map((sty) => {
              const firstName = sty.name.split(" ")[0];
              return (
                <div key={sty.id} className="bg-[var(--color-surface)] p-12 text-center border border-[var(--color-outline-variant)]/10">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-surface-cream)] mx-auto mb-8 relative overflow-hidden">
                    <Image
                      src={sty.avatarUrl}
                      alt={sty.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-title-lg mb-1">{sty.name}</h3>
                  <p className="text-label-caps text-[var(--color-outline)] mb-6">{sty.title.toUpperCase()}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {sty.specialties.slice(0, 2).map((sp) => (
                      <span key={sp} className="px-3 py-1 border border-[var(--color-outline-variant)]/30 rounded-full text-[10px] font-sans uppercase tracking-[0.1em] font-medium">
                        {sp}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/team/${sty.slug}`}
                    className="text-label-caps text-[var(--color-primary)] border-b border-[var(--color-primary)]/20 pb-1 hover:border-[var(--color-primary)] transition-all"
                  >
                    Book with {firstName}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── TESTIMONIALS + VALUES ──── */}
      <section className="py-[var(--spacing-section-lg)] bg-[var(--color-surface)] relative overflow-hidden">
        <div className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] max-w-[1200px] mx-auto">
          <div className="mb-16">
            <span className="text-label-caps text-[var(--color-outline)] block mb-4">WHAT GUESTS SAY</span>
            <h2 className="text-headline-md max-w-2xl leading-tight">
              A salon you&apos;d recommend to a friend who&apos;s careful about hers.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.slice(0, 3).map((t) => {
              const svc = getServiceBySlug(t.serviceSlug);
              return (
                <div key={t.id} className="flex flex-col gap-6 p-8 bg-[var(--color-surface-cream)] border border-[var(--color-outline-variant)]/10">
                  <div className="flex gap-1 text-[var(--color-primary)]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-body-lg italic text-[var(--color-on-surface)]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <p className="text-title-lg text-[var(--color-on-surface)]">{t.name}</p>
                    {svc && <p className="text-label-caps text-[var(--color-outline)]">{svc.name.toUpperCase()}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Values */}
          <div className="mt-[var(--spacing-section-sm)] grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
            {home.valueProps.map((vp) => (
              <div key={vp.title} className="p-8 border-l border-[var(--color-outline-variant)]/20">
                <h4 className="text-title-lg mb-3">{vp.title}</h4>
                <p className="text-body-sm text-[var(--color-on-surface-variant)]">{vp.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── FINAL CTA ──── */}
      <section className="py-[var(--spacing-section-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] max-w-[1200px] mx-auto">
        <div className="relative bg-[var(--color-on-surface)] text-[var(--color-on-primary)] p-12 md:p-24 text-center overflow-hidden">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <h2 className="text-headline-md mb-6 relative z-10">{home.finalCta.headline}</h2>
          <p className="text-body-lg mb-10 text-[var(--color-surface-cream)]/80 max-w-md mx-auto relative z-10">
            {home.finalCta.subhead}
          </p>
          <div className="relative z-10">
            <Link
              href={home.finalCta.href}
              className="inline-block bg-[var(--color-primary)] text-[var(--color-on-primary)] px-10 py-5 text-label-caps hover:opacity-90 transition-all"
            >
              {home.finalCta.label}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
