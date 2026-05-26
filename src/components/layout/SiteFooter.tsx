"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";

const HOURS = [
  { day: "Mon", value: "Closed", muted: true },
  { day: "Tue – Thu", value: "10:00–20:00", muted: false },
  { day: "Fri", value: "10:00–21:00", muted: false },
  { day: "Sat", value: "09:00–20:00", muted: false },
  { day: "Sun", value: "10:00–18:00", muted: false },
];

export function SiteFooter() {
  const [email, setEmail] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("That email doesn't look right.");
      return;
    }
    toast.success("Thanks — we'll be in touch.");
    setEmail("");
  };

  return (
    <footer className="bg-[var(--color-surface-cream)] w-full mt-[var(--spacing-section-lg)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-gutter)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] py-[var(--spacing-section-sm)] max-w-[1200px] mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <Link href="/" className="text-headline-sm text-[var(--color-on-surface)] block mb-6">
            Aura
          </Link>
          <p className="text-body-sm text-[var(--color-on-surface-variant)] mb-6">
            A destination salon in the West Village. Hair, nails, skin, and bodywork by people who take the time.
          </p>
        </div>

        {/* Visit */}
        <div>
          <h4 className="text-label-caps text-[var(--color-on-surface)] mb-8">VISIT</h4>
          <address className="not-italic text-body-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            342 Bleecker Street<br />
            Ground Floor<br />
            New York, NY 10014<br /><br />
            <a href="tel:+12125550148" className="hover:text-[var(--color-primary)] transition-colors">
              +1 (212) 555-0148
            </a><br />
            <a href="mailto:hello@aurasalon.example" className="hover:text-[var(--color-primary)] transition-colors">
              hello@aurasalon.example
            </a>
          </address>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-label-caps text-[var(--color-on-surface)] mb-8">HOURS</h4>
          <ul className="text-body-sm text-[var(--color-on-surface-variant)] space-y-2">
            {HOURS.map((h) => (
              <li key={h.day} className="flex justify-between">
                <span>{h.day}</span>
                <span className={h.muted ? "text-[var(--color-outline)]" : ""}>
                  {h.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-label-caps text-[var(--color-on-surface)] mb-8">NEWSLETTER</h4>
          <p className="text-body-sm text-[var(--color-on-surface-variant)] mb-6">
            Seasonal notes and occasional appointments. No more than once a month.
          </p>
          <form onSubmit={onSubmit} className="relative">
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[var(--color-surface)] border-none border-b border-[var(--color-outline-variant)]/30 px-0 py-3 text-body-sm focus:ring-0 focus:border-[var(--color-primary)] transition-all placeholder:text-[var(--color-outline)]"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-primary)] hover:opacity-70 transition-opacity"
              aria-label="Subscribe"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] py-10 border-t border-[var(--color-outline-variant)]/10 max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-body-sm text-[var(--color-outline)]">
          © {new Date().getFullYear()} Aura Salon &amp; Spa. All rights reserved.
        </p>
        <div className="flex gap-8">
          {["Location", "Hours", "Newsletter", "Privacy Policy"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-label-caps text-[var(--color-on-secondary-container)] hover:text-[var(--color-primary)] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
