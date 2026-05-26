"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-surface)]/95 shadow-sm border-b border-[var(--color-outline-variant)]/10 backdrop-blur-md"
          : "bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-outline-variant)]/10",
      )}
    >
      <nav className="flex justify-between items-center h-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] max-w-[1200px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-headline-sm tracking-tight text-[var(--color-on-surface)] hover:opacity-80 transition-opacity"
        >
          Aura Salon &amp; Spa
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const isHome = item.href === "/" && pathname === "/";
            const active = isActive || isHome;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-label-caps transition-colors",
                  active
                    ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1"
                    : "text-[var(--color-on-secondary-container)] hover:text-[var(--color-primary)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/book"
            className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-3 text-label-caps hover:opacity-90 active:scale-95 transition-all"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[var(--color-on-surface)] p-2"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)]/10 px-[var(--spacing-margin-mobile)] py-6">
          <div className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-label-caps text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-3 text-label-caps text-center hover:opacity-90 transition-all mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
