import type { Metadata } from "next";
import { content } from "@/lib/content";
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

const { settings } = content;

export const metadata: Metadata = {
  title: { absolute: `${settings.brandName} — ${settings.heroTitle}` },
  description: `${settings.slogan} ${settings.heroSubtitle}`,
};

export default function Home() {
  const categories = [...content.categories].sort((a, b) => a.order - b.order);
  const catOrder = new Map(categories.map((c) => [c.id, c.order]));
  const products = [...content.products].sort(
    (a, b) => (catOrder.get(a.categoryId) ?? 99) - (catOrder.get(b.categoryId) ?? 99) || a.order - b.order,
  );
  const featured = products.filter((p) => p.featured);
  const testimonials = content.testimonials.filter((t) => t.visible);

  return (
    <CartProvider>
      <div className="grain">
        <Preloader brand={settings.brandName} />
        <Navbar
          brand={settings.brandName}
          avatar={settings.aboutImage}
          hideLinks={testimonials.length ? [] : ["#depoimentos"]}
        />
        <main>
          <Hero settings={settings} plateProducts={featured.length ? featured : products} />
          <Marquee items={settings.marquee} />
          <Menu categories={categories} products={products} whatsapp={settings.whatsapp} />
          <Featured products={featured} whatsapp={settings.whatsapp} />
          <About settings={settings} />
          <HowToOrder />
          <Testimonials items={testimonials} />
          <Contact
            settings={settings}
            usedImages={[settings.heroImage, settings.aboutImage, ...products.map((p) => p.image)]}
          />
        </main>
        <FloatingButtons whatsapp={settings.whatsapp} />
        <CartDrawer whatsapp={settings.whatsapp} />
      </div>
    </CartProvider>
  );
}
