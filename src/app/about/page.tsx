import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FadeUp, StaggerList } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { about } from "@/content";
import { stylists } from "@/data";

export const metadata = { title: "About" };

export default function AboutPage() {
  const teamPreview = stylists.slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        headline={about.hero.headline}
      />

      {/* Our story */}
      <section className="py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader eyebrow="Our story" title="A salon built around the work." />
          </FadeUp>
          <div className="mt-10 max-w-2xl">
            <StaggerList className="flex flex-col gap-6">
              {about.story.map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-[var(--color-ink-700)] sm:text-lg"
                >
                  {para}
                </p>
              ))}
            </StaggerList>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bone-100)] py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="Values"
              title="What we hold the line on."
            />
          </FadeUp>
          <StaggerList className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <Card key={v.title} className="bg-[var(--color-bone-50)]">
                <CardContent className="flex flex-col gap-3 px-6 py-6">
                  <h3 className="font-display text-xl text-[var(--color-ink-900)]">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-500)]">{v.blurb}</p>
                </CardContent>
              </Card>
            ))}
          </StaggerList>
        </Container>
      </section>

      {/* Team preview */}
      <section className="py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="The team"
              title="A few of the people you'll meet."
            />
          </FadeUp>
          <StaggerList className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamPreview.map((sty) => (
              <Link
                key={sty.id}
                href={`/team/${sty.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[var(--color-bone-200)]">
                  <Image
                    src={sty.avatarUrl}
                    alt={sty.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-lg text-[var(--color-ink-900)]">
                    {sty.name}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                    {sty.title}
                  </p>
                </div>
              </Link>
            ))}
          </StaggerList>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/team">Meet everyone</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Credentials */}
      <section className="border-t border-[var(--color-border)] py-20 sm:py-28">
        <Container>
          <FadeUp>
            <SectionHeader
              eyebrow="Credentials"
              title="A few of the names we work with."
            />
          </FadeUp>
          <ul className="mt-10 flex flex-col">
            {about.credentials.map((line, i) => (
              <li
                key={i}
                className="border-b border-[var(--color-mist-200)] py-4 text-sm text-[var(--color-ink-500)] last:border-b-0 sm:text-base"
              >
                {line}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
