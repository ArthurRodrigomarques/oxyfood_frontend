export interface Option {
  id: string;
  name: string;
  priceDelta: string;
  groupId: string;
}

export interface OptionGroup {
  id: string;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  minSelection: number;
  maxSelection: number;
  options: Option[];
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  categoryId: string;
  optionGroups: OptionGroup[];
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
  products: Product[];
}

export interface RestaurantData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  addressText: string;
  address: string;
  phoneNumber: string;
  isOpen: boolean;
  deliveryFee: string;
  freeDeliveryAbove: string | null;
  description: string | null;
  rating: number | null;
  categories: Category[];
}

export const mockRestaurant: { restaurant: RestaurantData } = {
  restaurant: {
    id: "4fce2fd8-40f5-4a70-b922-32999bb50c3f",
    name: "OxyFood",
    slug: "hamburgueria-do-ze",
    logoUrl: "https://imgur.com/logo.png",
    bannerUrl: "https://placehold.co/1200x400/orange/white?text=OxyFood+Banner",
    addressText: "Hamburgueria Artesanal",
    address: "Rua das Flores, 123 - Centro, São Paulo - SP",
    phoneNumber: "13999998888",
    isOpen: true,
    deliveryFee: "5",
    freeDeliveryAbove: "100",
    description:
      "A melhor hamburgueria da cidade, com ingredientes frescos e receitas artesanais únicas.",
    rating: 4.8,
    categories: [
      {
        id: "c27d9746-e614-402c-9c90-b47a799d3866",
        name: "Lanches",
        restaurantId: "4fce2fd8-40f5-4a70-b922-32999bb50c3f",
        products: [
          {
            id: "b5dde3e4-9481-43b5-8386-29626527c73c",
            name: "X-Burger Duplo",
            description:
              "Dois hambúrgueres de 150g, queijo cheddar, alface, tomate e molho especial",
            basePrice: "28.90",
            imageUrl: "/hamburguer.jpg",
            categoryId: "c27d9746-e614-402c-9c90-b47a799d3866",
            optionGroups: [
              {
                id: "001495bc-320d-4655-850d-1e18dc9a9a05",
                name: "Adicionais",
                type: "MULTIPLE",
                minSelection: 0,
                maxSelection: 5,
                options: [
                  {
                    id: "fd66b79d-d1a0-4345-84f8-1970735e5f18",
                    name: "Bacon Extra",
                    priceDelta: "3.5",
                    groupId: "001495bc-320d-4655-850d-1e18dc9a9a05",
                  },
                  {
                    id: "b1a2c3d4-e5f6-7890-1234-567890abcdef",
                    name: "Ovo",
                    priceDelta: "2.0",
                    groupId: "001495bc-320d-4655-850d-1e18dc9a9a05",
                  },
                ],
              },
              {
                id: "a9b8c7d6-e5f4-3210-9876-543210fedcba",
                name: "Ponto da Carne",
                type: "SINGLE",
                minSelection: 1,
                maxSelection: 1,
                options: [
                  {
                    id: "f1e2d3c4-b5a6-7890-1234-abcdef567890",
                    name: "Mal Passado",
                    priceDelta: "0",
                    groupId: "a9b8c7d6-e5f4-3210-9876-543210fedcba",
                  },
                  {
                    id: "g1h2i3j4-k5l6-7890-1234-lmnopqrstuv",
                    name: "Ao Ponto",
                    priceDelta: "0",
                    groupId: "a9b8c7d6-e5f4-3210-9876-543210fedcba",
                  },
                ],
              },
            ],
          },
          {
            id: "b5dde3e4-9481-43b5-8386-29626527c73d",
            name: "X-Bacon Premium",
            description:
              "Hambúrguer artesanal 200g, bacon crocante, queijo, cebola caramelizada",
            basePrice: "32.90",
            imageUrl: "/hamburguer.jpg",
            categoryId: "c27d9746-e614-402c-9c90-b47a799d3866",
            optionGroups: [],
          },
        ],
      },
      {
        id: "d38e0857-f70a-407b-9c60-c58b800d48b1",
        name: "Bebidas",
        restaurantId: "4fce2fd8-40f5-4a70-b922-32999bb50c3f",
        products: [
          {
            id: "e49f1968-g81b-518c-a0b7-d69c911e59c2",
            name: "Coca-Cola Lata",
            description: "350ml, gelada.",
            basePrice: "6.0",
            imageUrl: "/hamburguer.jpg",
            categoryId: "d38e0857-f70a-407b-9c60-c58b800d48b1",
            optionGroups: [],
          },
        ],
      },
      {
        id: "c27d9746-e614-402c-9c90-b47a799d3867",
        name: "Sobremesas",
        restaurantId: "4fce2fd8-40f5-4a70-b922-32999bb50c3f",
        products: [],
      },
      {
        id: "c27d9746-e614-402c-9c90-b47a799d3868",
        name: "Pizzas",
        restaurantId: "4fce2fd8-40f5-4a70-b922-32999bb50c3f",
        products: [],
      },
    ],
  },
};
