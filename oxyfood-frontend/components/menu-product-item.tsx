"use client";

import Image from "next/image";
import { Product } from "@/types/order";
import { formatCurrency } from "@/lib/utils";

interface MenuProductItemProps {
  product: Product;
}

export function MenuProductItem({ product }: MenuProductItemProps) {
  return (
    <div className="group relative flex w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-32 sm:h-40">
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-gray-800 line-clamp-1 text-lg">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-extrabold text-lg text-orange-600">
            {formatCurrency(Number(product.basePrice))}
          </span>
        </div>
      </div>

      {product.imageUrl && (
        <div className="relative w-32 sm:w-40 h-full shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
    </div>
  );
}
