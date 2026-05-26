"use client";

import * as React from "react";
import { motion, type Variant } from "motion/react";

export function FadeUp({
  delay = 0,
  duration = 0.5,
  y = 16,
  once = true,
  blur = false,
  scale: scaleAnim = false,
  className,
  children,
}: {
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  blur?: boolean;
  scale?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const hidden: Variant = {
    opacity: 0,
    y,
    ...(blur && { filter: "blur(8px)" }),
    ...(scaleAnim && { scale: 0.95 }),
  };

  const visible: Variant = {
    opacity: 1,
    y: 0,
    ...(blur && { filter: "blur(0px)" }),
    ...(scaleAnim && { scale: 1 }),
  };

  return (
    <motion.div
      variants={{ hidden, visible }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
