import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { readDB } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NovoProdutoPage() {
  const db = await readDB();
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  return (
    <div>
      <Link href="/admin/produtos" className="inline-flex items-center gap-1 text-sm font-bold text-cocoa-500 hover:text-cocoa-800">
        <ArrowLeft size={16} /> Produtos
      </Link>
      <h1 className="mb-8 font-display text-5xl text-cocoa-800">Novo produto</h1>
      {categories.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-mustard-500 bg-mustard-50 p-6">
          Crie pelo menos uma <Link href="/admin/categorias" className="font-bold underline">categoria</Link> antes de adicionar produtos.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
