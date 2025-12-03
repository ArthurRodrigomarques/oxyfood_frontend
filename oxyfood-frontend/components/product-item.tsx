"use client";

import { Product } from "@/data/mock-restaurant";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { Plus, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { ProductModal } from "./product-modal";
import Image from "next/image";

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const basePrice =
    product.optionGroups && product.optionGroups.length > 0
      ? Math.min(
          ...product.optionGroups.flatMap((g) =>
            g.options.map((o) => Number(o.priceDelta))
          )
        ) === 0
        ? Number(product.basePrice)
        : Number(product.basePrice)
      : Number(product.basePrice);

  return (
    <>
      <div
        className="group flex flex-col sm:flex-row bg-white rounded-xl border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full sm:w-32 h-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100 mb-4 sm:mb-0 sm:mr-6">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-orange-600">
              {formatCurrency(basePrice)}
            </span>

            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 shadow-sm group-hover:shadow-md transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
