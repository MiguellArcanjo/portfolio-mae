import type { Metadata, Viewport } from "next";
import { Baloo_2, Caveat, Lobster } from "next/font/google";
import "./globals.css";

const lobster = Lobster({ weight: "400", subsets: ["latin"], variable: "--font-lobster" });
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: {
    default: "Bárbara Delivery — Sabor e qualidade em cada pedido",
    template: "%s · Bárbara Delivery",
  },
  description:
    "Cachorro-quente, milho no pote, batata recheada, caldinhos, pudim e mungunzá. Comida caseira feita com amor, com delivery rápido. Peça pelo WhatsApp!",
};

export const viewport: Viewport = {
  themeColor: "#ffc21a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${lobster.variable} ${baloo.variable} ${caveat.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
