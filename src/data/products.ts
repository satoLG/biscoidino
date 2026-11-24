// Product Data - Centralized product information
export interface ProductIngredients {
  main: string;
  complement: string;
}

export interface Product {
  name: string;
  type: 'baunilha' | 'parmesao' | 'cafe_cacau';
  description: string;
  price: string; // texto exibido; atualizado a partir de priceCents
  priceCents: number; // fallback; a API sobrescreve
  id?: string; // uuid na API (necessário para o pedido)
  available: boolean; // false quando a API não lista o produto (inativo)
  ingredients: ProductIngredients;
  insidePackageDescription: string;
  nutritionalTable: string;
  frontLabel: string;
  image: string;
  images: string[];
}

export const products: Product[] = [
  {
    name: "BAUNILHA",
    type: "baunilha",
    description: "Deliciosos biscoitos artesanais com sabor suave de baunilha (150g)",
    price: "R$ 15,00",
    priceCents: 1500,
    available: true,
    ingredients: {
      main: "farinha de trigo enriquecida com ferro e ácido fólico, açúcar refinado, manteiga sem sal (leite), ovos, essência de baunilha",
      complement: "trigo, leite e ovos"
    },
    insidePackageDescription: "Em média 13 biscoitos, e sempre um de dinossauro.",
    nutritionalTable: "/products/baunilha_nutritional_values.jpeg",
    frontLabel: "/products/baunilha_front_label.jpeg",
    image: "/products/baunilha_package.png",
    images: [
      "/biscuits/biscoidino_biscuit1.png",
      "/products/baunilha_package.png",
      "/products/baunilha_biscuits.png"
    ]
  },
  {
    name: "PARMESÃO",
    type: "parmesao",
    description: "Biscoitos salgados crocantes com queijo parmesão premium (150g)",
    price: "R$ 15,00",
    priceCents: 1500,
    available: true,
    ingredients: {
      main: "farinha de trigo enriquecida com ferro e ácido fólico, manteiga com sal (leite), queijo ralado (leite), gemas de ovo",
      complement: "trigo, leite e ovos"
    },
    insidePackageDescription: "Em média 20 biscoitos, mas sem dinossauros por aqui.",
    nutritionalTable: "/products/parmesao_nutritional_values.jpeg",
    frontLabel: "/products/parmesao_front_label.jpeg",
    image: "/products/parmesao_biscuit_package1.png",
    images: [
      "/products/parmesao_biscuit_package1.png",
      "/products/parmesao_biscuit_package2.png",
      "/products/parmesao_biscuits.png"
    ]
  },
  {
    name: "CAFÉ & CACAU",
    type: "cafe_cacau",
    description: "Deliciosos biscoitos artesanais com sabor de café e cacau (150g)",
    price: "R$ 15,00",
    priceCents: 1500,
    available: true,
    ingredients: {
      main: "farinha de trigo enriquecida com ferro e ácido fólico, açúcar refinado, manteiga sem sal, ovos, café solúvel diluído em água quente, cacau em pó 100%, sal",
      complement: "trigo, leite e ovos"
    },
    insidePackageDescription: "Em média 13 biscoitos, e sempre um de dinossauro.",
    nutritionalTable: "/products/coffee_nutritional_values.jpeg",
    frontLabel: "/products/coffee_front_label.jpeg",
    image: "/products/coffee_package.png",
    images: [
      "/biscuits/biscoidino_coffee_biscuit1.png",
      "/products/coffee_package.png",
      "/products/coffee_biscuits1.png",
      "/products/coffee_biscuits2.png"
    ]
  },
];

/** Aplica preço, id e disponibilidade da API sobre os produtos locais (por slug = type). */
export function applyCatalog(
  apiProducts: { id: string; slug: string; price_cents: number }[],
  format: (cents: number) => string,
): void {
  const bySlug = new Map(apiProducts.map((p) => [p.slug, p]));
  for (const product of products) {
    const api = bySlug.get(product.type);
    product.available = api !== undefined;
    if (api) {
      product.id = api.id;
      product.priceCents = api.price_cents;
      product.price = format(api.price_cents);
    }
  }
}
