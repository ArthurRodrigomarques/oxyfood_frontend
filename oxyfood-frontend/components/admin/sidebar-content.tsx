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
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { RestaurantSwitcher } from "./restaurant-switcher";

interface SidebarContentProps {
  onLinkClick?: () => void;
}

const ownerRoutes = [
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

const superAdminRoutes = [
  {
    label: "Painel Master",
    icon: ShieldCheck,
    href: "/admin/super",
    color: "text-blue-600",
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

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const routes = isSuperAdmin ? superAdminRoutes : ownerRoutes;

  const activeRestaurant = user?.restaurants?.find(
    (r) => r.id === activeRestaurantId
  );

  const publicStoreUrl =
    !isSuperAdmin && activeRestaurant
      ? `/restaurants/${activeRestaurant.slug}`
      : null;

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-gray-900 border-r">
      <div className="px-3 py-2 flex-1 flex flex-col overflow-y-auto">
        {/* CABEÇALHO DO MENU */}
        {isSuperAdmin ? (
          <div className="mb-8 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 mx-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-blue-600 rounded-md">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-blue-900 tracking-tight text-sm">
                Admin Master
              </span>
            </div>
            <p className="text-[10px] text-blue-600/80 font-medium pl-1">
              Gestão Global da Plataforma
            </p>
          </div>
        ) : (
          // Switcher padrão para Donos
          <div className="mb-6 px-2">
            <RestaurantSwitcher />
          </div>
        )}

        {/* LISTA DE LINKS */}
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onLinkClick}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200",
                pathname === route.href
                  ? isSuperAdmin
                    ? "text-blue-700 bg-blue-50 font-bold shadow-sm"
                    : "text-orange-600 bg-orange-50 font-bold shadow-sm"
                  : "text-zinc-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Link para Loja Pública (Apenas Donos) */}
        {publicStoreUrl && (
          <div className="px-2 mt-auto pt-6">
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

      {/* RODAPÉ / SAIR */}
      <div className="px-3 py-2 border-t bg-gray-50/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 hover:shadow-sm transition-all"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  );
}
