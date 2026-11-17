"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Plus } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { waLink } from "@/lib/utils";
import { useCart } from "./cart";
import { ProductVisual } from "./ProductVisual";

const BG = ["bg-pepper", "bg-cocoa-700", "bg-mustard-500", "bg-zap", "bg-cocoa-500"];

/** Seção "fixa" onde o scroll vertical move os destaques na horizontal. */
export function Featured({ products, whatsapp }: { products: Product[]; whatsapp: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { add } = useCart();

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);

  if (!products.length) return null;

  return (
    <section
      id="destaques"
      ref={sectionRef}
      className="relative bg-cocoa-800 text-cream"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#ffc21a_2px,transparent_2px)] [background-size:30px_30px]" />
        <div className="relative mx-auto mb-8 flex w-full max-w-6xl items-end justify-between gap-6 px-5">
          <div>
            <span className="font-hand text-3xl text-mustard-300">os queridinhos da casa</span>
            <h2 className="font-display text-5xl leading-none sm:text-7xl">
              Destaques <span className="inline-block animate-wiggle">🔥</span>
            </h2>
          </div>
          <div className="hidden w-48 sm:block">
            <p className="mb-2 text-right text-sm text-cream/60">role para ver mais →</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream/15">
              <motion.div className="h-full rounded-full bg-mustard-400" style={{ width: bar }} />
            </div>
          </div>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-8 px-5 sm:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
          {products.map((p, i) => (
            <motion.article
              key={p.id}
              className={`group relative flex h-[min(62vh,30rem)] w-[min(82vw,26rem)] shrink-0 flex-col overflow-hidden rounded-[2.5rem] border-4 border-cream/90 ${BG[i % BG.length]} shadow-2xl`}
              whileHover={{ y: -12, rotate: i % 2 ? 1.5 : -1.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <span className="absolute -right-4 -top-10 font-display text-[11rem] leading-none text-white/10">{String(i + 1).padStart(2, "0")}</span>
              <div className="relative m-4 flex-1 overflow-hidden rounded-[2rem] border-4 border-cream/80">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                  <ProductVisual image={p.image} emoji={p.emoji} alt={p.name} emojiClassName="text-8xl group-hover:animate-wiggle" />
                </div>
              </div>
              <div className="relative flex items-end justify-between gap-3 px-6 pb-6">
                <div>
                  {p.badge && <span className="font-hand text-2xl text-mustard-200">{p.badge}</span>}
                  <h3 className="font-display text-3xl leading-tight text-white">{p.name}</h3>
                  <a
                    href={waLink(whatsapp, `Olá! Qual o valor do(a) ${p.name}? 😋`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block rounded-full bg-cocoa-900/45 px-3 py-0.5 text-sm font-bold text-mustard-200 transition-colors hover:bg-cocoa-900/70"
                  >
                    Consultar valor →
                  </a>
                </div>
                <button
                  onClick={(e) => add(p, e.currentTarget)}
                  disabled={!p.available}
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-cocoa-900 bg-cream text-cocoa-800 shadow-[3px_3px_0_var(--color-cocoa-900)] transition-transform hover:rotate-90 hover:scale-110 disabled:opacity-40"
                  aria-label={`Adicionar ${p.name}`}
                >
                  <Plus strokeWidth={3} />
                </button>
              </div>
            </motion.article>
          ))}
          <div className="flex w-[min(70vw,22rem)] shrink-0 flex-col items-center justify-center text-center">
            <span className="text-7xl">😋</span>
            <p className="mt-4 font-display text-4xl">Deu água na boca?</p>
            <a href="#cardapio" className="mt-4 rounded-full bg-mustard-400 px-6 py-3 font-bold text-cocoa-800 transition-transform hover:scale-105">
              Ver cardápio completo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
