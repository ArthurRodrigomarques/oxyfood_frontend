"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoredOrder {
  id: string;
  restaurantName: string;
  restaurantSlug: string;
  total: number;
  date: string;
}

interface OrderHistoryState {
  orders: StoredOrder[];
  addOrder: (order: StoredOrder) => void;
  clearHistory: () => void;
}

export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => {
          const currentOrders = Array.isArray(state.orders) ? state.orders : [];

          const filtered = currentOrders.filter(
            (o) => o && o.id && o.id !== order.id
          );

          return { orders: [order, ...filtered] };
        }),
      clearHistory: () => set({ orders: [] }),
    }),
    {
      name: "oxyfood-orders",
    }
  )
);
