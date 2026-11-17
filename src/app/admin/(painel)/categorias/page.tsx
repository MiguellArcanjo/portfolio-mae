import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { readDB } from "@/lib/db";
import { deleteCategoryAction, moveCategoryAction, saveCategoryAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { ActionForm, Card, ConfirmSubmit, PendingButton, SubmitButton } from "@/components/admin/ui";

const input = "rounded-xl border-2 border-cocoa-100 bg-white px-3 py-2 outline-none focus:border-mustard-500";

export default async function CategoriasPage() {
  const db = await readDB();
  const categories = [...db.categories].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="font-display text-5xl text-cocoa-800">Categorias</h1>
      <p className="text-cocoa-500">Viram os filtros do cardápio, na ordem abaixo.</p>

      <Card className="mt-8">
        <h2 className="font-display text-2xl text-cocoa-800">Nova categoria</h2>
        <ActionForm action={saveCategoryAction} resetOnSuccess className="mt-4 flex flex-wrap items-end gap-3">
          <label>
            <span className="mb-1 block text-sm font-bold text-cocoa-700">Emoji</span>
            <input name="emoji" placeholder="🍕" className={cn(input, "w-20 text-center text-xl")} />
          </label>
          <label className="min-w-48 flex-1">
            <span className="mb-1 block text-sm font-bold text-cocoa-700">Nome</span>
            <input name="name" required placeholder="Ex: Salgados" className={cn(input, "w-full")} />
          </label>
          <SubmitButton>Adicionar</SubmitButton>
        </ActionForm>
      </Card>

      <ul className="mt-6 space-y-3">
        {categories.map((c, i) => {
          const count = db.products.filter((p) => p.categoryId === c.id).length;
          return (
            <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-cocoa-100 bg-white p-3">
              <div className="flex flex-col">
                <form action={moveCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="up" />
                  <PendingButton title="Subir" className={cn("rounded p-1 text-cocoa-500 hover:bg-cocoa-50", i === 0 && "invisible")}>
                    <ArrowUp size={14} />
                  </PendingButton>
                </form>
                <form action={moveCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="down" />
                  <PendingButton title="Descer" className={cn("rounded p-1 text-cocoa-500 hover:bg-cocoa-50", i === categories.length - 1 && "invisible")}>
                    <ArrowDown size={14} />
                  </PendingButton>
                </form>
              </div>
              <ActionForm action={saveCategoryAction} className="flex flex-1 flex-wrap items-center gap-3">
                <input type="hidden" name="id" value={c.id} />
                <input name="emoji" defaultValue={c.emoji} className={cn(input, "w-16 text-center text-xl")} aria-label="Emoji" />
                <input name="name" defaultValue={c.name} required className={cn(input, "min-w-40 flex-1 font-bold")} aria-label="Nome" />
                <span className="rounded-full bg-mustard-100 px-3 py-1 text-sm font-bold text-cocoa-700">
                  {count} produto{count === 1 ? "" : "s"}
                </span>
                <SubmitButton className="px-4 py-2 text-sm">Salvar</SubmitButton>
              </ActionForm>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={c.id} />
                {count > 0 ? (
                  <span title="Mova ou exclua os produtos desta categoria antes" className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-xl text-cocoa-100">
                    <Trash2 size={18} />
                  </span>
                ) : (
                  <ConfirmSubmit message={`Excluir a categoria "${c.name}"?`} className="grid h-10 w-10 place-items-center rounded-xl text-red-600 hover:bg-red-50">
                    <Trash2 size={18} />
                  </ConfirmSubmit>
                )}
              </form>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-cocoa-500">Só é possível excluir categorias vazias.</p>
    </div>
  );
}
