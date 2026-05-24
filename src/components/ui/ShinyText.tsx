import * as React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  disabled?: boolean;
  speed?: string; // e.g. "5s"
  className?: string;
  children: React.ReactNode;
}

export function ShinyText({
  disabled = false,
  speed = "5s",
  className,
  children,
  ...props
}: ShinyTextProps) {
  if (disabled) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-block bg-[linear-gradient(120deg,var(--color-ink-900)_30%,var(--color-terracotta-500)_50%,var(--color-ink-900)_70%)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shiny",
        className
      )}
      style={{ animationDuration: speed }}
      {...props}
    >
      {children}
    </span>
  );
}
