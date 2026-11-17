"use client";

import { motion } from "motion/react";
import { ExternalLink, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, Tags, UtensilsCrossed, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: UtensilsCrossed },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ brand }: { brand: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  const content = (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <p className="font-display text-3xl leading-none text-mustard-400">{brand}</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-cream/50">gerenciador</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={cn(
              "relative flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-colors",
              isActive(n.href) ? "text-cocoa-900" : "text-cream/75 hover:bg-white/5 hover:text-cream",
            )}
          >
            {isActive(n.href) && (
              <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-mustard-400" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            <n.icon size={19} className="relative" />
            <span className="relative">{n.label}</span>
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-cream/75 hover:bg-white/5 hover:text-cream">
          <ExternalLink size={19} /> Ver site
        </a>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-bold text-cream/75 hover:bg-white/5 hover:text-cream">
            <LogOut size={19} /> Sair
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-cocoa-800 lg:block">{content}</aside>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-cocoa-800 px-4 py-3 lg:hidden">
        <span className="font-display text-2xl text-mustard-400">{brand}</span>
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-cream" aria-label="Abrir menu">
          <Menu />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} className="absolute inset-y-0 left-0 w-64 bg-cocoa-800">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-cream" aria-label="Fechar menu">
              <X />
            </button>
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
