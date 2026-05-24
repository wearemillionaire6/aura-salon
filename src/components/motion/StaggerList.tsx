"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";

const parent: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const child: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function StaggerList({ className, children }: { className?: string; children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={parent}
      className={className}
    >
      {items.map((c, i) => (
        <motion.div key={i} variants={child}>
          {c}
        </motion.div>
      ))}
    </motion.div>
  );
}
