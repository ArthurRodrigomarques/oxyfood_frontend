"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RestaurantHeader } from "@/components/restaurant-header";
import { CategoryList } from "@/components/category-list";
import { ProductItem } from "@/components/product-item";
import { Loader2 } from "lucide-react";
import { RestaurantData } from "@/data/mock-restaurant";

interface RestaurantResponse {
  restaurant: RestaurantData;
}

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["restaurant-public", slug],
    queryFn: async () => {
      const response = await api.get<RestaurantResponse>(
        `/restaurants/${slug}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.restaurant) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Restaurante não encontrado :(</h1>
        <p className="text-muted-foreground">
          Verifique o endereço e tente novamente.
        </p>
      </div>
    );
  }

  const { restaurant } = data;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cabeçalho com infos da loja e Carrinho */}
      <RestaurantHeader restaurant={restaurant} />

      {/* Navegação de Categorias */}
      <CategoryList restaurant={restaurant} />

      {/* Lista de Produtos por Categoria */}
      <main className="container mx-auto px-4 py-6 space-y-10 max-w-6xl">
        {restaurant.categories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-32">
            <h2 className="text-xl font-bold mb-4">{category.name}</h2>

            {category.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhum produto nesta categoria.
              </p>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
