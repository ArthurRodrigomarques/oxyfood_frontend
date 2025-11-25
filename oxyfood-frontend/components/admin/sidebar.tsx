"use client";

import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col shadow-sm z-20 relative">
      <div className="p-6 mb-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          OxyFood
        </h2>
        <p className="text-sm text-muted-foreground">Hamburgueria Artesanal</p>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {/* Pedidos */}
        <Button
          variant={isActive("/admin/dashboard") ? "default" : "ghost"}
          className={cn(
            "w-full justify-between font-medium h-12 transition-all duration-200",
            isActive("/admin/dashboard")
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              : "text-foreground hover:bg-orange-50 hover:text-orange-600"
          )}
          asChild
        >
          <Link href="/admin/dashboard">
            <div className="flex items-center">
              <UtensilsCrossed className="mr-3 h-5 w-5" />
              Pedidos
            </div>

            <span
              className={cn(
                "flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold",
                isActive("/admin/dashboard")
                  ? "bg-white/20 text-white"
                  : "bg-orange-100 text-orange-600"
              )}
            >
              1
            </span>
          </Link>
        </Button>

        {/* Cardápio */}
        <Button
          variant={isActive("/admin/menu") ? "default" : "ghost"}
          className={cn(
            "w-full justify-start font-medium h-12 transition-all duration-200",
            isActive("/admin/menu")
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              : "text-foreground hover:bg-orange-50 hover:text-orange-600"
          )}
          asChild
        >
          <Link href="/admin/menu">
            <FileText className="mr-3 h-5 w-5" />
            Cardápio
          </Link>
        </Button>

        {/* Relatórios */}
        <Button
          variant={isActive("/admin/reports") ? "default" : "ghost"}
          className={cn(
            "w-full justify-start font-medium h-12 transition-all duration-200",
            isActive("/admin/reports")
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              : "text-foreground hover:bg-orange-50 hover:text-orange-600"
          )}
          asChild
        >
          <Link href="/admin/reports">
            <BarChart3 className="mr-3 h-5 w-5" />
            Relatórios
          </Link>
        </Button>

        {/* Configurações */}
        <Button
          variant={isActive("/admin/settings") ? "default" : "ghost"}
          className={cn(
            "w-full justify-start font-medium h-12 transition-all duration-200",
            isActive("/admin/settings")
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              : "text-foreground hover:bg-orange-50 hover:text-orange-600"
          )}
          asChild
        >
          <Link href="/admin/settings">
            <Settings className="mr-3 h-5 w-5" />
            Configurações
          </Link>
        </Button>
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 h-12 font-medium"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
