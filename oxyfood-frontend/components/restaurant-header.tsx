"use client";

import { RestaurantData } from "@/data/mock-restaurant";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { CheckoutSheet } from "@/components/checkout-sheet";

interface RestaurantHeaderProps {
  restaurant: RestaurantData;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <header className="p-4 shadow-md sticky top-0 bg-background z-10 border-b">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="sm:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold truncate max-w-[200px] sm:max-w-none">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  restaurant.isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>{restaurant.isOpen ? "Aberto" : "Fechado"}</span>
              <span className="hidden sm:inline">
                • {restaurant.addressText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckoutSheet restaurant={restaurant} />

          <Button size="icon" variant="ghost" className="hidden sm:flex">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
