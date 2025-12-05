"use client";

import { RestaurantData } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Menu, Store } from "lucide-react";
import { CheckoutSheet } from "@/components/checkout-sheet";
import Image from "next/image";

interface RestaurantHeaderProps {
  restaurant: RestaurantData;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <header className="p-4 shadow-sm bg-white border-b relative">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" className="sm:hidden -ml-2">
            <Menu className="h-5 w-5" />
          </Button>

          {/* LOGO DA LOJA */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-md bg-gray-50">
            {restaurant.logoUrl && !restaurant.logoUrl.includes("imgur.com") ? (
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100px, 150px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-orange-200">
                <Store className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate max-w-[200px] sm:max-w-none">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full animate-pulse ${
                    restaurant.isOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={
                    restaurant.isOpen
                      ? "text-green-700 font-medium"
                      : "text-red-700 font-medium"
                  }
                >
                  {restaurant.isOpen ? "Aberto agora" : "Fechado"}
                </span>
              </div>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="truncate max-w-[150px] sm:max-w-md">
                {restaurant.addressText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckoutSheet restaurant={restaurant} />
        </div>
      </div>
    </header>
  );
}
