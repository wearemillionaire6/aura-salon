import Image from "next/image";
import Link from "next/link";
import { services, type Service, type ServiceCategory } from "@/data";

const CATEGORY_ORDER: ServiceCategory[] = ["Hair", "Nails", "Skin", "Spa"];

function groupByCategory(svcs: Service[]) {
  const groups = new Map<ServiceCategory, Service[]>();
  for (const cat of CATEGORY_ORDER) {
    groups.set(cat, svcs.filter((s) => s.category === cat));
  }
  return groups;
}

export default function ServicesPage() {
  const grouped = groupByCategory(services);

  return (
    <main className="pt-32">
      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] mb-[var(--spacing-section-lg)]">
        <span className="text-label-caps text-[var(--color-primary)] mb-4 block">The Full Menu</span>
        <h1 className="text-display-lg-mobile md:text-display-lg max-w-3xl mb-6">Care, by hand.</h1>
        <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-xl">
          Hair, nails, skin, and bodywork in a quiet, considered space — by stylists who take the time to listen. Every appointment is booked with generous breathing room.
        </p>
      </header>

      {/* Category sections */}
      {CATEGORY_ORDER.map((cat, catIndex) => {
        const catServices = grouped.get(cat) || [];
        if (catServices.length === 0) return null;
        const isEven = catIndex % 2 === 0;

        return (
          <section
            key={cat}
            className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] mb-[var(--spacing-section-lg)]"
            id={cat.toLowerCase()}
          >
            {/* Category header with divider */}
            <div className="flex items-center gap-4 mb-12">
              {!isEven && <div className="h-px bg-[var(--color-outline-variant)]/20 flex-grow" />}
              <h2 className="text-headline-md">{cat}</h2>
              {isEven && <div className="h-px bg-[var(--color-outline-variant)]/20 flex-grow" />}
            </div>

            {/* Service cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
              {catServices.map((svc) => (
                <div key={svc.id} className="group bg-[var(--color-surface-cream)] overflow-hidden">
                  {svc.image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <Image
                        src={svc.image}
                        alt={svc.name}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <span className="text-label-caps text-[var(--color-primary)] mb-2 block">
                      {svc.durationMin} MIN · {svc.priceFrom ? "FROM " : ""}${svc.priceUSD}
                    </span>
                    <h3 className="text-headline-sm mb-4">{svc.name}</h3>
                    <p className="text-body-sm text-[var(--color-on-surface-variant)] mb-8 line-clamp-3">
                      {svc.description}
                    </p>
                    <Link
                      href={`/book?service=${svc.slug}`}
                      className="inline-flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-3 text-label-caps hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-all duration-300"
                    >
                      Book Service
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
