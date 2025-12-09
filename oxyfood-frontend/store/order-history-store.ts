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
}

export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => {
          const filtered = state.orders.filter((o) => o.id !== order.id);
          return { orders: [order, ...filtered] };
        }),
    }),
    {
      name: "oxyfood-orders",
    }
  )
);
