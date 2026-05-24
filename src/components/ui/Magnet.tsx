"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagnetProps {
  children: React.ReactNode;
  strength?: number; // range: 5 to 50
  className?: string;
  disabled?: boolean;
}

export function Magnet({ children, strength = 20, className, disabled = false }: MagnetProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft spring config for luxury feel
  const springConfig = { damping: 18, stiffness: 120, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Get mouse offset from center of element
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const offsetX = (clientX - centerX) / (width / 2);
    const offsetY = (clientY - centerY) / (height / 2);

    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={disabled ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
