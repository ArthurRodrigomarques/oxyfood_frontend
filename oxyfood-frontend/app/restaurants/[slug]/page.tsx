"use client";

import { use, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RestaurantHeader } from "@/components/restaurant-header";
import { CategoryList } from "@/components/category-list";
import { ProductItem } from "@/components/product-item";
import { Loader2, Search, X, Star, Megaphone, TrendingUp } from "lucide-react";
import { RestaurantData } from "@/data/mock-restaurant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface RestaurantResponse {
  restaurant: RestaurantData;
}

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["restaurant-public", slug],
    queryFn: async () => {
      const response = await api.get<RestaurantResponse>(
        `/restaurants/${slug}`
      );
      return response.data;
    },
  });

  const filteredCategories = useMemo(() => {
    if (!data?.restaurant) return [];
    if (!searchQuery) return data.restaurant.categories;

    const lowerQuery = searchQuery.toLowerCase();

    return data.restaurant.categories
      .map((category) => ({
        ...category,
        products: category.products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            (product.description &&
              product.description.toLowerCase().includes(lowerQuery))
        ),
      }))
      .filter((category) => category.products.length > 0);
  }, [data, searchQuery]);

  const highlights = data?.restaurant.categories[0]?.products.slice(0, 2) || [];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError || !data?.restaurant) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Restaurante não encontrado :(</h1>
      </div>
    );
  }

  const { restaurant } = data;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* 1. BARRA DE AVISO LARANJA */}
      <div className="bg-orange-500 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
        <Megaphone className="h-4 w-4" />
        <span>Entrega Grátis acima de R$ 30!</span>
      </div>

      <RestaurantHeader restaurant={restaurant} />

      {/* 2. BUSCA E CATEGORIAS */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 rounded-lg text-base shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!searchQuery && <CategoryList restaurant={restaurant} />}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-10">
        {/* 3. SEÇÃO DE DESTAQUES */}
        {!searchQuery && highlights.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-orange-500 fill-orange-500" />
              <h2 className="text-xl font-bold text-gray-800">Destaques</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((product) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-48 sm:h-56"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={product.imageUrl || "/hamburguer.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white w-full">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 shadow-black drop-shadow-md">
                      {product.name}
                    </h3>
                    <p className="text-orange-400 font-extrabold text-lg">
                      {formatCurrency(product.basePrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. LISTA DE PRODUTOS (Mais Pedidos) */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-48"
            >
              <div className="flex items-center gap-2 mb-4">
                {category.name === "Lanches" ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : null}
                <h2 className="text-xl font-bold text-gray-800">
                  {category.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {category.products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Nenhum item encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
}
