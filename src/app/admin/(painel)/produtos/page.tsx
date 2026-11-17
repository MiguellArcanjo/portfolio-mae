/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Star } from "lucide-react";
import { readDB } from "@/lib/db";
import { moveProductAction, toggleProductAction } from "@/lib/actions";
import { cn, priceLabel } from "@/lib/utils";
import { PendingButton } from "@/components/admin/ui";

export default async function ProdutosPage() {
  const db = await readDB();
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  const orphan = db.products.filter((p) => !categories.some((c) => c.id === p.categoryId));
  const groups = [
    ...categories.map((c) => ({ key: c.id, title: `${c.emoji} ${c.name}`, items: db.products.filter((p) => p.categoryId === c.id) })),
    ...(orphan.length ? [{ key: "_", title: "Sem categoria", items: orphan }] : []),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl text-cocoa-800">Produtos</h1>
          <p className="text-cocoa-500">Tudo que aparece no cardápio do site.</p>
        </div>
        <Link href="/admin/produtos/novo" className="inline-flex items-center gap-2 rounded-xl border-2 border-cocoa-800 bg-cocoa-700 px-4 py-2.5 font-bold text-cream shadow-[3px_3px_0_var(--color-cocoa-900)]">
          <Plus size={18} /> Novo produto
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <section key={g.key}>
            <h2 className="mb-3 font-display text-2xl text-cocoa-700">{g.title}</h2>
            {g.items.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-cocoa-100 p-5 text-sm text-cocoa-500">Nenhum produto nesta categoria.</p>
            ) : (
              <ul className="space-y-3">
                {g.items
                  .sort((a, b) => a.order - b.order)
                  .map((p, i, arr) => (
                    <li key={p.id} className={cn("flex flex-wrap items-center gap-4 rounded-2xl border-2 border-cocoa-100 bg-white p-3 pr-4 transition hover:border-mustard-400", !p.available && "opacity-60")}>
                      <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-mustard-200 text-3xl">
                        {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : p.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 font-bold text-cocoa-800">
                          {p.name}
                          {p.badge && <span className="rounded-md bg-pepper px-2 py-0.5 text-xs text-white">{p.badge}</span>}
                          {!p.available && <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs text-red-700">esgotado</span>}
                        </p>
                        <p className="line-clamp-1 text-sm text-cocoa-500">{p.description}</p>
                      </div>
                      <span className="font-display text-xl text-pepper">{priceLabel(p.price)}</span>
                      <div className="flex items-center gap-1">
                        <form action={moveProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="dir" value="up" />
                          <PendingButton title="Subir" className={cn("rounded-lg p-2 text-cocoa-500 hover:bg-cocoa-50", i === 0 && "invisible")}>
                            <ArrowUp size={16} />
                          </PendingButton>
                        </form>
                        <form action={moveProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="dir" value="down" />
                          <PendingButton title="Descer" className={cn("rounded-lg p-2 text-cocoa-500 hover:bg-cocoa-50", i === arr.length - 1 && "invisible")}>
                            <ArrowDown size={16} />
                          </PendingButton>
                        </form>
                        <form action={toggleProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="field" value="featured" />
                          <PendingButton
                            title={p.featured ? "Remover dos destaques" : "Destacar"}
                            className={cn("rounded-lg p-2 hover:bg-mustard-100", p.featured ? "text-mustard-600" : "text-cocoa-300")}
                          >
                            <Star size={18} fill={p.featured ? "currentColor" : "none"} />
                          </PendingButton>
                        </form>
                        <form action={toggleProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="field" value="available" />
                          <PendingButton
                            title={p.available ? "Marcar como esgotado" : "Marcar como disponível"}
                            className={cn("rounded-lg p-2 hover:bg-cocoa-50", p.available ? "text-emerald-600" : "text-red-600")}
                          >
                            {p.available ? <Eye size={18} /> : <EyeOff size={18} />}
                          </PendingButton>
                        </form>
                        <Link href={`/admin/produtos/${p.id}`} className="rounded-lg p-2 text-cocoa-700 hover:bg-cocoa-50" title="Editar">
                          <Pencil size={18} />
                        </Link>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
