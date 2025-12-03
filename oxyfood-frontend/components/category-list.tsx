"use client";

import { RestaurantData } from "@/data/mock-restaurant";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Pizza, Coffee, IceCream, Sandwich, Utensils } from "lucide-react";

interface CategoryListProps {
  restaurant: RestaurantData;
}

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("lanche") || lower.includes("burger"))
    return <Sandwich className="h-4 w-4" />;
  if (lower.includes("pizza")) return <Pizza className="h-4 w-4" />;
  if (lower.includes("bebida") || lower.includes("suco"))
    return <Coffee className="h-4 w-4" />;
  if (lower.includes("sobremesa") || lower.includes("doce"))
    return <IceCream className="h-4 w-4" />;
  return <Utensils className="h-4 w-4" />;
};

export function CategoryList({ restaurant }: CategoryListProps) {
  const [activeCategory, setActiveCategory] = useState<string>("");

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 220;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveCategory(categoryId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = 250;
      const currentPos = window.scrollY + offset;
      let currentId = "";
      restaurant.categories.forEach((cat) => {
        const element = document.getElementById(cat.id);
        if (element && element.offsetTop <= currentPos) {
          currentId = cat.id;
        }
      });
      if (currentId !== activeCategory) setActiveCategory(currentId);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [restaurant.categories, activeCategory]);

  if (restaurant.categories.length === 0) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-3 pb-2 pt-1">
        {restaurant.categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 border shadow-sm",
                isActive
                  ? "bg-orange-500 text-white border-orange-500 shadow-orange-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              )}
            >
              {getCategoryIcon(category.name)}
              {category.name}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
