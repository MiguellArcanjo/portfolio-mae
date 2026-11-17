"use client";

import { motion } from "motion/react";
import { Clock, MapPin, MessageCircle, Bike } from "lucide-react";
import type { Settings } from "@/lib/types";
import { waLink } from "@/lib/utils";
import { PHOTO_CREDITS } from "@/lib/photo-credits";
import { BouncyTitle, Magnetic, Reveal } from "./fx";

export function Contact({ settings, usedImages = [] }: { settings: Settings; usedImages?: string[] }) {
  const credits = PHOTO_CREDITS.filter((c) => usedImages.includes(c.image));
  const info = [
    { icon: Clock, label: "Horário", value: settings.hours },
    { icon: MapPin, label: "Onde estamos", value: settings.address },
    { icon: Bike, label: "Entrega", value: settings.deliveryNote },
  ];
  const [first, ...rest] = settings.brandName.split(" ");

  return (
    <>
      <section id="contato" className="relative scroll-mt-20 overflow-hidden bg-pepper px-5 py-28 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(45deg,#fff_0_2px,transparent_2px_26px)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            className="mx-auto mb-6 text-7xl"
            animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            🛵
          </motion.div>
          <h2 className="font-display text-6xl leading-none sm:text-8xl">
            <BouncyTitle text="Bateu a fome?" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-xl text-white/90">
              Chama a gente no WhatsApp que a gente resolve rapidinho. {settings.slogan}
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.5}>
              <a
                href={waLink(settings.whatsapp, "Olá! Vim pelo site e quero fazer um pedido 😋")}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3 rounded-full border-4 border-cocoa-900 bg-zap px-8 py-5 font-display text-3xl text-white shadow-[6px_6px_0_var(--color-cocoa-900)] transition-transform hover:scale-105"
              >
                <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-zap/50" />
                <MessageCircle size={30} />
                {settings.whatsappDisplay}
              </a>
            </Magnetic>
            {settings.instagram && (
              <Magnetic strength={0.5}>
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border-4 border-cocoa-900 bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] px-8 py-5 font-display text-3xl text-white shadow-[6px_6px_0_var(--color-cocoa-900)] transition-transform hover:scale-105"
                >
                  <InstagramIcon />@{settings.instagram}
                </a>
              </Magnetic>
            )}
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {info.map((it, i) => (
              <Reveal key={it.label} delay={i * 0.1}>
                <div className="h-full rounded-3xl border-[3px] border-cocoa-900 bg-cream p-6 text-left text-cocoa-800 shadow-[5px_5px_0_var(--color-cocoa-900)]">
                  <it.icon className="text-pepper" size={28} />
                  <p className="mt-3 text-sm font-bold uppercase tracking-wider text-cocoa-700/60">{it.label}</p>
                  <p className="mt-1 text-lg font-bold">{it.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-cocoa-900 px-5 pb-8 pt-16 text-cream">
        <div className="mx-auto max-w-6xl">
          <p className="select-none text-center font-display text-[clamp(4rem,17vw,13rem)] leading-none text-mustard-400/90">
            {first}
            {rest.length > 0 && <span className="text-pepper"> {rest.join(" ")}</span>}
          </p>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-6 text-sm text-cream/60 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {settings.brandName} · {settings.slogan}
            </p>
            <p className="font-hand text-xl text-mustard-300">feito com amor ♥</p>
          </div>
          {credits.length > 0 && (
            <details className="mt-4 text-xs text-cream/40">
              <summary className="cursor-pointer hover:text-cream/70">Créditos das fotos</summary>
              <ul className="mt-2 space-y-1">
                {credits.map((c) => (
                  <li key={c.image}>
                    <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                      “{c.title}”
                    </a>{" "}
                    — {c.author}, {c.license}, via Wikimedia Commons
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </footer>
    </>
  );
}

function InstagramIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
