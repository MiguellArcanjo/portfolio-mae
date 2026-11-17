"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "./auth";
import { deleteUpload, readDB, saveUpload, updateDB } from "./db";
import { slugify } from "./utils";
import type { Stat } from "./types";

export type ActionState = { ok: boolean; message: string; at?: number } | null;

const done = (message: string): ActionState => ({ ok: true, message, at: Date.now() });
const fail = (message: string): ActionState => ({ ok: false, message, at: Date.now() });

function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}
function list(fd: FormData, key: string, sep = /[,\n]/) {
  return str(fd, key)
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}
function num(fd: FormData, key: string) {
  const n = Number(str(fd, key).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function refreshAll() {
  revalidatePath("/", "layout");
}

/* ---------------- Auth ---------------- */

export async function loginAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const password = str(fd, "password");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 600));
    return fail("Senha incorreta. Tente novamente.");
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- Configurações ---------------- */

export async function saveSettingsAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const heroUpload = await saveUpload(fd.get("heroImageFile"));
    const aboutUpload = await saveUpload(fd.get("aboutImageFile"));
    const stats: Stat[] = [0, 1, 2]
      .map((i) => ({
        label: str(fd, `stat_label_${i}`),
        value: num(fd, `stat_value_${i}`),
        suffix: str(fd, `stat_suffix_${i}`),
      }))
      .filter((s) => s.label);

    await updateDB(async (db) => {
      const s = db.settings;
      if (heroUpload || fd.get("removeHeroImage")) {
        await deleteUpload(s.heroImage);
        s.heroImage = heroUpload ?? "";
      }
      if (aboutUpload || fd.get("removeAboutImage")) {
        await deleteUpload(s.aboutImage);
        s.aboutImage = aboutUpload ?? "";
      }
      Object.assign(s, {
        brandName: str(fd, "brandName") || s.brandName,
        slogan: str(fd, "slogan"),
        heroTitle: str(fd, "heroTitle"),
        heroSubtitle: str(fd, "heroSubtitle"),
        rotatingWords: list(fd, "rotatingWords"),
        aboutTitle: str(fd, "aboutTitle"),
        aboutText: str(fd, "aboutText"),
        whatsapp: str(fd, "whatsapp").replace(/\D/g, ""),
        whatsappDisplay: str(fd, "whatsappDisplay"),
        instagram: str(fd, "instagram").replace(/^@/, ""),
        address: str(fd, "address"),
        hours: str(fd, "hours"),
        deliveryNote: str(fd, "deliveryNote"),
        marquee: list(fd, "marquee"),
        stats,
      });
    });
    refreshAll();
    return done("Configurações salvas! ✨");
  } catch (e) {
    return fail((e as Error).message);
  }
}

/* ---------------- Produtos ---------------- */

export async function saveProductAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return fail("Dê um nome ao produto.");
  let newId = id;
  try {
    const link = str(fd, "imageUrl");
    if (link && !/^https?:\/\/\S+$/i.test(link)) return fail("O link da imagem precisa começar com http:// ou https://");
    const upload = (await saveUpload(fd.get("imageFile"))) ?? (link || null);
    await updateDB(async (db) => {
      const data = {
        name,
        description: str(fd, "description"),
        price: num(fd, "price"),
        categoryId: str(fd, "categoryId"),
        emoji: str(fd, "emoji") || "🍽️",
        tags: list(fd, "tags"),
        badge: str(fd, "badge"),
        featured: fd.get("featured") === "on",
        available: fd.get("available") === "on",
      };
      const existing = db.products.find((p) => p.id === id);
      if (existing) {
        if (upload || fd.get("removeImage")) {
          await deleteUpload(existing.image);
          existing.image = upload ?? "";
        }
        Object.assign(existing, data);
      } else {
        let base = slugify(name) || "produto";
        while (db.products.some((p) => p.id === base)) base += "-" + Math.random().toString(36).slice(2, 5);
        newId = base;
        const order = Math.max(0, ...db.products.filter((p) => p.categoryId === data.categoryId).map((p) => p.order)) + 1;
        db.products.push({ id: newId, image: upload ?? "", order, ...data });
      }
    });
  } catch (e) {
    return fail((e as Error).message);
  }
  refreshAll();
  if (!id) redirect(`/admin/produtos/${newId}?criado=1`);
  return done("Produto salvo! 🎉");
}

export async function deleteProductAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDB(async (db) => {
    const p = db.products.find((x) => x.id === id);
    if (p) await deleteUpload(p.image);
    db.products = db.products.filter((x) => x.id !== id);
  });
  refreshAll();
  redirect("/admin/produtos");
}

export async function toggleProductAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const field = str(fd, "field") as "featured" | "available";
  if (field !== "featured" && field !== "available") return;
  await updateDB((db) => {
    const p = db.products.find((x) => x.id === id);
    if (p) p[field] = !p[field];
  });
  refreshAll();
}

export async function moveProductAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  await updateDB((db) => {
    const p = db.products.find((x) => x.id === id);
    if (!p) return;
    const siblings = db.products.filter((x) => x.categoryId === p.categoryId).sort((a, b) => a.order - b.order);
    siblings.forEach((s, i) => (s.order = i + 1));
    const idx = siblings.indexOf(p);
    const other = siblings[idx + dir];
    if (!other) return;
    [p.order, other.order] = [other.order, p.order];
  });
  refreshAll();
}

/* ---------------- Categorias ---------------- */

export async function saveCategoryAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return fail("Informe o nome da categoria.");
  await updateDB((db) => {
    const existing = db.categories.find((c) => c.id === id);
    const emoji = str(fd, "emoji") || "🍽️";
    if (existing) {
      existing.name = name;
      existing.emoji = emoji;
    } else {
      let base = slugify(name) || "categoria";
      while (db.categories.some((c) => c.id === base)) base += "-2";
      db.categories.push({ id: base, name, emoji, order: db.categories.length + 1 });
    }
  });
  refreshAll();
  return done(id ? "Categoria atualizada!" : "Categoria criada!");
}

export async function deleteCategoryAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const db = await readDB();
  if (db.products.some((p) => p.categoryId === id)) return; // UI já impede
  await updateDB((d) => {
    d.categories = d.categories.filter((c) => c.id !== id);
    d.categories.sort((a, b) => a.order - b.order).forEach((c, i) => (c.order = i + 1));
  });
  refreshAll();
}

export async function moveCategoryAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  await updateDB((db) => {
    const sorted = db.categories.sort((a, b) => a.order - b.order);
    sorted.forEach((c, i) => (c.order = i + 1));
    const idx = sorted.findIndex((c) => c.id === id);
    const other = sorted[idx + dir];
    if (idx < 0 || !other) return;
    [sorted[idx].order, other.order] = [other.order, sorted[idx].order];
  });
  refreshAll();
}

/* ---------------- Depoimentos ---------------- */

export async function saveTestimonialAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const text = str(fd, "text");
  if (!name || !text) return fail("Preencha nome e depoimento.");
  const rating = Math.min(5, Math.max(1, Math.round(num(fd, "rating") || 5)));
  await updateDB((db) => {
    const existing = db.testimonials.find((t) => t.id === id);
    if (existing) Object.assign(existing, { name, text, rating });
    else db.testimonials.unshift({ id: "t" + Date.now().toString(36), name, text, rating, visible: true });
  });
  refreshAll();
  return done(id ? "Depoimento atualizado!" : "Depoimento adicionado! 💬");
}

export async function toggleTestimonialAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDB((db) => {
    const t = db.testimonials.find((x) => x.id === id);
    if (t) t.visible = !t.visible;
  });
  refreshAll();
}

export async function deleteTestimonialAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDB((db) => {
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
  });
  refreshAll();
}
