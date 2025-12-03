"use client";

import { Product } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleAvailability: (productId: string, currentStatus: boolean) => void;
}

export function ProductItem({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ProductItemProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "lanches":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "pizzas":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "bebidas":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors shadow-sm">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={product.image || "/hamburguer.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Informações */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg truncate">{product.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center gap-3 pt-1">
          <Badge
            variant="secondary"
            className={`border-none ${getCategoryColor(product.category)}`}
          >
            {product.category}
          </Badge>
          <span className="font-bold text-orange-600 text-lg">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Ações (Direita) */}
      <div className="flex items-center gap-6 self-end sm:self-center ml-auto mt-2 sm:mt-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Disponível
          </span>
          <Switch
            checked={product.available}
            onCheckedChange={() =>
              onToggleAvailability(product.id, product.available)
            }
            className="data-[state=checked]:bg-orange-500"
          />
        </div>

        <div className="flex items-center gap-1 border-l pl-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(product)}
            className="hover:text-orange-500"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product)}
            className="hover:text-red-500 text-muted-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
