"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { RestaurantSwitcher } from "./restaurant-switcher";

interface SidebarContentProps {
  onLinkClick?: () => void;
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Pedidos",
    icon: ShoppingBag,
    href: "/admin/dashboard",
    color: "text-violet-500",
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
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-gray-900">
      <div className="px-3 py-2 flex-1">
        <div className="mb-6 px-2">
          <RestaurantSwitcher />
        </div>

        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href + route.label}
              href={route.href}
              onClick={onLinkClick}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-orange-600 hover:bg-orange-50 rounded-lg transition",
                pathname === route.href ||
                  (route.href !== "/admin/dashboard" &&
                    pathname.startsWith(route.href))
                  ? "text-orange-600 bg-orange-50"
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
      </div>

      <div className="px-3 py-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
