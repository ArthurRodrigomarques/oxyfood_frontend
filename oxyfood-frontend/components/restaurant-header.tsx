import { RestaurantData } from "@/data/mock-restaurant";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";

interface RestaurantHeaderProps {
  restaurant: RestaurantData;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <header className="p-4 shadow-md sticky top-0 bg-background z-10">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="sm:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{restaurant.name}</h1>
            <p className="text-sm text-muted-foreground">
              {restaurant.addressText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="hidden sm:flex">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
