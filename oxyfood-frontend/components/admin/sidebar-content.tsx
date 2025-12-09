"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { RestaurantSwitcher } from "./restaurant-switcher";

interface SidebarContentProps {
  onLinkClick?: () => void;
}

const routes = [
  {
    label: "Pedidos",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Cardápio",
    icon: UtensilsCrossed,
    href: "/admin/menu",
    color: "text-pink-700",
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    href: "/admin/reports",
    color: "text-orange-700",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-500",
  },
];

export function SidebarContent({ onLinkClick }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, activeRestaurantId } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Encontrar o slug do restaurante ativo para o link público
  const activeRestaurant = user?.restaurants?.find(
    (r) => r.id === activeRestaurantId
  );
  const publicStoreUrl = activeRestaurant
    ? `/restaurants/${activeRestaurant.slug}`
    : null;

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-gray-900 border-r">
      <div className="px-3 py-2 flex-1 flex flex-col">
        {/* Switcher de Restaurantes */}
        <div className="mb-6 px-2">
          <RestaurantSwitcher />
        </div>

        {/* Menu Principal */}
        <div className="space-y-1 flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onLinkClick}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-orange-600 hover:bg-orange-50 rounded-lg transition",
                pathname === route.href
                  ? "text-orange-600 bg-orange-50 font-bold"
                  : "text-zinc-600"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Botão Ver Loja (se houver restaurante ativo) */}
        {publicStoreUrl && (
          <div className="px-2 mt-auto mb-4">
            <Link
              href={publicStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
              >
                <ExternalLink className="h-4 w-4" />
                Ver Minha Loja
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Botão de Sair */}
      <div className="px-3 py-2 border-t bg-gray-50/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  );
}
