"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { MessageCircle, Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { cn, waLink } from "@/lib/utils";
import { useCart } from "./cart";
import { BouncyTitle, Reveal, SectionTag, Squiggle, Tilt } from "./fx";
import { ProductVisual } from "./ProductVisual";

export function Menu({ categories, products, whatsapp }: { categories: Category[]; products: Product[]; whatsapp: string }) {
  const [active, setActive] = useState<string>("todos");
  const usedCats = useMemo(
    () => categories.filter((c) => products.some((p) => p.categoryId === c.id)),
    [categories, products],
  );
  const visible = useMemo(
    () => (active === "todos" ? products : products.filter((p) => p.categoryId === active)),
    [active, products],
  );

  return (
    <section id="cardapio" className="dots relative scroll-mt-20 px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Reveal>
            <SectionTag>🍽️ Cardápio</SectionTag>
          </Reveal>
          <h2 className="relative mx-auto mt-5 inline-block font-display text-5xl text-cocoa-700 sm:text-7xl">
            <BouncyTitle text="Escolha sua delícia" />
            <Squiggle className="absolute -bottom-4 left-0 h-5 w-full text-mustard-500" />
          </h2>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-xl text-lg text-cocoa-700/80">
              Toque em <b>adicionar</b>, monte sua sacola e envie o pedido direto no nosso WhatsApp. Simples assim!
            </p>
          </Reveal>
        </div>

        {/* filtros */}
        <LayoutGroup>
          <div className="no-scrollbar -mx-5 mt-10 flex gap-3 overflow-x-auto px-5 pb-3 sm:flex-wrap sm:justify-center">
            {[{ id: "todos", name: "Tudo", emoji: "✨", order: 0 }, ...usedCats].map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "relative shrink-0 rounded-full border-2 border-cocoa-700 px-5 py-2.5 font-bold transition-colors",
                  active === c.id ? "text-cream" : "bg-white text-cocoa-700 hover:bg-mustard-100",
                )}
              >
                {active === c.id && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 rounded-full bg-cocoa-700 shadow-[3px_3px_0_var(--color-pepper)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <span className={cn("transition-transform", active === c.id && "animate-wiggle")}>{c.emoji}</span>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <motion.div layout className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: Math.min(i, 8) * 0.04 }}
              >
                <ProductCard product={p} category={categories.find((c) => c.id === p.categoryId)} whatsapp={whatsapp} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && <p className="mt-10 text-center text-cocoa-700/70">Nada por aqui ainda 🙈</p>}
      </div>
    </section>
  );
}

export function ProductCard({ product: p, category, whatsapp }: { product: Product; category?: Category; whatsapp: string }) {
  const { add } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(false);

  return (
    <Tilt className="h-full rounded-[2rem]">
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[2rem] border-[3px] border-cocoa-700 bg-white shadow-[6px_6px_0_var(--color-cocoa-700)] transition-shadow duration-300 hover:shadow-[10px_12px_0_var(--color-cocoa-700)]",
          !p.available && "opacity-70 grayscale-[.6]",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-cocoa-700">
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-2">
            <ProductVisual image={p.image} emoji={p.emoji} alt={p.name} emojiClassName="transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" />
          </div>
          {p.badge && (
            <span className="absolute left-4 top-4 -rotate-6 rounded-lg border-2 border-cocoa-800 bg-pepper px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-white shadow-[2px_2px_0_var(--color-cocoa-800)]">
              {p.badge}
            </span>
          )}
          {category && (
            <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-cocoa-700 backdrop-blur">
              {category.emoji} {category.name}
            </span>
          )}
          {!p.available && (
            <div className="absolute inset-0 grid place-items-center bg-cocoa-900/40">
              <span className="-rotate-12 rounded-xl border-4 border-white px-4 py-1 font-display text-3xl text-white">Esgotado</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 [transform:translateZ(30px)]">
          <h3 className="font-display text-3xl leading-tight text-cocoa-700">{p.name}</h3>
          <p className="mt-2 flex-1 text-cocoa-700/75">{p.description}</p>
          {p.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-mustard-100 px-2.5 py-0.5 text-xs font-bold text-cocoa-700">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex items-center justify-between gap-3">
            <a
              href={waLink(whatsapp, `Olá! Qual o valor do(a) ${p.name}? 😋`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-cocoa-700 underline decoration-mustard-400 decoration-2 underline-offset-4 transition-colors hover:text-pepper"
            >
              <MessageCircle size={16} className="text-zap" /> Consultar valor
            </a>
            <motion.button
              ref={btnRef}
              disabled={!p.available}
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                add(p, btnRef.current);
                setAdded(true);
                setTimeout(() => setAdded(false), 1200);
              }}
              className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border-2 border-cocoa-800 bg-mustard-400 px-5 py-2.5 font-bold text-cocoa-800 shadow-[3px_3px_0_var(--color-cocoa-800)] transition-all hover:-translate-y-0.5 hover:bg-mustard-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span key="ok" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                    Na sacola! 😋
                  </motion.span>
                ) : (
                  <motion.span key="add" className="flex items-center gap-1.5" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                    <Plus size={18} strokeWidth={3} /> Adicionar
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </article>
    </Tilt>
  );
}
