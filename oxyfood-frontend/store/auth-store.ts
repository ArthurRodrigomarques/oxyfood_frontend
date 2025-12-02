import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("oxyfood-token", token);
        }
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("oxyfood-token");
        }
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "oxyfood-auth",
    }
  )
);
