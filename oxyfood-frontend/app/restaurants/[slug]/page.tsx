import { mockRestaurant } from "@/data/mock-restaurant";
import { RestaurantHeader } from "@/components/restaurant-header";
import { CategoryList } from "@/components/category-list";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductItem } from "@/components/product-item";
import { ProductCard } from "@/components/product-card";

export default function RestaurantPage() {
  const { restaurant } = mockRestaurant;

  const lanches = restaurant.categories.find((c) => c.name === "Lanches");
  const bebidas = restaurant.categories.find((c) => c.name === "Bebidas");
  const destaques = lanches;

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <RestaurantHeader restaurant={restaurant} />

      <div className="bg-primary text-primary-foreground text-center text-sm p-2 font-medium">
        🚚 Entrega Grátis acima de R$ 30!
      </div>

      <div className="container mx-auto max-w-6xl p-4">
        <div className="relative">
          <Input placeholder="Buscar produtos..." className="pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        <CategoryList restaurant={restaurant} />

        {destaques && (
          <section className="mt-6">
            <h2 className="text-xl font-bold tracking-tight mb-4">
              ⭐ Destaques
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {destaques.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <Separator className="my-6" />

        <main>
          {lanches && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                🍔 {lanches.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lanches.products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {bebidas && (
            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold tracking-tight">
                🥤 {bebidas.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bebidas.products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
