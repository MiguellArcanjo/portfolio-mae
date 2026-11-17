import type { DB, Product } from "./types";

const IMG = "/images/cardapio/";

/** Atalho para montar os produtos do cardápio. */
function p(
  id: string,
  name: string,
  categoryId: string,
  emoji: string,
  description: string,
  extra: Partial<Product> = {},
): Product {
  return {
    id,
    name,
    description,
    categoryId,
    image: "",
    emoji,
    tags: [],
    badge: "",
    featured: false,
    available: true,
    order: 0,
    ...extra,
  };
}

const products: Product[] = [
  // Pães
  p("pao-frances-queijo", "Pão Francês com Queijo Ralado", "paes", "🥖", "Pãozinho dourado e macio, coberto com queijo ralado gratinado. Sai quentinho do forno.", {
    image: IMG + "pao-frances-queijo.jpg",
    tags: ["Queijo ralado"],
    badge: "Fresquinho",
    featured: true,
  }),
  p("pao-doce", "Pão Doce", "paes", "🍞", "Pão fofinho e levemente adocicado, perfeito para o café da tarde.", { image: IMG + "pao-doce.jpg" }),
  p("pao-hotdog", "Pão de Hot Dog", "paes", "🌭", "Pão macio no formato certinho para o seu cachorro-quente em casa.", { image: IMG + "pao-hotdog.jpg" }),
  p("pao-hamburguer", "Pão de Hambúrguer", "paes", "🍔", "Pão de hambúrguer fofinho, ideal para montar seus lanches.", { image: IMG + "pao-hamburguer.jpg" }),

  // Salgados
  p("salgadinho-queijo-catupiry", "Salgadinho de Queijo (Catupiry)", "salgados", "🧀", "Salgadinho de queijo dourado, crocante por fora e cremoso por dentro, recheado com catupiry.", {
    image: IMG + "salgadinho-queijo-catupiry.jpg",
    tags: ["Queijo", "Catupiry"],
    badge: "Da casa",
    featured: true,
  }),
  p("salgadinho-queijo-cebolinha", "Salgadinho de Queijo (Cebolinha)", "salgados", "🧀", "Salgadinho de queijo sequinho e crocante, com um toque de cebolinha. Ótimo para beliscar.", {
    image: IMG + "salgadinho-queijo-cebolinha.webp",
    tags: ["Queijo", "Cebolinha"],
    featured: true,
  }),
  p("mini-pizza", "Mini Pizza", "salgados", "🍕", "Mini pizza caseira de massa fofinha, molho de tomate, presunto em cubinhos e queijo derretido.", {
    image: IMG + "mini-pizza.jpg",
    tags: ["Presunto", "Queijo", "Molho de tomate"],
    badge: "Novo",
  }),
  p("cachorro-quente", "Cachorro-quente", "salgados", "🌭", "Pão macio, salsicha, molho caseiro, queijo ralado e muita batata palha.", {
    image: IMG + "cachorro-quente.jpg",
    tags: ["Salsicha", "Batata palha"],
    badge: "Mais pedido",
  }),

  // Doces
  p("sonho", "Sonho de Padaria", "doces", "🍩", "Massa fofinha, recheio cremoso generoso e açúcar por cima. Clássico de padaria!", {
    image: IMG + "sonho.webp",
    tags: ["Creme"],
    badge: "Queridinho",
    featured: true,
  }),
  p("rosca-doce", "Rosca Doce", "doces", "🍩", "Rosca fofinha e dourada, passada no açúcar. Ótima com um cafezinho.", {
    image: IMG + "rosca-doce.jpg",
    tags: ["Açúcar"],
  }),
  p("pudim", "Pudim", "doces", "🍮", "Lisinho, sem furinhos, com calda de caramelo dourada. Receita de família.", {
    image: IMG + "pudim.webp",
    tags: ["Leite condensado", "Caramelo"],
    featured: true,
  }),

  // Bolos
  p("bolo-queijo", "Bolo de Queijo", "bolos", "🧀", "Bolo caseiro de queijo, macio e com aquele sabor nordestino.", { image: IMG + "bolo-queijo.jpg" }),
  p("bolo-milho", "Bolo de Milho", "bolos", "🌽", "Bolo de milho cremoso e cheiroso, do jeitinho de vó.", { image: IMG + "bolo-milho.jpg" }),
  p("bolo-frutas-cristalizadas", "Bolo de Frutas Cristalizadas", "bolos", "🍰", "Bolo fofinho recheado de frutas cristalizadas.", { image: IMG + "bolo-frutas-cristalizadas.webp" }),
  p("bolo-formigueiro", "Bolo Formigueiro", "bolos", "🍫", "Bolo fofinho salpicado de chocolate granulado.", { image: IMG + "bolo-formigueiro.jpg" }),
  p("mini-bolo-pernambuco", "Mini Bolo Pernambuco", "bolos", "🧁", "Mini bolo pernambucano com cobertura decorada, na medida para uma pessoa. Ótimo para presentear.", { image: IMG + "mini-bolo-pernambuco.jpg" }),

  // Especiais
  p("panetone", "Panetone", "especiais", "🎄", "Panetone fofinho e perfumado, recheado com frutas cristalizadas e uvas-passas.", {
    image: IMG + "panetone.webp",
    tags: ["Frutas cristalizadas", "Uva-passa"],
    badge: "Natal",
    featured: true,
  }),
  p("panetone-trufado", "Panetone Trufado", "especiais", "🍫", "Panetone fofinho recheado com trufa cremosa e cobertura de chocolate escorrendo, com crocante por cima. Perfeito para presentear.", {
    image: IMG + "panetone-trufado.webp",
    tags: ["Trufado", "Chocolate", "Cobertura"],
    badge: "Novo",
    featured: true,
  }),
];

// ordem dentro de cada categoria segue a lista acima
const counters: Record<string, number> = {};
for (const prod of products) prod.order = counters[prod.categoryId] = (counters[prod.categoryId] ?? 0) + 1;

export const content: DB = {
  settings: {
    brandName: "Bárbara Delivery",
    slogan: "Sabor e qualidade em cada pedido!",
    heroTitle: "O sabor da tradição que abraça",
    heroSubtitle:
      "Pães, bolos, salgados e doces caseiros feitos com muito carinho, do jeitinho de casa — direto pra sua porta.",
    rotatingWords: ["Sonho", "Pão quentinho", "Bolo de milho", "Salgadinho", "Pudim", "Panetone"],
    aboutTitle: "Feito com amor, servido com carinho",
    aboutText:
      "Tudo começou na cozinha de casa, com receitas de família e muita vontade de fazer gente feliz. Hoje, cada pedido que sai daqui leva o mesmo cuidado: ingredientes fresquinhos, massa feita na hora e aquele sabor que lembra a comida de vó.\n\nDo pãozinho com queijo ralado ao sonho recheado, do bolo de milho ao pudim lisinho — é tudo preparado com amor.",
    aboutImage: "/images/barbara.webp",
    heroImage: "/images/barbara.webp",
    whatsapp: "5583988201418",
    whatsappDisplay: "(83) 98820-1418",
    instagram: "barbara.delivery83",
    address: "Av. Maria Feitosa, 366 — Alto da Boa Vista, Bayeux - PB, 58113-070",
    hours: "Todos os dias, das 17h às 23h",
    deliveryNote: "Delivery rápido! Consulte a taxa para o seu bairro.",
    marquee: ["Pães fresquinhos", "Bolos caseiros", "Sonho de padaria", "Salgadinho de queijo", "Pudim", "Panetone", "Feito com amor"],
    stats: [
      { label: "receitas da casa", value: products.length, suffix: "" },
    ],
  },
  categories: [
    { id: "paes", name: "Pães", emoji: "🥖", order: 1 },
    { id: "salgados", name: "Salgados", emoji: "🧀", order: 2 },
    { id: "doces", name: "Doces", emoji: "🍩", order: 3 },
    { id: "bolos", name: "Bolos", emoji: "🍰", order: 4 },
    { id: "especiais", name: "Especiais", emoji: "🎄", order: 5 },
  ],
  products,
  testimonials: [
    { id: "t1", name: "Gustavo L.", text: "O salgadinho de queijo com catupiry é viciante! Pedi uma bandeja e já quero outra.", rating: 5, visible: false },
    { id: "t2", name: "Ana Paula", text: "Sonho fofinho e cheio de recheio, igualzinho ao de padaria antiga. ❤️", rating: 5, visible: false },
    { id: "t3", name: "Rafael M.", text: "Pudim perfeito, igual ao da minha avó. Já virei cliente fiel!", rating: 5, visible: false },
    { id: "t4", name: "Juliana S.", text: "Bolo de milho cremoso e cheiroso, chegou quentinho. Entrega rapidinha!", rating: 5, visible: false },
  ],
};
