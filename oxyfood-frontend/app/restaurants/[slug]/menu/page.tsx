"use client";

import { use, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MenuProductItem } from "@/components/menu-product-item";
import {
  Loader2,
  Search,
  UtensilsCrossed,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { RestaurantData } from "@/types/order";

interface RestaurantResponse {
  restaurant: RestaurantData;
}

export default function DigitalMenuPage({
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
        <h1 className="text-2xl font-bold">Cardápio indisponível :(</h1>
      </div>
    );
  }

  const { restaurant } = data;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-10">
      <div className="bg-black text-white text-center py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50">
        <UtensilsCrossed className="h-4 w-4" />
        <span>Cardápio Digital - Mesa</span>
      </div>

      <div className="relative w-full h-40 sm:h-52 bg-gray-900">
        {restaurant.bannerUrl ? (
          <Image
            src={restaurant.bannerUrl}
            alt="Banner"
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900" />
        )}
      </div>

      <div className="container max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
            {restaurant.logoUrl ? (
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold text-2xl">
                {restaurant.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {restaurant.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-600">
              {restaurant.rating && (
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                {restaurant.isOpen ? (
                  <span className="text-green-600 font-bold">Aberto agora</span>
                ) : (
                  <span className="text-red-500 font-bold">Fechado</span>
                )}
              </div>
            </div>

            {restaurant.description && (
              <p className="text-gray-500 text-sm max-w-lg mx-auto md:mx-0">
                {restaurant.description}
              </p>
            )}

            {restaurant.addressText && (
              <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-gray-400 mt-2">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{restaurant.addressText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 mt-8 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar no cardápio..."
            className="pl-12 h-12 bg-white border-gray-200 shadow-sm rounded-xl text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-4xl space-y-10">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <section key={category.id}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full block"></span>
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.products.map((product) => (
                  <MenuProductItem key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex bg-gray-100 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Nenhum item encontrado.</p>
          </div>
        )}
      </main>

      <footer className="text-center py-10 px-4 mt-8 border-t border-gray-200 bg-white">
        <p className="text-gray-400 text-sm font-medium">
          {restaurant.name} • Cardápio Digital
        </p>
      </footer>
    </div>
  );
}
