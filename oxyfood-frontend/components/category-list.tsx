"use client";

import { useState } from "react";
import { RestaurantData } from "@/data/mock-restaurant";
import { Button } from "@/components/ui/button";

const categoryIcons: { [key: string]: string } = {
  Lanches: "🍔",
  Pizzas: "🍕",
  Bebidas: "🥤",
  Sobremesas: "🍨",
};

interface CategoryListProps {
  restaurant: RestaurantData;
}

export function CategoryList({ restaurant }: CategoryListProps) {
  const [activeCategory, setActiveCategory] = useState(
    restaurant.categories[0]?.id || ""
  );

  return (
    <nav className="p-4 container mx-auto max-w-6xl">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {restaurant.categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className="shrink-0"
            onClick={() => setActiveCategory(category.id)}
          >
            {categoryIcons[category.name] || "🍽️"}
            {category.name}
          </Button>
        ))}
      </div>
    </nav>
  );
}
