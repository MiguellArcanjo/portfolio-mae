"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";
import { Reveal, SectionTag } from "./fx";

const COLORS = ["bg-white", "bg-mustard-200", "bg-cocoa-100", "bg-[#ffe1d6]"];

/** Pilha de cartões que você arrasta pro lado (estilo bilhetinhos). */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % n);
    }, 5000);
    return () => clearInterval(t);
  }, [paused, n]);

  if (!n) return null;

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + n) % n);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) go(info.offset.x < 0 ? 1 : -1);
  };

  const stack = [0, 1, 2].slice(0, Math.min(3, n)).map((k) => items[(index + k) % n]);

  return (
    <section id="depoimentos" className="relative scroll-mt-20 overflow-hidden bg-mustard-400 px-5 py-28">
      <div className="dots absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="text-center lg:text-left">
          <Reveal>
            <SectionTag>💬 Depoimentos</SectionTag>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-5xl leading-[1.05] text-cocoa-700 sm:text-7xl">
              Quem prova,
              <br />
              <span className="text-white logo-shadow">aprova!</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 font-hand text-3xl text-cocoa-700">arraste os bilhetinhos →</p>
          </Reveal>
          <div className="mt-6 flex justify-center gap-3 lg:justify-start">
            <button onClick={() => go(-1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-cocoa-700 bg-cream text-cocoa-700 shadow-[3px_3px_0_var(--color-cocoa-700)] transition-transform hover:-translate-x-1" aria-label="Anterior">
              <ChevronLeft />
            </button>
            <button onClick={() => go(1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-cocoa-700 bg-cocoa-700 text-cream shadow-[3px_3px_0_var(--color-cocoa-900)] transition-transform hover:translate-x-1" aria-label="Próximo">
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          className="relative mx-auto h-[22rem] w-full max-w-md"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <AnimatePresence initial={false} custom={dir}>
            {stack
              .map((t, k) => (
                <motion.figure
                  key={t.id + "-" + ((index + k) % n)}
                  custom={dir}
                  className={`absolute inset-0 flex cursor-grab flex-col justify-between rounded-[2rem] border-[3px] border-cocoa-700 p-8 shadow-[8px_8px_0_var(--color-cocoa-700)] active:cursor-grabbing ${COLORS[((index + k) % n) % COLORS.length]}`}
                  style={{ zIndex: 10 - k }}
                  initial={{ scale: 0.85, y: 40, opacity: 0, rotate: 0 }}
                  animate={{ scale: 1 - k * 0.05, y: k * 22, opacity: 1, rotate: k === 0 ? -2 : k % 2 ? 4 : -5 }}
                  exit={{ x: dir > 0 ? -420 : 420, rotate: dir > 0 ? -25 : 25, opacity: 0, transition: { duration: 0.45 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  drag={k === 0 ? "x" : false}
                  dragSnapToOrigin
                  onDragEnd={onDragEnd}
                  whileDrag={{ scale: 1.04, rotate: 0 }}
                >
                  <span className="absolute -top-6 left-1/2 h-10 w-24 -translate-x-1/2 rotate-3 bg-white/60 shadow-sm backdrop-blur-sm" />
                  <div className="flex gap-1 text-mustard-600">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={22} fill={s < t.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <blockquote className="font-hand text-3xl leading-snug text-cocoa-800">“{t.text}”</blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa-700 font-display text-xl text-cream">
                      {t.name.charAt(0)}
                    </span>
                    <span className="font-bold text-cocoa-700">{t.name}</span>
                  </figcaption>
                </motion.figure>
              ))
              .reverse()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
