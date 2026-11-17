"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useState } from "react";
import { waLink } from "@/lib/utils";
import { useCart } from "./cart";

export function FloatingButtons({ whatsapp }: { whatsapp: string }) {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const { count, setOpen } = useCart();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 600));

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-cocoa-700 bg-cream text-cocoa-700 shadow-[3px_3px_0_var(--color-cocoa-700)]"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {count > 0 && show && (
          <motion.button
            initial={{ x: 120 }}
            animate={{ x: 0 }}
            exit={{ x: 160 }}
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-full border-2 border-cocoa-800 bg-mustard-400 py-2 pl-4 pr-2 font-bold text-cocoa-800 shadow-[4px_4px_0_var(--color-cocoa-800)]"
          >
            Ver sacola
            <span className="rounded-full bg-cocoa-700 px-3 py-1 text-sm text-cream">
              {count} {count === 1 ? "item" : "itens"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={waLink(whatsapp, "Olá! Vim pelo site 😋")}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid h-16 w-16 place-items-center rounded-full border-2 border-cocoa-800 bg-zap text-white shadow-[4px_4px_0_var(--color-cocoa-800)] transition-transform hover:scale-110"
        aria-label="Falar no WhatsApp"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-zap opacity-40" />
        <MessageCircle size={30} className="relative transition-transform group-hover:rotate-12" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-cocoa-800 px-3 py-1.5 text-sm font-bold opacity-0 transition-opacity group-hover:opacity-100">
          Peça pelo WhatsApp!
        </span>
      </a>
    </div>
  );
}
