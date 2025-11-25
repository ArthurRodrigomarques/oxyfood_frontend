"use client";

import { Product } from "@/data/mock-restaurant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ProductModal } from "./product-modal";
import { useCartStore } from "@/store/cart-store";

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItemToCart = useCartStore((state) => state.addItem);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (product.optionGroups.length > 0) {
      setIsModalOpen(true);
    } else {
      addItemToCart({
        product,
        quantity: 1,
        selectedOptions: [],
        totalPrice: parseFloat(product.basePrice),
      });
    }
  };

  return (
    <>
      <Card
        className="hover:bg-muted/50 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <article className="flex gap-4">
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <p className="font-bold text-lg">
                R$ {parseFloat(product.basePrice).toFixed(2)}
              </p>
            </div>

            <Button
              size="icon"
              className="hidden sm:flex"
              onClick={handleAddClick}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <figure className="relative w-24 h-24 rounded-md overflow-hidden">
              <Image
                src={
                  product.imageUrl ||
                  "https://placehold.co/400x400/CCCCCC/FFFFFF"
                }
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </figure>

            <Button size="icon" className="sm:hidden" onClick={handleAddClick}>
              <Plus className="h-4 w-4" />
            </Button>
          </article>
        </CardContent>
      </Card>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
