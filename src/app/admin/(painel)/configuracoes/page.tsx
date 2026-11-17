import { readDB } from "@/lib/db";
import { saveSettingsAction } from "@/lib/actions";
import { ActionForm, Card, Field, ImageInput, SubmitButton } from "@/components/admin/ui";

export default async function ConfiguracoesPage() {
  const { settings: s } = await readDB();

  return (
    <div>
      <h1 className="font-display text-5xl text-cocoa-800">Configurações</h1>
      <p className="text-cocoa-500">Textos, contatos e imagens do site.</p>

      <ActionForm action={saveSettingsAction} className="mt-8 space-y-6 pb-24">
        <Card className="space-y-4">
          <h2 className="font-display text-2xl text-cocoa-800">🏷️ Marca</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome" name="brandName" defaultValue={s.brandName} required hint="A primeira palavra vira o letreiro grande; o resto, a faixa." />
            <Field label="Slogan" name="slogan" defaultValue={s.slogan} />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-display text-2xl text-cocoa-800">🔥 Topo do site</h2>
          <Field label="Título (aparece no SEO)" name="heroTitle" defaultValue={s.heroTitle} />
          <Field label="Subtítulo" name="heroSubtitle" textarea defaultValue={s.heroSubtitle} />
          <Field
            label='Palavras que giram em "Hoje tem…"'
            name="rotatingWords"
            defaultValue={s.rotatingWords.join(", ")}
            hint="Separe por vírgula"
          />
          <Field label="Faixa rolante" name="marquee" defaultValue={s.marquee.join(", ")} hint="Separe por vírgula" />
          <div className="max-w-sm">
            <ImageInput name="heroImageFile" removeName="removeHeroImage" current={s.heroImage} label="Foto do prato principal (opcional, fica no círculo)" fallbackEmoji="🍽️" />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-display text-2xl text-cocoa-800">💛 Sobre</h2>
          <Field label="Título" name="aboutTitle" defaultValue={s.aboutTitle} />
          <Field label="Texto" name="aboutText" textarea defaultValue={s.aboutText} hint="Pule uma linha para criar parágrafos." />
          <div className="max-w-sm">
            <ImageInput name="aboutImageFile" removeName="removeAboutImage" current={s.aboutImage} label="Foto (ex: a chef com o pudim)" fallbackEmoji="👩‍🍳" />
          </div>
          <div>
            <span className="mb-2 block text-sm font-bold text-cocoa-700">Números animados</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="grid grid-cols-[1fr_4rem] gap-2 rounded-2xl bg-cocoa-50/60 p-3">
                  <Field label="Valor" name={`stat_value_${i}`} type="number" defaultValue={s.stats[i]?.value} />
                  <Field label="Sufixo" name={`stat_suffix_${i}`} defaultValue={s.stats[i]?.suffix} />
                  <Field label="Legenda" name={`stat_label_${i}`} defaultValue={s.stats[i]?.label} className="col-span-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-display text-2xl text-cocoa-800">📲 Contato e entrega</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp (com DDI e DDD, só números)" name="whatsapp" defaultValue={s.whatsapp} required hint="Ex: 5583988201418 — é para onde os pedidos vão" />
            <Field label="WhatsApp (como exibir)" name="whatsappDisplay" defaultValue={s.whatsappDisplay} />
            <Field label="Instagram (sem @)" name="instagram" defaultValue={s.instagram} />
            <Field label="Endereço / região" name="address" defaultValue={s.address} />
            <Field label="Horário de funcionamento" name="hours" defaultValue={s.hours} />
            <Field label="Aviso de entrega" name="deliveryNote" defaultValue={s.deliveryNote} />
          </div>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 z-20 border-t-2 border-cocoa-100 bg-white/90 px-4 py-3 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-6xl justify-end">
            <SubmitButton className="px-8 py-3 text-lg">Salvar configurações</SubmitButton>
          </div>
        </div>
      </ActionForm>
    </div>
  );
}
