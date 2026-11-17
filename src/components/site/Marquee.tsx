"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function Strip({ items, reverse, className }: { items: string[]; reverse?: boolean; className: string }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"} ${className}`}>
      {[0, 1].map((half) => (
        <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
          {doubled.map((t, i) => (
            <span key={i} className="flex items-center gap-6 px-6 font-display text-3xl sm:text-5xl">
              {t}
              <span className="text-2xl">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const skew = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const skew2 = useTransform(skew, (v) => -v * 0.8);
  if (!items.length) return null;
  return (
    <div ref={ref} className="relative z-10 -my-10 overflow-hidden py-16">
      <motion.div style={{ rotate: skew }} className="-mx-10 border-y-4 border-cocoa-900 bg-cocoa-700 py-4 text-mustard-300 [--marquee-speed:40s]">
        <Strip items={items} className="" />
      </motion.div>
      <motion.div
        style={{ rotate: skew2 }}
        className="-mx-10 -mt-6 border-y-4 border-cocoa-900 bg-pepper py-3 text-white [--marquee-speed:55s]"
      >
        <Strip items={items} reverse className="" />
      </motion.div>
    </div>
  );
}
