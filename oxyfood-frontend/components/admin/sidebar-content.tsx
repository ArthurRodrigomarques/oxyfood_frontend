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

interface SidebarContentProps {
  onLinkClick?: () => void;
}

export function SidebarContent({ onLinkClick }: SidebarContentProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full bg-white text-foreground">
      {/* Header da Sidebar */}
      <div className="p-6 mb-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          OxyFood
        </h2>
        <p className="text-sm text-muted-foreground">Hamburgueria Artesanal</p>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 px-3 space-y-2">
        <Button
          variant={isActive("/admin/dashboard") ? "default" : "ghost"}
          className={cn(
            "w-full justify-start font-medium h-12",
            isActive("/admin/dashboard")
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "text-foreground hover:text-orange-600"
          )}
          asChild
          onClick={onLinkClick}
        >
          <Link href="/admin/dashboard">
            <UtensilsCrossed className="mr-3 h-5 w-5" />
            Pedidos
          </Link>
        </Button>

        <Button
          variant={isActive("/admin/menu") ? "default" : "ghost"}
          className={cn(
            "w-full justify-start font-medium h-12",
            isActive("/admin/menu")
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "text-foreground hover:text-orange-600"
          )}
          asChild
          onClick={onLinkClick}
        >
          <Link href="/admin/menu">
            <FileText className="mr-3 h-5 w-5" />
            Cardápio
          </Link>
        </Button>

        <Button
          variant={isActive("/admin/reports") ? "default" : "ghost"}
          className={cn(
            "w-full justify-start font-medium h-12",
            isActive("/admin/reports")
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "text-foreground hover:text-orange-600"
          )}
          asChild
          onClick={onLinkClick}
        >
          <Link href="/admin/reports">
            <BarChart3 className="mr-3 h-5 w-5" />
            Relatórios
          </Link>
        </Button>

        <Button
          variant={isActive("/admin/settings") ? "default" : "ghost"}
          className={cn(
            "w-full justify-start font-medium h-12",
            isActive("/admin/settings")
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "text-foreground hover:text-orange-600"
          )}
          asChild
          onClick={onLinkClick}
        >
          <Link href="/admin/settings">
            <Settings className="mr-3 h-5 w-5" />
            Configurações
          </Link>
        </Button>
      </nav>

      {/* Footer da Sidebar */}
      <div className="p-4 mt-auto border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 h-12 font-medium"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
}
