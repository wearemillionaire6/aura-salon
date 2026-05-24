"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function FadeUp({
  delay = 0,
  duration = 0.5,
  y = 16,
  once = true,
  className,
  children,
  as = "div",
}: {
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const Component = motion[as as "div"] as React.ComponentType<React.ComponentProps<typeof motion.div>>;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      variants={{ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}
