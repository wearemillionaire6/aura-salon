"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, Bookmark, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const HOURS = [
  { day: "Mon", value: "Closed" },
  { day: "Tue", value: "10:00–20:00" },
  { day: "Wed", value: "10:00–20:00" },
  { day: "Thu", value: "10:00–20:00" },
  { day: "Fri", value: "10:00–21:00" },
  { day: "Sat", value: "09:00–20:00" },
  { day: "Sun", value: "10:00–18:00" },
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
    <footer className="bg-[var(--color-ink-900)] py-16 text-[var(--color-bone-100)]">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-display text-3xl text-[var(--color-bone-50)]">
              Aura
            </Link>
            <p className="mt-3 text-sm text-[var(--color-bone-100)]/80">
              A destination salon in the West Village. Hair, nails, skin, and bodywork by people who take the time.
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full p-2 transition-colors hover:bg-white/10">
                <Instagram className="size-4" />
              </Link>
              <Link href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="rounded-full p-2 transition-colors hover:bg-white/10">
                <Bookmark className="size-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-[var(--color-bone-50)]">Visit</h4>
            <address className="mt-3 not-italic text-sm text-[var(--color-bone-100)]/80">
              342 Bleecker Street<br />
              Ground Floor<br />
              New York, NY 10014
            </address>
            <p className="mt-3 text-sm text-[var(--color-bone-100)]/80">
              <a href="tel:+12125550148" className="hover:text-[var(--color-bone-50)]">+1 (212) 555-0148</a><br />
              <a href="mailto:hello@aurasalon.example" className="hover:text-[var(--color-bone-50)]">hello@aurasalon.example</a>
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg text-[var(--color-bone-50)]">Hours</h4>
            <ul className="mt-3 space-y-1 text-sm text-[var(--color-bone-100)]/80">
              {HOURS.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className={h.value === "Closed" ? "text-[var(--color-bone-100)]/50" : ""}>{h.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-[var(--color-bone-50)]">Newsletter</h4>
            <p className="mt-3 text-sm text-[var(--color-bone-100)]/80">
              Seasonal notes and occasional appointments. No more than once a month.
            </p>
            <form onSubmit={onSubmit} className="mt-4 flex gap-2">
              <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
              <Input
                id="footer-newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/5 text-[var(--color-bone-50)] placeholder:text-[var(--color-bone-100)]/40 border-white/10"
              />
              <Button type="submit" size="icon" variant="secondary" aria-label="Subscribe">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-[var(--color-bone-100)]/60">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Aura Salon & Spa</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-[var(--color-bone-50)]">Cancellation</a>
              <a href="#" className="hover:text-[var(--color-bone-50)]">Privacy</a>
              <a href="#" className="hover:text-[var(--color-bone-50)]">Terms</a>
              <a href="#" className="hover:text-[var(--color-bone-50)]">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
