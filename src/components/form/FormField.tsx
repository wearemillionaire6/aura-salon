"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({
  id,
  label,
  description,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactElement;
}) {
  // Inject id + aria-* into the child
  const child = React.cloneElement(children, {
    id,
    "aria-invalid": !!error,
    "aria-describedby": [description ? `${id}-desc` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-[var(--color-ink-900)]">
        {label} {required ? <span aria-hidden className="text-[var(--color-terracotta-500)]">*</span> : null}
      </Label>
      {description ? (
        <p id={`${id}-desc`} className="text-xs text-[var(--color-ink-500)]">{description}</p>
      ) : null}
      {child}
      {error ? (
        <p id={`${id}-err`} role="alert" className="text-xs text-[var(--color-destructive,#B43E2E)]">{error}</p>
      ) : null}
    </div>
  );
}
