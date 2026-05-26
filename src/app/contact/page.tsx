"use client";

import * as React from "react";
import { toast } from "sonner";

const CONTACT_INFO = [
  { label: "Address", value: "342 Bleecker Street, Ground Floor, New York, NY 10014" },
  { label: "Phone", value: "+1 (212) 555-0148", href: "tel:+12125550148" },
  { label: "Email", value: "hello@aurasalon.example", href: "mailto:hello@aurasalon.example" },
  { label: "Hours", value: "Tue–Fri 10–8, Sat 9–8, Sun 10–6" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent — we'll reply within 24 hours.");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="pt-32">
      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] mb-[var(--spacing-section-sm)]">
        <span className="text-label-caps text-[var(--color-primary)] mb-4 block">Contact</span>
        <h1 className="text-display-lg-mobile md:text-display-lg max-w-3xl mb-6">We&apos;re here.</h1>
        <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-xl">
          Walk-ins welcome Tuesday through Sunday. For questions, use the form or call during business hours.
        </p>
      </header>

      <section className="max-w-[1200px] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-gutter)] pb-[var(--spacing-section-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-section-sm)]">
          {/* Contact details */}
          <div>
            <h2 className="text-headline-sm mb-8">Get in touch</h2>
            <div className="space-y-6">
              {CONTACT_INFO.map(({ label, value, href }) => (
                <div key={label} className="p-6 border-l border-[var(--color-outline-variant)]/20">
                  <p className="text-label-caps text-[var(--color-outline)] mb-2">{label.toUpperCase()}</p>
                  {href ? (
                    <a href={href} className="text-body-lg text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-body-lg text-[var(--color-on-surface)]">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-[var(--color-surface-cream)] p-8 md:p-12 border border-[var(--color-outline-variant)]/10">
            <h3 className="text-headline-sm mb-8">Send us a message</h3>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="text-label-caps text-[var(--color-outline)] block mb-3">
                    NAME
                  </label>
                  <input
                    id="contact-name"
                    required
                    placeholder="Your name"
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 px-4 py-3 text-body-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-outline)]"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-label-caps text-[var(--color-outline)] block mb-3">
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 px-4 py-3 text-body-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-outline)]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-phone" className="text-label-caps text-[var(--color-outline)] block mb-3">
                  PHONE <span className="normal-case tracking-normal text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="(212) 555-0000"
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 px-4 py-3 text-body-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-outline)]"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-label-caps text-[var(--color-outline)] block mb-3">
                  MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  required
                  placeholder="How can we help?"
                  rows={5}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 px-4 py-3 text-body-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none placeholder:text-[var(--color-outline)]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] px-8 py-4 text-label-caps hover:opacity-90 transition-all"
              >
                {submitted ? "Sent ✓" : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
