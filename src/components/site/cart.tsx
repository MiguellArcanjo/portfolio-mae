"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";

export type CartItem = { id: string; name: string; price: number; emoji: string; image: string; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, from?: HTMLElement | null) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  cartButtonRef: React.RefObject<HTMLButtonElement | null>;
  bump: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "bd-cart-v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação do carrinho salvo
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const flyToCart = useCallback((from: HTMLElement | null | undefined, emoji: string) => {
    const target = cartButtonRef.current;
    if (!from || !target || typeof document === "undefined") return;
    const a = from.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const el = document.createElement("div");
    el.textContent = emoji;
    Object.assign(el.style, {
      position: "fixed",
      left: `${a.left + a.width / 2 - 20}px`,
      top: `${a.top + a.height / 2 - 20}px`,
      width: "40px",
      height: "40px",
      fontSize: "30px",
      display: "grid",
      placeItems: "center",
      zIndex: "100",
      pointerEvents: "none",
      filter: "drop-shadow(0 6px 10px rgba(45,11,5,.35))",
    } as CSSStyleDeclaration);
    document.body.appendChild(el);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    el.animate(
      [
        { transform: "translate(0,0) scale(1) rotate(0deg)", offset: 0 },
        { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 140}px) scale(1.5) rotate(200deg)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.3) rotate(400deg)`, opacity: 0.6, offset: 1 },
      ],
      { duration: 800, easing: "cubic-bezier(.5,0,.3,1)" },
    ).onfinish = () => {
      el.remove();
      setBump((n) => n + 1);
    };
  }, []);

  const add = useCallback(
    (p: Product, from?: HTMLElement | null) => {
      setItems((prev) => {
        const found = prev.find((i) => i.id === p.id);
        if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
        return [...prev, { id: p.id, name: p.name, price: p.price, emoji: p.emoji, image: p.image, qty: 1 }];
      });
      if (from) flyToCart(from, p.emoji);
      else setBump((n) => n + 1);
    },
    [flyToCart],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))));
  }, []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      open,
      setOpen,
      add,
      setQty,
      clear: () => setItems([]),
      cartButtonRef,
      bump,
    }),
    [items, open, add, setQty, bump],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart fora do CartProvider");
  return ctx;
}
