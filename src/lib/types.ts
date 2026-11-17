export type Stat = { label: string; value: number; suffix: string };

export type Settings = {
  brandName: string;
  slogan: string;
  heroTitle: string;
  heroSubtitle: string;
  rotatingWords: string[];
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  heroImage: string;
  whatsapp: string; // somente dígitos com DDI, ex: 5583988201418
  whatsappDisplay: string;
  instagram: string; // usuário sem @
  address: string;
  hours: string;
  deliveryNote: string;
  marquee: string[];
  stats: Stat[];
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  order: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image: string;
  emoji: string;
  tags: string[];
  badge: string;
  featured: boolean;
  available: boolean;
  order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number;
  visible: boolean;
};

export type DB = {
  settings: Settings;
  categories: Category[];
  products: Product[];
  testimonials: Testimonial[];
};
