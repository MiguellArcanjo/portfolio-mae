"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "./cart";

const LINKS = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#destaques", label: "Destaques" },
  { href: "#sobre", label: "Sobre" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contato", label: "Contato" },
];

export function Navbar({ brand, avatar, hideLinks = [] }: { brand: string; avatar?: string; hideLinks?: string[] }) {
  const links = LINKS.filter((l) => !hideLinks.includes(l.href));
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { count, setOpen, cartButtonRef, bump } = useCart();
  const [first, ...rest] = brand.split(" ");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 500 && y > prev && !mobile);
  });

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <nav
          className={cn(
            "relative mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500 sm:px-6",
            scrolled
              ? "border-2 border-cocoa-700 bg-cream/85 shadow-[4px_4px_0_var(--color-cocoa-700)] backdrop-blur-md"
              : "border-2 border-transparent",
          )}
        >
          <a href="#topo" className="group flex items-center gap-2 font-display text-2xl text-cocoa-700 sm:text-3xl">
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-10 w-10 rounded-full border-2 border-cocoa-700 object-cover shadow-[2px_2px_0_var(--color-cocoa-700)] transition-transform group-hover:rotate-12" />
            )}
            <span className="flex items-baseline gap-1">
              <span className="transition-transform group-hover:-rotate-6">{first}</span>
            {rest.length > 0 && <span className="text-lg text-pepper sm:text-xl">{rest.join(" ")}</span>}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative rounded-full px-4 py-2 font-semibold text-cocoa-700 transition-colors hover:text-cocoa-900"
                >
                  <span className="absolute inset-0 scale-50 rounded-full bg-mustard-300 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <motion.button
              ref={cartButtonRef}
              key={bump}
              onClick={() => setOpen(true)}
              className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-cocoa-700 bg-mustard-400 text-cocoa-800 shadow-[3px_3px_0_var(--color-cocoa-700)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
              animate={bump ? { scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, -12, 10, -4, 0] } : undefined}
              transition={{ duration: 0.5 }}
              aria-label={`Abrir sacola (${count} itens)`}
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full border-2 border-cream bg-pepper px-1 text-xs font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button
              onClick={() => setMobile(true)}
              className="grid h-11 w-11 place-items-center rounded-full border-2 border-cocoa-700 bg-white text-cocoa-800 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
          </div>
          {/* progresso da leitura, dentro da pílula e cortado pelas bordas arredondadas */}
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden>
            <motion.span
              className="absolute inset-x-0 bottom-0 block h-[3px] origin-left bg-pepper transition-opacity duration-500"
              style={{ scaleX: scrollYProgress, opacity: scrolled ? 1 : 0 }}
            />
          </span>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-cocoa-700 p-6 text-cream md:hidden"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl text-mustard-400">{brand}</span>
              <button onClick={() => setMobile(false)} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-cocoa-800" aria-label="Fechar menu">
                <X />
              </button>
            </div>
            <ul className="mt-12 flex flex-col gap-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                >
                  <a href={l.href} onClick={() => setMobile(false)} className="font-display text-5xl hover:text-mustard-400">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto font-hand text-2xl text-mustard-300">feito com amor ♥</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
