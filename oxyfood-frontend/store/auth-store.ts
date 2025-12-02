import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  restaurants?: RestaurantInfo[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  activeRestaurantId: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setRestaurant: (restaurantId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      activeRestaurantId: null,

      login: (token, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("oxyfood-token", token);
        }

        const firstRestaurantId = user.restaurants?.[0]?.id || null;

        set({
          token,
          user,
          isAuthenticated: true,
          activeRestaurantId: firstRestaurantId,
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("oxyfood-token");
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          activeRestaurantId: null,
        });
      },

      setRestaurant: (restaurantId) => {
        set({ activeRestaurantId: restaurantId });
      },
    }),
    {
      name: "oxyfood-auth",
    }
  )
);
