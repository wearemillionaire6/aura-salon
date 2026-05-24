import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h2" | "h3";
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
          {eyebrow}
        </p>
      ) : null}
      <Tag className="font-display text-3xl leading-tight text-[var(--color-ink-900)] sm:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {subtitle ? (
        <p
          className={cn(
            "text-base text-[var(--color-ink-500)] sm:text-lg",
            align === "center" ? "max-w-2xl" : "max-w-2xl",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
