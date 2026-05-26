"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MenuBar } from "@/components/ui/glow-menu";
import { Home, Sparkles, Users, Image as ImageIcon } from "lucide-react";

const NAV_ITEMS = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    gradient: "radial-gradient(circle, rgba(135,77,48,0.12) 0%, rgba(135,77,48,0.04) 50%, rgba(135,77,48,0) 100%)",
    iconColor: "text-[var(--color-primary)]",
  },
  {
    icon: Sparkles,
    label: "Services",
    href: "/services",
    gradient: "radial-gradient(circle, rgba(135,77,48,0.12) 0%, rgba(135,77,48,0.04) 50%, rgba(135,77,48,0) 100%)",
    iconColor: "text-[var(--color-primary)]",
  },
  {
    icon: Users,
    label: "Team",
    href: "/team",
    gradient: "radial-gradient(circle, rgba(135,77,48,0.12) 0%, rgba(135,77,48,0.04) 50%, rgba(135,77,48,0) 100%)",
    iconColor: "text-[var(--color-primary)]",
  },
  {
    icon: ImageIcon,
    label: "Gallery",
    href: "/gallery",
    gradient: "radial-gradient(circle, rgba(135,77,48,0.12) 0%, rgba(135,77,48,0.04) 50%, rgba(135,77,48,0) 100%)",
    iconColor: "text-[var(--color-primary)]",
  },
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

  const activeItem = React.useMemo(() => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/services")) return "Services";
    if (pathname.startsWith("/team")) return "Team";
    if (pathname.startsWith("/gallery")) return "Gallery";
    return "";
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
        {/* Logo — Bold, tracked-out aesthetic branding */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-[0.25em] text-[var(--color-on-surface)] hover:opacity-80 transition-opacity font-display"
        >
          AURA
        </Link>

        {/* Desktop nav — Glow Menu with custom radial gradients and glassmorphism */}
        <div className="hidden md:flex items-center gap-6">
          <MenuBar items={NAV_ITEMS} activeItem={activeItem} />
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
            {NAV_ITEMS.map((item) => (
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
