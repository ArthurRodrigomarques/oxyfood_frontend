"use client";

import { FrontendProduct } from "./menu-management";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Layers } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface ProductItemProps {
  product: FrontendProduct;
  onEdit: (product: FrontendProduct) => void;
  onDelete: (product: FrontendProduct) => void;
  onManageOptions: (product: FrontendProduct) => void;
  onToggleAvailability: (productId: string, currentStatus: boolean) => void;
}

export function ProductItem({
  product,
  onEdit,
  onDelete,
  onManageOptions,
  onToggleAvailability,
}: ProductItemProps) {
  const getCategoryColor = (cat: string) => {
    const lowerCat = cat.toLowerCase();

    if (lowerCat.includes("lanche") || lowerCat.includes("burger")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (lowerCat.includes("pizza")) {
      return "bg-orange-100 text-orange-800 border-orange-200";
    }
    if (lowerCat.includes("bebida") || lowerCat.includes("suco")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (lowerCat.includes("sobremesa") || lowerCat.includes("doce")) {
      return "bg-pink-100 text-pink-800 border-pink-200";
    }

    return "bg-gray-100 text-gray-800 border-gray-200";
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
          <h3 className="font-bold text-lg truncate text-gray-800">
            {product.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center gap-3 pt-1">
          <Badge
            variant="secondary"
            className={`border ${getCategoryColor(product.category)}`}
          >
            {product.category}
          </Badge>
          <span className="font-bold text-orange-600 text-lg">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>

      {/* Ações*/}
      <div className="flex items-center gap-4 self-end sm:self-center ml-auto mt-2 sm:mt-0">
        {/* Botão de Complementos */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 text-xs"
          onClick={() => onManageOptions(product)}
        >
          <Layers className="h-3.5 w-3.5" />
          Opções
        </Button>

        {/* Botão Mobile  */}
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden h-9 w-9"
          onClick={() => onManageOptions(product)}
        >
          <Layers className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
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
