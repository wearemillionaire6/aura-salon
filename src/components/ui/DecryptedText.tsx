"use client";

import * as React from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number; // ms per letter reveal
  delay?: number; // ms delay before starting
  className?: string;
  useInView?: boolean;
}

export function DecryptedText({
  text,
  speed = 35,
  delay = 150,
  className,
  useInView = true,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = React.useState("");
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Curated elegant character set for shifting letters
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const triggerReveal = React.useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    let currentLetterIdx = 0;
    const totalLength = text.length;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < currentLetterIdx) {
              return text[index];
            }
            // Scramble active and future letters
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("");
      });

      if (currentLetterIdx >= totalLength) {
        clearInterval(interval);
        setDisplayText(text);
      }
      
      currentLetterIdx += 1;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, characters, hasAnimated]);

  React.useEffect(() => {
    if (!useInView) {
      const timeout = setTimeout(triggerReveal, delay);
      return () => clearTimeout(timeout);
    }
  }, [useInView, delay, triggerReveal]);

  React.useEffect(() => {
    if (useInView && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(triggerReveal, delay);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [useInView, delay, triggerReveal]);

  return (
    <span ref={containerRef} className={className}>
      {displayText || text}
    </span>
  );
}
