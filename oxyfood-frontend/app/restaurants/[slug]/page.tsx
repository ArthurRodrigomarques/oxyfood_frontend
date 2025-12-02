import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RestaurantHeader } from "@/components/restaurant-header";
import { CategoryList } from "@/components/category-list";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductItem } from "@/components/product-item";
import { ProductCard } from "@/components/product-card";
import { api } from "@/lib/api";
import { RestaurantData } from "@/data/mock-restaurant";

export default function RestaurantPage() {
  const { restaurant } = mockRestaurant;

  // Organização das categorias para exibição
  const lanches = restaurant.categories.find((c) => c.name === "Lanches");
  const bebidas = restaurant.categories.find((c) => c.name === "Bebidas");
  const destaques = lanches; // Regra de negócio temporária para destaques

  return (
    <div className="bg-background text-foreground min-h-screen">
      <RestaurantHeader restaurant={restaurant} />

      <div className="bg-primary text-primary-foreground text-center text-sm p-2 font-medium">
        🚚 Entrega Grátis acima de R$ {Number(restaurant.deliveryFee || 0) * 6}!
      </div>

      <div className="container mx-auto max-w-6xl p-4">
        {/* Barra de Busca e Filtros */}
        <div className="relative mb-6">
          <Input placeholder="Buscar produtos..." className="pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        <CategoryList restaurant={restaurant} />

        {/* Seção de Destaques */}
        {destaques && destaques.products.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">
              ⭐ Destaques
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {destaques.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <Separator className="my-8" />

        <main className="space-y-10">
          {lanches && lanches.products.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                🍔 {lanches.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {lanches.products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {bebidas && bebidas.products.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                🥤 {bebidas.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {bebidas.products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {restaurant.categories
            .filter((c) => c.name !== "Lanches" && c.name !== "Bebidas")
            .map(
              (category) =>
                category.products.length > 0 && (
                  <section key={category.id} className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                      🍽️ {category.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {category.products.map((product) => (
                        <ProductItem key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )
            )}
        </main>
      </div>
    </div>
  );
}
