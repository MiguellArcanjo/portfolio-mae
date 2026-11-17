import type { Metadata } from "next";
import { readDB } from "@/lib/db";
import { About } from "@/components/site/About";
import { CartProvider } from "@/components/site/cart";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Contact } from "@/components/site/Contact";
import { Featured } from "@/components/site/Featured";
import { FloatingButtons } from "@/components/site/FloatingButtons";
import { Hero } from "@/components/site/Hero";
import { HowToOrder } from "@/components/site/HowToOrder";
import { Marquee } from "@/components/site/Marquee";
import { Menu } from "@/components/site/Menu";
import { Navbar } from "@/components/site/Navbar";
import { Preloader } from "@/components/site/Preloader";
import { Testimonials } from "@/components/site/Testimonials";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await readDB();
  return {
    title: { absolute: `${settings.brandName} — ${settings.heroTitle}` },
    description: `${settings.slogan} ${settings.heroSubtitle}`,
  };
}

export default async function Home() {
  const db = await readDB();
  const { settings } = db;
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  const catOrder = new Map(categories.map((c) => [c.id, c.order]));
  const products = [...db.products].sort(
    (a, b) => (catOrder.get(a.categoryId) ?? 99) - (catOrder.get(b.categoryId) ?? 99) || a.order - b.order,
  );
  const featured = products.filter((p) => p.featured);
  const testimonials = db.testimonials.filter((t) => t.visible);

  return (
    <CartProvider>
      <div className="grain">
        <Preloader brand={settings.brandName} />
        <Navbar brand={settings.brandName} avatar={settings.aboutImage} />
        <main>
          <Hero settings={settings} plateProducts={featured.length ? featured : products} />
          <Marquee items={settings.marquee} />
          <Menu categories={categories} products={products} />
          <Featured products={featured} />
          <About settings={settings} />
          <HowToOrder />
          <Testimonials items={testimonials} />
          <Contact
            settings={settings}
            usedImages={[settings.heroImage, settings.aboutImage, ...products.map((p) => p.image)]}
          />
        </main>
        <FloatingButtons whatsapp={settings.whatsapp} />
        <CartDrawer whatsapp={settings.whatsapp} deliveryNote={settings.deliveryNote} />
      </div>
    </CartProvider>
  );
}
