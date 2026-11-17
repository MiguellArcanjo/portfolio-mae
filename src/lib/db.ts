import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { seed } from "./seed";
import type { DB } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

let queue: Promise<unknown> = Promise.resolve();

export async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    // garante que novos campos do seed existam em bancos antigos
    return {
      settings: { ...seed.settings, ...parsed.settings },
      categories: parsed.categories ?? seed.categories,
      products: parsed.products ?? seed.products,
      testimonials: parsed.testimonials ?? seed.testimonials,
    };
  } catch (e) {
    // Só cria o banco a partir do seed se o arquivo não existir — nunca sobrescreve dados existentes.
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    await writeFileAtomic(seed).catch(() => undefined); // outra requisição pode ter criado ao mesmo tempo
    return structuredClone(seed);
  }
}

async function writeFileAtomic(db: DB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
}

/** Lê, aplica a mutação e salva, de forma serializada para evitar corridas. */
export function updateDB(mutator: (db: DB) => void | Promise<void>): Promise<DB> {
  const run = queue.then(async () => {
    const db = await readDB();
    await mutator(db);
    await writeFileAtomic(db);
    return db;
  });
  queue = run.catch(() => undefined);
  return run;
}

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);

/** Salva um arquivo de imagem enviado e retorna a URL pública, ou null se nada foi enviado. */
export async function saveUpload(file: FormDataEntryValue | null): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const ext = ALLOWED.get(file.type);
  if (!ext) throw new Error("Formato de imagem não suportado (use JPG, PNG, WEBP, GIF ou AVIF).");
  if (file.size > 7 * 1024 * 1024) throw new Error("Imagem muito grande (máximo 7MB).");
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function deleteUpload(url: string | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  const name = path.basename(url);
  await fs.unlink(path.join(UPLOAD_DIR, name)).catch(() => undefined);
}
