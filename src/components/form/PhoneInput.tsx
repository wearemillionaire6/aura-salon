"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 10);
  if (digits.length <= 3) return p1;
  if (digits.length <= 6) return `(${p1}) ${p2}`;
  return `(${p1}) ${p2}-${p3}`;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }>(
  function PhoneInput({ onChange, value, ...rest }, ref) {
    const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value);
      e.target.value = formatted;
      onChange?.(e);
    };
    return <Input ref={ref} inputMode="tel" autoComplete="tel" placeholder="(212) 555-0148" onChange={handle} value={value as string | undefined} {...rest} />;
  }
);
