"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Settings } from "@/lib/types";
import { Counter, Reveal, SectionTag, Squiggle } from "./fx";

export function About({ settings }: { settings: Settings }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const stickerRotate = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const paragraphs = settings.aboutText.split(/\n+/).filter(Boolean);

  return (
    <section id="sobre" ref={ref} className="relative scroll-mt-20 overflow-hidden px-5 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md">
          <motion.div style={{ y: imgY }} className="relative">
            <div className="absolute -inset-4 rotate-6 rounded-[3rem] bg-pepper" />
            <div className="absolute -inset-4 -rotate-3 rounded-[3rem] bg-mustard-400" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-cocoa-700 bg-cream shadow-2xl">
              {settings.aboutImage ? (
                <img src={settings.aboutImage} alt={settings.brandName} className="h-full w-full object-cover" />
              ) : (
                <div className="tiles grid h-full w-full place-items-center">
                  <div className="text-center">
                    <span className="block text-[9rem] leading-none drop-shadow-xl">👩‍🍳</span>
                    <span className="mt-4 block font-display text-4xl text-cocoa-700">{settings.brandName}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          {/* lousinha */}
          <motion.div
            style={{ rotate: stickerRotate }}
            className="absolute -bottom-8 -right-4 rounded-2xl border-[6px] border-[#8a5a2b] bg-[#2f3b2f] px-5 py-3 font-hand text-3xl leading-tight text-white shadow-xl sm:-right-10"
          >
            Feito
            <br />
            com amor!
          </motion.div>
        </div>

        <div>
          <Reveal>
            <SectionTag>💛 Nossa história</SectionTag>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="relative mt-5 font-display text-5xl leading-[1.05] text-cocoa-700 sm:text-6xl">
              {settings.aboutTitle}
              <Squiggle className="mt-2 h-4 w-48 text-pepper" />
            </h2>
          </Reveal>
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.15 + i * 0.1}>
              <p className="mt-5 text-lg leading-relaxed text-cocoa-700/85">{p}</p>
            </Reveal>
          ))}

          {settings.stats.length > 0 && (
            <div className="mt-10 grid grid-cols-3 gap-3">
              {settings.stats.map((s, i) => (
                <Reveal key={i} delay={0.2 + i * 0.1}>
                  <div className="rounded-3xl border-[3px] border-cocoa-700 bg-white p-4 text-center shadow-[4px_4px_0_var(--color-cocoa-700)]">
                    <Counter value={s.value} suffix={s.suffix} className="block font-display text-3xl text-pepper sm:text-4xl" />
                    <span className="text-xs font-bold uppercase tracking-wide text-cocoa-700/70 sm:text-sm">{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
