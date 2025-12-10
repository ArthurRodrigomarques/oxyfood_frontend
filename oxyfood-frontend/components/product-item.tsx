"use client";

import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/order";
import { useState } from "react";
import { ProductModal } from "./product-modal";

interface ProductItemProps {
  product: Product;
}

export function ProductItem({ product }: ProductItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items, addItem, removeItem } = useCartStore();

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      product,
      quantity: 1,
      selectedOptions: [],
      totalPrice: Number(product.basePrice),
      notes: "",
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(product.id);
  };

  return (
    <>
      <div
        className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        onClick={handleOpenModal}
      >
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={product.imageUrl || "/hamburguer.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 120px, 160px"
          />
        </div>

        <div className="flex flex-col flex-1 justify-between min-w-0">
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-1 text-base sm:text-lg">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2">
            <span className="font-bold text-lg text-emerald-600">
              {formatCurrency(Number(product.basePrice))}
            </span>

            {quantity > 0 &&
            (!product.optionGroups || product.optionGroups.length === 0) ? (
              <div
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                  onClick={handleDecrement}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-bold w-4 text-center text-gray-900">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md"
                  onClick={handleIncrement}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-9 px-4 rounded-lg shadow-sm transition-transform active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal();
                }}
              >
                Adicionar
              </Button>
            )}
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
