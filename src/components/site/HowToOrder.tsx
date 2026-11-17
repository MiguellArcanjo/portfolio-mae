"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { BouncyTitle, Reveal, SectionTag } from "./fx";

const STEPS = [
  { emoji: "📋", title: "Escolha", text: "Navegue pelo cardápio e adicione suas delícias na sacola." },
  { emoji: "📲", title: "Envie", text: "Finalize e mande o pedido pronto direto no nosso WhatsApp." },
  { emoji: "🛵", title: "Receba", text: "Preparamos na hora e levamos quentinho até você!" },
];

export function HowToOrder() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });

  return (
    <section className="tiles relative overflow-hidden px-5 py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream" />
      <div className="relative mx-auto max-w-6xl text-center">
        <Reveal>
          <SectionTag>🛵 Como pedir</SectionTag>
        </Reveal>
        <h2 className="mt-5 font-display text-5xl text-cocoa-700 sm:text-7xl">
          <BouncyTitle text="Fácil que nem" /> <span className="text-pepper"><BouncyTitle text="pudim!" delay={0.4} /></span>
        </h2>

        <div ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-3">
          {/* caminho tracejado que se desenha */}
          <svg className="absolute left-0 top-12 hidden h-24 w-full md:block" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
            <path d="M160 50 C 300 -10, 360 110, 500 50 S 700 -10, 840 50" stroke="rgba(90,26,14,.15)" strokeWidth="5" fill="none" strokeDasharray="12 12" />
            <motion.path
              d="M160 50 C 300 -10, 360 110, 500 50 S 700 -10, 840 50"
              stroke="var(--color-pepper)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.15}>
              <div className="relative flex flex-col items-center">
                <motion.div
                  whileHover={{ rotate: [0, -12, 12, 0], scale: 1.1 }}
                  className="relative grid h-24 w-24 place-items-center rounded-full border-4 border-cocoa-700 bg-white text-5xl shadow-[5px_5px_0_var(--color-cocoa-700)]"
                >
                  {s.emoji}
                  <span className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full border-2 border-cocoa-800 bg-pepper font-display text-lg text-white">
                    {i + 1}
                  </span>
                </motion.div>
                <h3 className="mt-6 font-display text-4xl text-cocoa-700">{s.title}</h3>
                <p className="mt-2 max-w-xs rounded-2xl bg-cream/80 px-3 py-1 text-cocoa-700/80">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
