"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion, type MotionValue, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product, Settings } from "@/lib/types";
import { waLink } from "@/lib/utils";
import { BouncyTitle, Magnetic } from "./fx";

const FLOATERS = [
  { e: "🥖", x: "6%", y: "18%", d: 1.2, s: "text-5xl" },
  { e: "🍩", x: "88%", y: "14%", d: 0.6, s: "text-4xl" },
  { e: "🍮", x: "80%", y: "78%", d: 1.6, s: "text-5xl" },
  { e: "🍰", x: "12%", y: "80%", d: 0.9, s: "text-4xl" },
  { e: "🌭", x: "46%", y: "8%", d: 0.4, s: "text-3xl" },
  { e: "🧀", x: "54%", y: "90%", d: 1.1, s: "text-3xl" },
];

export function Hero({ settings, plateProducts }: { settings: Settings; plateProducts: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const plateRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  // parallax pelo mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 15 });
  const sy = useSpring(my, { stiffness: 60, damping: 15 });
  const plateX = useTransform(sx, (v) => v * -20);
  const plateY = useTransform(sy, (v) => v * -20);
  const heroPhoto = settings.heroImage || plateProducts.find((p) => p.image)?.image;

  // palavra que gira
  const words = settings.rotatingWords.length ? settings.rotatingWords : ["delícias"];
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWi((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);

  // trilha de confeitos que segue o mouse
  const [sprinkles, setSprinkles] = useState<{ id: number; x: number; y: number; c: string; r: number }[]>([]);
  const last = useRef(0);
  const COLORS = ["#d62828", "#5a1a0e", "#ffffff", "#25d366", "#f28c00"];

  const [first, ...rest] = settings.brandName.split(" ");

  return (
    <section
      id="topo"
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-mustard-400 pb-20 pt-28"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
        const now = performance.now();
        if (now - last.current > 45) {
          last.current = now;
          const id = now;
          setSprinkles((s) => [
            ...s.slice(-18),
            { id, x: e.clientX - r.left, y: e.clientY - r.top, c: COLORS[Math.floor(Math.random() * COLORS.length)], r: Math.random() * 180 },
          ]);
        }
      }}
    >
      {/* fundo */}
      <div className="tiles absolute inset-0 -z-20 opacity-60" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(242,140,0,.55)_100%)]" />
      <div className="absolute -left-32 top-1/3 -z-10 h-96 w-96 animate-blob bg-mustard-200/70 blur-2xl" />
      <div className="absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] animate-blob bg-pepper/20 blur-3xl [animation-delay:-5s]" />

      {/* confeitos */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <AnimatePresence>
          {sprinkles.map((s) => (
            <motion.span
              key={s.id}
              className="absolute h-1.5 w-4 rounded-full"
              style={{ left: s.x, top: s.y, background: s.c, rotate: s.r }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, y: 90, scale: 0.3, rotate: s.r + 180 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeIn" }}
              onAnimationComplete={() => setSprinkles((all) => all.filter((x) => x.id !== s.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* comidas flutuando */}
      {FLOATERS.map((f, i) => (
        <Floater key={i} f={f} i={i} sx={sx} sy={sy} />
      ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.1fr_1fr]"
      >
        {/* texto */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-cocoa-700 bg-cream px-4 py-1.5 text-sm font-bold text-cocoa-700 shadow-[3px_3px_0_var(--color-cocoa-700)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zap opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-zap" />
            </span>
            {settings.hours}
          </motion.span>

          <h1 className="mt-6 font-display leading-[0.9]">
            <span className="block text-[clamp(4rem,13vw,9.5rem)] text-white logo-shadow">
              <BouncyTitle text={first} delay={1.9} />
            </span>
            {rest.length > 0 && (
              <motion.span
                className="relative -mt-2 inline-block -rotate-3 rounded-2xl border-4 border-cocoa-800 bg-cocoa-700 px-6 pb-2 pt-1 text-[clamp(2.2rem,6vw,4.2rem)] text-white shadow-[6px_6px_0_var(--color-pepper)]"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: -3 }}
                transition={{ delay: 2.3, type: "spring", stiffness: 200, damping: 10 }}
              >
                {rest.join(" ")}
                <span className="absolute -right-5 -top-6 text-4xl">👩‍🍳</span>
              </motion.span>
            )}
          </h1>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 text-2xl font-bold text-cocoa-800 sm:text-3xl lg:justify-start">
            <span>Hoje tem</span>
            <span className="relative inline-flex h-[1.5em] min-w-[9ch] overflow-hidden rounded-xl bg-cream px-3 text-pepper shadow-[inset_0_-4px_0_rgba(90,26,14,.15)]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={wi}
                  className="block whitespace-nowrap leading-[1.5em]"
                  initial={{ y: "100%", rotateX: -90 }}
                  animate={{ y: 0, rotateX: 0 }}
                  exit={{ y: "-100%", rotateX: 90 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  {words[wi]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <motion.p
            className="mx-auto mt-5 max-w-lg text-lg font-medium text-cocoa-800/90 lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            <Magnetic>
              <a
                href="#cardapio"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-cocoa-800 bg-cocoa-700 px-7 py-4 text-lg font-bold text-cream shadow-[5px_5px_0_var(--color-cocoa-900)] transition-all hover:-translate-y-1 hover:shadow-[7px_8px_0_var(--color-cocoa-900)] active:translate-y-1 active:shadow-none"
              >
                <Sparkles size={20} className="transition-transform group-hover:rotate-180" />
                Ver cardápio
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={waLink(settings.whatsapp, "Olá! Vim pelo site e quero fazer um pedido 😋")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-cocoa-800 bg-zap px-7 py-4 text-lg font-bold text-white shadow-[5px_5px_0_var(--color-cocoa-900)] transition-all hover:-translate-y-1 hover:shadow-[7px_8px_0_var(--color-cocoa-900)] active:translate-y-1 active:shadow-none"
              >
                <MessageCircle size={20} />
                {settings.whatsappDisplay}
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* prato */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[30rem]"
          style={{ scale: plateScale, rotate: plateRotate }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          {/* texto circular */}
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full animate-spin-slow">
            <defs>
              <path id="circle" d="M150,150 m-132,0 a132,132 0 1,1 264,0 a132,132 0 1,1 -264,0" />
            </defs>
            <text className="fill-cocoa-700 font-sans text-[17px] font-extrabold uppercase tracking-[0.32em]">
              <textPath href="#circle">• feito com amor • sabor da tradição • delivery rápido </textPath>
            </text>
          </svg>
          <motion.div
            className="absolute inset-[13%] overflow-hidden rounded-full border-[10px] border-white bg-white shadow-[0_30px_60px_-10px_rgba(90,26,14,.55),inset_0_0_0_6px_rgba(242,140,0,.3)]"
            style={{ x: plateX, y: plateY }}
          >
            {heroPhoto ? (
              <img src={heroPhoto} alt={settings.brandName} className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full bg-[radial-gradient(circle,#fff_55%,#ffe08a_100%)]">
                {plateProducts.slice(0, 5).map((p, i, arr) => {
                  const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <span
                      key={p.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 text-[clamp(2.5rem,8vw,4.5rem)] drop-shadow-[0_8px_8px_rgba(90,26,14,.3)]"
                      style={{ left: `${50 + Math.cos(angle) * 27}%`, top: `${50 + Math.sin(angle) * 27}%` }}
                    >
                      {p.emoji}
                    </span>
                  );
                })}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-3xl text-pepper">♥</span>
              </div>
            )}
          </motion.div>
          {/* vapor */}
          <div className="pointer-events-none absolute left-1/2 top-[6%] flex -translate-x-1/2 gap-5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-16 w-3 animate-steam rounded-full bg-white/80 blur-[6px]"
                style={{ animationDelay: `${i * 0.7}s` }}
              />
            ))}
          </div>
          {/* selo */}
          <motion.div
            className="absolute -bottom-2 right-2 grid h-28 w-28 place-items-center rounded-full border-4 border-cocoa-800 bg-pepper text-center font-display text-lg leading-tight text-white shadow-xl sm:right-6"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ delay: 2.7, type: "spring", stiffness: 200 }}
            whileHover={{ rotate: -8, scale: 1.1 }}
          >
            <span>
              Feito
              <br />
              com amor!
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#cardapio"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-hand text-xl text-cocoa-700"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        bateu a fome?
        <ArrowDown size={22} />
      </motion.a>
    </section>
  );
}

function Floater({ f, i, sx, sy }: { f: (typeof FLOATERS)[number]; i: number; sx: MotionValue<number>; sy: MotionValue<number> }) {
  const x = useTransform(sx, (v) => v * 80 * f.d);
  const y = useTransform(sy, (v) => v * 80 * f.d);
  return (
    <motion.div
      className={`pointer-events-none absolute hidden select-none sm:block ${f.s}`}
      style={{ left: f.x, top: f.y, x, y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.8 + i * 0.1, type: "spring" }}
    >
      <span className="block animate-float drop-shadow-[0_10px_8px_rgba(90,26,14,.3)]" style={{ animationDelay: `${i * -1.1}s` }}>
        {f.e}
      </span>
    </motion.div>
  );
}
