// Product Data - Centralized product information
export interface ProductIngredients {
  main: string;
  complement: string;
}

export interface Product {
  name: string;
  type: 'baunilha' | 'parmesao';
  description: string;
  price: string;
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
    ingredients: {
      main: "farinha de trigo enriquecida com ferro e ácido fólico, açúcar refinado, manteiga sem sal (leite), ovos, essência de baunilha",
      complement: "trigo, leite e ovos"
    },
    insidePackageDescription: "Em média 13 biscoitos, e sempre um de dinossauro.",
    nutritionalTable: "/products/baunilha_nutritional_values.jpeg",
    frontLabel: "/products/baunilha_front_label.jpeg",
    image: "/products/baunilha_package.png",
    images: [
      "/products/baunilha_package.png",
      "/biscuits/biscoidino_biscuit1.png",
      "/biscuits/flower_baunilha1.png", 
      "/biscuits/heart_baunilha1.png",
      "/biscuits/star_baunilha1.png",
      "/biscuits/flower_baunilha2.png",
      "/biscuits/heart_baunilha2.png",
      "/products/baunilha_biscuits.png"
    ]
  },
  {
    name: "PARMESÃO",
    type: "parmesao",
    description: "Biscoitos salgados crocantes com queijo parmesão premium (150g)",
    price: "R$ 15,00",
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
  }
];
