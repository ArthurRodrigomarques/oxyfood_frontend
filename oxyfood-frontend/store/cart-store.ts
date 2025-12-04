"use client";

import { create } from "zustand";
import { Product, Option } from "@/types/order";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: Option[];
  totalPrice: number;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (itemToAdd) => {
    set((state) => {
      toast.success(`${itemToAdd.product.name} adicionado ao carrinho!`, {
        description: `+ R$ ${itemToAdd.totalPrice.toFixed(2)}`,
      });
      return { items: [...state.items, itemToAdd] };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      toast.error("Item removido do carrinho.");
      return {
        items: state.items.filter((item) => item.product.id !== productId),
      };
    });
  },

  clearCart: () => {
    set({ items: [] });
    toast.info("Carrinho esvaziado.");
  },
}));
