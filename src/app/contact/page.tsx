"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Instagram, Bookmark, Mail, Phone } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FadeUp } from "@/components/motion";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactForm } from "@/lib/validators";
import { contact } from "@/content";

function formatTime(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "pm" : "am";
  const display = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${display}${period}` : `${display}:${mStr}${period}`;
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (_values: ContactForm) => {
    // Simulate brief async submit
    await new Promise((r) => setTimeout(r, 250));
    toast.success("Thanks — we'll be in touch by tomorrow at the latest.");
    reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        headline={contact.hero.headline}
        subhead={contact.hero.subhead}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="Get in touch"
              title="Say hello."
              subtitle={contact.formIntro}
            />
          </FadeUp>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
              noValidate
            >
              <FormField
                id="name"
                label="Your name"
                required
                error={errors.name?.message}
              >
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  {...register("name")}
                />
              </FormField>

              <FormField
                id="email"
                label="Email"
                required
                error={errors.email?.message}
              >
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  {...register("email")}
                />
              </FormField>

              <FormField
                id="message"
                label="Message"
                required
                error={errors.message?.message}
              >
                <Textarea
                  rows={6}
                  placeholder="A few sentences about what we can help with."
                  {...register("message")}
                />
              </FormField>

              <div className="mt-2">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send message"}
                </Button>
              </div>
            </form>

            {/* Info column */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                  Visit
                </h3>
                <address className="not-italic text-base leading-relaxed text-[var(--color-ink-700)]">
                  {contact.address.line1}
                  <br />
                  {contact.address.line2}
                  <br />
                  {contact.address.city}, {contact.address.state}{" "}
                  {contact.address.postal}
                  <br />
                  {contact.address.country}
                </address>
              </div>

              {/* Map placeholder */}
              <div
                className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-[var(--color-bone-200)]"
                role="img"
                aria-label="Map placeholder for the salon location"
              >
                <span className="text-xs uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                  Map
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                  Hours
                </h3>
                <dl className="divide-y divide-[var(--color-mist-200)] border-y border-[var(--color-mist-200)]">
                  {contact.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between gap-4 py-2 text-sm"
                    >
                      <dt className="text-[var(--color-ink-700)]">{h.day}</dt>
                      <dd className="text-[var(--color-ink-500)]">
                        {h.open && h.close
                          ? `${formatTime(h.open)} – ${formatTime(h.close)}`
                          : "Closed"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                  Reach us
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex items-center gap-2 text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-700)]"
                  >
                    <Phone className="size-4" aria-hidden />
                    {contact.phone}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-700)]"
                  >
                    <Mail className="size-4" aria-hidden />
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                  Parking
                </h3>
                <p className="text-sm text-[var(--color-ink-500)]">
                  {contact.parking}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                  Follow along
                </h3>
                <div className="flex items-center gap-4">
                  <Link
                    href={`https://instagram.com/${contact.social.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-700)]"
                  >
                    <Instagram className="size-4" aria-hidden />
                    {contact.social.instagram}
                  </Link>
                  <Link
                    href={`https://pinterest.com/${contact.social.pinterest}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-700)]"
                  >
                    <Bookmark className="size-4" aria-hidden />
                    Pinterest
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
