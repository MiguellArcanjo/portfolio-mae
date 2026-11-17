"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Send, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { brl, waLink } from "@/lib/utils";
import { useCart } from "./cart";

export function CartDrawer({ whatsapp, deliveryNote }: { whatsapp: string; deliveryNote: string }) {
  const { items, open, setOpen, setQty, total, count, clear } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Pix");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const hasUnpriced = items.some((i) => !(i.price > 0));
  const message = [
    "Olá! Quero fazer um pedido 😋",
    "",
    ...items.map((i) => `• ${i.qty}x ${i.name} — ${i.price > 0 ? brl(i.qty * i.price) : "preço a consultar"}`),
    "",
    total > 0
      ? `*Total: ${brl(total)}*${hasUnpriced ? " + itens a consultar" : ""} (+ taxa de entrega)`
      : "*Total: a consultar* (+ taxa de entrega)",
    "",
    name ? `👤 Nome: ${name}` : null,
    address ? `📍 Endereço: ${address}` : null,
    `💳 Pagamento: ${payment}`,
    notes ? `📝 Obs: ${notes}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-cocoa-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-[90] flex w-full max-w-md flex-col border-l-4 border-cocoa-700 bg-cream"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            role="dialog"
            aria-label="Sacola de pedidos"
          >
            <header className="tiles flex items-center justify-between border-b-4 border-cocoa-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-cocoa-700 text-cream">
                  <ShoppingBag size={20} />
                </span>
                <div>
                  <h2 className="font-display text-3xl leading-none text-cocoa-800">Sua sacola</h2>
                  <p className="text-sm font-bold text-cocoa-700">{count} {count === 1 ? "item" : "itens"}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border-2 border-cocoa-700 bg-white text-cocoa-700 transition-transform hover:rotate-90" aria-label="Fechar">
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.span className="text-7xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    🥺
                  </motion.span>
                  <p className="mt-4 font-display text-3xl text-cocoa-700">Sacola vazia!</p>
                  <p className="mt-1 text-cocoa-700/70">Que tal um cachorro-quente?</p>
                  <a href="#cardapio" onClick={() => setOpen(false)} className="mt-6 rounded-full bg-cocoa-700 px-6 py-3 font-bold text-cream">
                    Ver cardápio
                  </a>
                </div>
              ) : (
                <>
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {items.map((i) => (
                        <motion.li
                          key={i.id}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -80, height: 0, marginTop: 0 }}
                          className="flex items-center gap-3 overflow-hidden rounded-2xl border-2 border-cocoa-700 bg-white p-3"
                        >
                          <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-mustard-200 text-3xl">
                            {i.image ? <img src={i.image} alt="" className="h-full w-full object-cover" /> : i.emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-cocoa-800">{i.name}</p>
                            <p className="text-sm font-bold text-pepper">{i.price > 0 ? brl(i.price * i.qty) : "Consulte"}</p>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-mustard-100 p-1">
                            <button onClick={() => setQty(i.id, i.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white text-cocoa-700" aria-label="Diminuir">
                              {i.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                            </button>
                            <motion.span key={i.qty} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="w-6 text-center font-bold text-cocoa-800">
                              {i.qty}
                            </motion.span>
                            <button onClick={() => setQty(i.id, i.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-cocoa-700 text-cream" aria-label="Aumentar">
                              <Plus size={14} />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <button onClick={clear} className="mt-3 text-sm font-bold text-cocoa-700/60 underline-offset-2 hover:underline">
                    esvaziar sacola
                  </button>

                  <div className="mt-6 space-y-3">
                    <Field label="Seu nome" value={name} onChange={setName} placeholder="Como podemos te chamar?" />
                    <Field label="Endereço de entrega" value={address} onChange={setAddress} placeholder="Rua, número, bairro, referência" />
                    <div>
                      <span className="mb-1 block text-sm font-bold text-cocoa-700">Pagamento</span>
                      <div className="grid grid-cols-3 gap-2">
                        {["Pix", "Cartão", "Dinheiro"].map((p) => (
                          <button
                            key={p}
                            onClick={() => setPayment(p)}
                            className={`rounded-xl border-2 border-cocoa-700 py-2 text-sm font-bold transition-colors ${payment === p ? "bg-cocoa-700 text-cream" : "bg-white text-cocoa-700"}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label="Observações" value={notes} onChange={setNotes} placeholder="Ex: sem cebola, troco para R$50…" />
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t-4 border-cocoa-700 bg-white px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-cocoa-700">Total</span>
                  <motion.span key={total} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-4xl text-pepper">
                    {total > 0 ? brl(total) : "A consultar"}
                  </motion.span>
                </div>
                <p className="mt-1 text-xs text-cocoa-700/60">
                  {hasUnpriced && total > 0 && "+ itens com preço a consultar. "}
                  {deliveryNote}
                </p>
                <a
                  href={waLink(whatsapp, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-cocoa-800 bg-zap py-4 text-lg font-bold text-white shadow-[4px_4px_0_var(--color-cocoa-800)] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  Enviar pedido no WhatsApp
                  <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-rotate-12" />
                </a>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-cocoa-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-cocoa-700 bg-white px-3 py-2.5 text-cocoa-800 outline-none transition-shadow placeholder:text-cocoa-700/40 focus:shadow-[3px_3px_0_var(--color-mustard-500)]"
      />
    </label>
  );
}
