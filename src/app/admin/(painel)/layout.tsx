import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { readDB } from "@/lib/db";

export const metadata: Metadata = { title: "Gerenciador", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { settings } = await readDB();
  return (
    <div className="min-h-screen bg-[#fbf6ee]">
      <Sidebar brand={settings.brandName} />
      <main className="px-4 py-8 sm:px-8 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
