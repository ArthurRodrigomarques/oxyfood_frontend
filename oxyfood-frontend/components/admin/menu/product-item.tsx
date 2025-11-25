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
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      {/* Imagem */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Informações */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-200 border-none"
          >
            {product.category}
          </Badge>
          <span className="font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-4 self-end sm:self-center ml-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Disponível
          </span>
          <Switch
            checked={product.available}
            onCheckedChange={() =>
              onToggleAvailability(product.id, product.available)
            }
          />
        </div>

        <div className="flex items-center border-l pl-4 gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
            <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(product)}>
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
