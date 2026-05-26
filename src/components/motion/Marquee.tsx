"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  gap?: string;
}

export function Marquee({
  children,
  className,
  speed = 30,
  pauseOnHover = true,
  direction = "left",
  gap = "2rem",
}: MarqueeProps) {
  return (
    <div
      className={cn("marquee-container", className)}
      style={
        {
          "--marquee-speed": `${speed}s`,
          "--marquee-gap": gap,
        } as React.CSSProperties
      }
    >
      <div
        className="marquee-content"
        style={{
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
      <div
        className="marquee-content"
        aria-hidden="true"
        style={{
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
    </div>
  );
}
