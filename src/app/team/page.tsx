import Image from "next/image";
import Link from "next/link";
import { stylists, services } from "@/data";

export default function TeamPage() {
  return (
    <main className="pt-32">
      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] mb-[var(--spacing-section-lg)]">
        <span className="text-label-caps text-[var(--color-primary)] mb-4 block">The Team</span>
        <h1 className="text-display-lg-mobile md:text-display-lg max-w-3xl mb-6">People, not positions.</h1>
        <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-xl">
          Every stylist at Aura takes their own consultations, manages their own bookings, and signs off on the result.
        </p>
      </header>

      {/* Stylist grid */}
      <section className="py-[var(--spacing-section-sm)] bg-[var(--color-surface-cream)]">
        <div className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
            {stylists.map((sty) => {
              const firstName = sty.name.split(" ")[0];
              return (
                <div key={sty.id} className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/10 overflow-hidden">
                  {/* Portrait */}
                  <div className="relative aspect-[3/4] bg-[var(--color-surface-cream)] overflow-hidden">
                    <Image
                      src={sty.avatarUrl}
                      alt={sty.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-8 text-center">
                    <h3 className="text-title-lg mb-1">{sty.name}</h3>
                    <p className="text-label-caps text-[var(--color-outline)] mb-4">{sty.title.toUpperCase()}</p>
                    <p className="text-body-sm text-[var(--color-on-surface-variant)] mb-6 line-clamp-3">
                      {sty.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                      {sty.specialties.slice(0, 3).map((sp) => (
                        <span key={sp} className="px-3 py-1 border border-[var(--color-outline-variant)]/30 rounded-full text-[10px] font-sans uppercase tracking-[0.1em] font-medium">
                          {sp}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        href={`/team/${sty.slug}`}
                        className="text-label-caps text-[var(--color-primary)] border-b border-[var(--color-primary)]/20 pb-1 hover:border-[var(--color-primary)] transition-all"
                      >
                        Book with {firstName}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
