"use client";

import { useState } from "react";
import { saveProductAction } from "@/lib/actions";
import type { Category, Product } from "@/lib/types";
import { priceLabel } from "@/lib/utils";
import { ProductVisual } from "@/components/site/ProductVisual";
import { ActionForm, Card, Field, ImageInput, Select, SubmitButton, Toggle } from "./ui";

const EMOJIS = ["🌭", "🍔", "🌽", "🥔", "🍟", "🍲", "🥣", "🍮", "🥛", "🍰", "🧁", "🍫", "🥤", "🧃", "🍕", "🥪", "🌮", "🍗", "🥟", "🍦"];

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ? String(product.price).replace(".", ",") : "");
  const [emoji, setEmoji] = useState(product?.emoji ?? "🌭");
  const [badge, setBadge] = useState(product?.badge ?? "");

  return (
    <ActionForm action={saveProductAction} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Nome do produto" name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Cachorro-quente completo" />
          <Field label="Descrição" name="description" textarea defaultValue={product?.description} placeholder="Conte o que vem, como é feito…" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Preço (R$)"
              name="price"
              inputMode="decimal"
              hint="Deixe vazio para mostrar “Consulte”"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15,00"
            />
            <Select label="Categoria" name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </Select>
          </div>
          <Field label="Ingredientes / etiquetas" name="tags" defaultValue={product?.tags.join(", ")} hint="Separe por vírgula. Ex: Mandioca, Frango desfiado, Legumes" />
          <Field
            label="Selo (opcional)"
            name="badge"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="Ex: Mais pedido, Novo, Da casa"
          />
        </Card>

        <Card>
          <span className="mb-2 block text-sm font-bold text-cocoa-700">Emoji (usado quando não há foto e na animação da sacola)</span>
          <input type="hidden" name="emoji" value={emoji} />
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`grid h-11 w-11 place-items-center rounded-xl border-2 text-2xl transition hover:scale-110 ${emoji === e ? "border-cocoa-700 bg-mustard-200" : "border-cocoa-100 bg-white"}`}
              >
                {e}
              </button>
            ))}
            <input
              aria-label="Outro emoji"
              value={EMOJIS.includes(emoji) ? "" : emoji}
              onChange={(e) => e.target.value && setEmoji(e.target.value)}
              placeholder="outro"
              className="h-11 w-20 rounded-xl border-2 border-cocoa-100 px-2 text-center"
            />
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="available" label="Disponível" hint="Desmarque quando acabar" defaultChecked={product?.available ?? true} />
          <Toggle name="featured" label="Destaque" hint="Aparece no carrossel de destaques" defaultChecked={product?.featured ?? false} />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <ImageInput name="imageFile" removeName="removeImage" urlName="imageUrl" current={product?.image} label="Foto do produto" fallbackEmoji={emoji} />
        </Card>

        <Card className="sticky top-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-cocoa-500">Pré-visualização</p>
          <div className="overflow-hidden rounded-3xl border-[3px] border-cocoa-700 bg-white shadow-[5px_5px_0_var(--color-cocoa-700)]">
            <div className="relative aspect-[4/3] border-b-[3px] border-cocoa-700">
              <ProductVisual image={product?.image} emoji={emoji} alt={name} />
              {badge && (
                <span className="absolute left-3 top-3 -rotate-6 rounded-lg border-2 border-cocoa-800 bg-pepper px-2 py-0.5 text-xs font-extrabold uppercase text-white">
                  {badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-display text-2xl text-cocoa-700">{name || "Nome do produto"}</p>
              <p className="font-display text-2xl text-pepper">{priceLabel(Number(price.replace(",", ".")) || 0)}</p>
            </div>
          </div>
          <SubmitButton className="mt-5 w-full py-3 text-lg">{product ? "Salvar alterações" : "Criar produto"}</SubmitButton>
        </Card>
      </div>
    </ActionForm>
  );
}
