export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "X-Burger Duplo",
    description:
      "Dois hambúrgueres artesanais de 150g, queijo cheddar, alface, tomate e molho especial",
    price: 28.9,
    category: "lanches",
    image: "https://placehold.co/600x400/FF5733/FFFFFF?text=X-Burger",
    available: true,
  },
  {
    id: "2",
    name: "X-Bacon Premium",
    description:
      "Hambúrguer artesanal 200g, bacon crocante, queijo, cebola caramelizada",
    price: 32.9,
    category: "lanches",
    image: "https://placehold.co/600x400/E67E22/FFFFFF?text=X-Bacon",
    available: true,
  },
  {
    id: "3",
    name: "Veggie Burger",
    description:
      "Hambúrguer de grão-de-bico e quinoa, queijo vegano, rúcula e tomate seco",
    price: 26.9,
    category: "lanches",
    image: "https://placehold.co/600x400/27AE60/FFFFFF?text=Veggie",
    available: true,
  },
  {
    id: "4",
    name: "Pizza Margherita",
    description:
      "Molho de tomate, mussarela de búfala, manjericão fresco e azeite",
    price: 45.9,
    category: "pizzas",
    image: "https://placehold.co/600x400/C0392B/FFFFFF?text=Pizza",
    available: true,
  },
  {
    id: "5",
    name: "Pizza Calabresa",
    description: "Calabresa artesanal, cebola, azeitonas e mussarela",
    price: 48.9,
    category: "pizzas",
    image: "https://placehold.co/600x400/D35400/FFFFFF?text=Calabresa",
    available: true,
  },
  {
    id: "6",
    name: "Coca-Cola Lata",
    description: "Refrigerante 350ml gelado",
    price: 5.0,
    category: "bebidas",
    image: "https://placehold.co/600x400/4F4F4F/FFFFFF?text=Coca",
    available: true,
  },
  {
    id: "7",
    name: "Suco Natural",
    description: "Laranja, limão ou morango - 500ml",
    price: 8.9,
    category: "bebidas",
    image: "https://placehold.co/600x400/F1C40F/FFFFFF?text=Suco",
    available: true,
  },
  {
    id: "8",
    name: "Brownie Artesanal",
    description: "Brownie de chocolate belga com nozes",
    price: 12.9,
    category: "sobremesas",
    image: "https://placehold.co/600x400/8E44AD/FFFFFF?text=Brownie",
    available: true,
  },
];
