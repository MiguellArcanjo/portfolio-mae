import Link from "next/link";
import { ArrowRight, Eye, MessageSquareQuote, Plus, Settings, Star, Tags, UtensilsCrossed } from "lucide-react";
import { readDB } from "@/lib/db";
import { brl, priceLabel } from "@/lib/utils";

export default async function Dashboard() {
  const db = await readDB();
  const available = db.products.filter((p) => p.available).length;
  const featured = db.products.filter((p) => p.featured).length;
  const priced = db.products.filter((p) => p.price > 0);
  const avg = priced.length ? priced.reduce((s, p) => s + p.price, 0) / priced.length : 0;
  const noPrice = db.products.length - priced.length;
  const noPhoto = db.products.filter((p) => !p.image).length;

  const cards = [
    { label: "Produtos", value: db.products.length, sub: `${available} disponíveis`, icon: UtensilsCrossed, color: "bg-mustard-400", href: "/admin/produtos" },
    { label: "Em destaque", value: featured, sub: "aparecem no carrossel", icon: Star, color: "bg-pepper text-white", href: "/admin/produtos" },
    { label: "Categorias", value: db.categories.length, sub: "no cardápio", icon: Tags, color: "bg-cocoa-700 text-cream", href: "/admin/categorias" },
    { label: "Depoimentos", value: db.testimonials.length, sub: `${db.testimonials.filter((t) => t.visible).length} visíveis`, icon: MessageSquareQuote, color: "bg-zap text-white", href: "/admin/depoimentos" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-hand text-2xl text-cocoa-500">olá, chef! 👋</p>
          <h1 className="font-display text-5xl text-cocoa-800">Painel</h1>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border-2 border-cocoa-100 bg-white px-4 py-2.5 font-bold text-cocoa-700 hover:border-mustard-400">
            <Eye size={18} /> Ver site
          </a>
          <Link href="/admin/produtos/novo" className="inline-flex items-center gap-2 rounded-xl border-2 border-cocoa-800 bg-cocoa-700 px-4 py-2.5 font-bold text-cream shadow-[3px_3px_0_var(--color-cocoa-900)]">
            <Plus size={18} /> Novo produto
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group rounded-3xl border-2 border-cocoa-100 bg-white p-5 transition hover:-translate-y-1 hover:border-mustard-400 hover:shadow-lg">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${c.color}`}>
              <c.icon size={22} />
            </span>
            <p className="mt-4 font-display text-4xl text-cocoa-800">{c.value}</p>
            <p className="font-bold text-cocoa-700">{c.label}</p>
            <p className="text-sm text-cocoa-500">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border-2 border-cocoa-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-cocoa-800">Cardápio</h2>
            <Link href="/admin/produtos" className="flex items-center gap-1 text-sm font-bold text-cocoa-500 hover:text-cocoa-800">
              ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-cocoa-50">
            {db.products.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link href={`/admin/produtos/${p.id}`} className="flex items-center gap-3 py-3 hover:bg-cocoa-50/50">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="flex-1 font-bold text-cocoa-800">{p.name}</span>
                  {!p.available && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">esgotado</span>}
                  <span className="font-bold text-pepper">{priceLabel(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-cocoa-800 p-6 text-cream">
            <p className="text-sm font-bold uppercase tracking-widest text-cream/60">Ticket médio do cardápio</p>
            <p className="mt-2 font-display text-5xl text-mustard-400">{avg ? brl(avg) : "—"}</p>
          </div>
          <div className="rounded-3xl border-2 border-dashed border-mustard-500 bg-mustard-50 p-6">
            <h3 className="font-display text-2xl text-cocoa-800">Dicas rápidas 💡</h3>
            <ul className="mt-3 space-y-2 text-sm text-cocoa-700">
              {noPrice > 0 && (
                <li>
                  💲 <b>{noPrice}</b> produto(s) sem preço — aparecem como “Consulte” no site.
                </li>
              )}
              {noPhoto > 0 && (
                <li>
                  📸 <b>{noPhoto}</b> produto(s) sem foto. Fotos reais aumentam muito os pedidos!
                </li>
              )}
              <li>⭐ Marque como <b>destaque</b> os itens que você quer vender mais — eles aparecem no carrossel.</li>
              <li>🚫 Acabou algum item? Marque como <b>esgotado</b> em vez de excluir.</li>
              <li>
                ⚙️ Horário, WhatsApp e textos ficam em{" "}
                <Link href="/admin/configuracoes" className="inline-flex items-center gap-1 font-bold underline">
                  <Settings size={12} /> Configurações
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
