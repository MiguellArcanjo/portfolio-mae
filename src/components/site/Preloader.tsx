"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function Preloader({ brand }: { brand: string }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("bd-intro") === "1";
      sessionStorage.setItem("bd-intro", "1");
    } catch {}
    const t = setTimeout(() => setShow(false), seen ? 350 : 1900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = show ? "hidden" : "";
  }, [show]);

  const [first, ...rest] = brand.split(" ");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-mustard-400"
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="tiles absolute inset-0 opacity-70" />
          <div className="relative flex flex-col items-center">
            <motion.div
              className="text-7xl"
              initial={{ y: -200, rotate: -30 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 11 }}
            >
              🍮
            </motion.div>
            <div className="font-display text-6xl text-white logo-shadow sm:text-8xl">
              {first.split("").map((c, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: 80, opacity: 0, scale: 0.4 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.25 + i * 0.06 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
            {rest.length > 0 && (
              <motion.div
                className="-mt-2 -rotate-3 rounded-xl bg-cocoa-700 px-5 py-1 font-display text-3xl text-white shadow-lg sm:text-4xl"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "backOut" }}
              >
                {rest.join(" ")}
              </motion.div>
            )}
            <div className="mt-8 h-2 w-48 overflow-hidden rounded-full bg-cocoa-700/20">
              <motion.div
                className="h-full rounded-full bg-cocoa-700"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-3 font-hand text-2xl text-cocoa-700">esquentando as panelas…</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
