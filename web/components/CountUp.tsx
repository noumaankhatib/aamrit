"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUp({
  to,
  duration = 1600,
  format = (n) => (n >= 1000 ? n.toLocaleString("en-IN") : String(n)),
  className,
}: Props) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              setValue(Math.round(easeOut(t) * to));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
