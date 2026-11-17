import { Eye, EyeOff, Star, Trash2 } from "lucide-react";
import { readDB } from "@/lib/db";
import { deleteTestimonialAction, saveTestimonialAction, toggleTestimonialAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { ActionForm, Card, ConfirmSubmit, Field, PendingButton, Select, SubmitButton } from "@/components/admin/ui";

export default async function DepoimentosPage() {
  const db = await readDB();

  return (
    <div>
      <h1 className="font-display text-5xl text-cocoa-800">Depoimentos</h1>
      <p className="text-cocoa-500">Os bilhetinhos de clientes que aparecem no site.</p>

      <Card className="mt-8">
        <h2 className="font-display text-2xl text-cocoa-800">Novo depoimento</h2>
        <ActionForm action={saveTestimonialAction} resetOnSuccess className="mt-4 grid gap-4 sm:grid-cols-[1fr_10rem]">
          <Field label="Nome do cliente" name="name" required placeholder="Ex: Maria S." />
          <Select label="Nota" name="rating" defaultValue="5">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}
              </option>
            ))}
          </Select>
          <Field label="Depoimento" name="text" textarea required className="sm:col-span-2" placeholder="O que o cliente falou…" />
          <div className="sm:col-span-2">
            <SubmitButton>Adicionar depoimento</SubmitButton>
          </div>
        </ActionForm>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {db.testimonials.map((t) => (
          <Card key={t.id} className={cn("relative", !t.visible && "opacity-60")}>
            <ActionForm action={saveTestimonialAction} className="space-y-3">
              <input type="hidden" name="id" value={t.id} />
              <div className="grid grid-cols-[1fr_7rem] gap-3">
                <Field label="Nome" name="name" defaultValue={t.name} required />
                <Select label="Nota" name="rating" defaultValue={String(t.rating)}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </Select>
              </div>
              <Field label="Depoimento" name="text" textarea defaultValue={t.text} required />
              <div className="flex items-center gap-1 text-mustard-600">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
                {!t.visible && <span className="ml-2 rounded-full bg-cocoa-50 px-2 text-xs font-bold text-cocoa-500">oculto</span>}
              </div>
              <SubmitButton className="px-4 py-2 text-sm">Salvar</SubmitButton>
            </ActionForm>
            <div className="absolute bottom-6 right-6 flex gap-1">
              <form action={toggleTestimonialAction}>
                <input type="hidden" name="id" value={t.id} />
                <PendingButton title={t.visible ? "Ocultar do site" : "Mostrar no site"} className="grid h-10 w-10 place-items-center rounded-xl text-cocoa-700 hover:bg-cocoa-50">
                  {t.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </PendingButton>
              </form>
              <form action={deleteTestimonialAction}>
                <input type="hidden" name="id" value={t.id} />
                <ConfirmSubmit message={`Excluir o depoimento de ${t.name}?`} className="grid h-10 w-10 place-items-center rounded-xl text-red-600 hover:bg-red-50">
                  <Trash2 size={18} />
                </ConfirmSubmit>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
