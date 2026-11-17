import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { readDB } from "@/lib/db";
import { deleteProductAction } from "@/lib/actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { ConfirmSubmit } from "@/components/admin/ui";

export default async function EditarProdutoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criado?: string }>;
}) {
  const { id } = await params;
  const { criado } = await searchParams;
  const db = await readDB();
  const product = db.products.find((p) => p.id === id);
  if (!product) notFound();
  const categories = [...db.categories].sort((a, b) => a.order - b.order);

  return (
    <div>
      <Link href="/admin/produtos" className="inline-flex items-center gap-1 text-sm font-bold text-cocoa-500 hover:text-cocoa-800">
        <ArrowLeft size={16} /> Produtos
      </Link>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl text-cocoa-800">
          {product.emoji} {product.name}
        </h1>
        <form action={deleteProductAction}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmSubmit
            message={`Excluir "${product.name}"? Essa ação não pode ser desfeita.`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-2 font-bold text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} /> Excluir
          </ConfirmSubmit>
        </form>
      </div>
      {criado && (
        <p className="mb-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 font-bold text-emerald-800">
          🎉 Produto criado! Ele já está no cardápio do site.
        </p>
      )}
      <ProductForm key={product.id} product={product} categories={categories} />
    </div>
  );
}
