"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/auth-store";

export function RestaurantSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { user, activeRestaurantId, setRestaurant } = useAuthStore();

  const formattedRestaurants =
    user?.restaurants?.map((restaurant) => ({
      label: restaurant.name,
      value: restaurant.id,
    })) || [];

  const activeRestaurant = formattedRestaurants.find(
    (restaurant) => restaurant.value === activeRestaurantId
  );

  const onSelectRestaurant = (value: string) => {
    setRestaurant(value);
    setOpen(false);
  };

  if (!user?.restaurants || user.restaurants.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 font-semibold text-gray-700 border rounded-md bg-gray-50/50">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-white">
          <Store className="h-4 w-4 text-orange-500" />
        </div>
        <span className="truncate text-sm">
          {activeRestaurant?.label || "Meu Restaurante"}
        </span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 h-12 border-dashed"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100">
              <Store className="h-3.5 w-3.5 text-orange-600" />
            </div>
            <span className="truncate max-w-[140px]">
              {activeRestaurant?.label || "Selecione..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Buscar restaurante..." />
            <CommandEmpty>Nenhum restaurante encontrado.</CommandEmpty>
            <CommandGroup heading="Restaurantes">
              {formattedRestaurants.map((restaurant) => (
                <CommandItem
                  key={restaurant.value}
                  onSelect={() => onSelectRestaurant(restaurant.value)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                  {restaurant.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      activeRestaurantId === restaurant.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
