"use client";

import { Product } from "@/data/mock-restaurant";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { ProductModal } from "./product-modal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        className="hover:bg-muted/50 cursor-pointer w-64 shrink-0"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-0">
          <article>
            <figure className="relative w-full h-32 rounded-t-lg overflow-hidden">
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

            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="font-bold text-lg">
                R$ {parseFloat(product.basePrice).toFixed(2)}
              </p>
            </div>
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
