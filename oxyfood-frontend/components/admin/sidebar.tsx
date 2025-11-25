import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6" />
          OxyFood
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Hamburgueria Artesanal
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Button variant="secondary" className="w-full justify-start" asChild>
          <Link href="/admin/dashboard">
            <UtensilsCrossed className="mr-2 h-4 w-4" />
            Pedidos
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/admin/menu">
            <FileText className="mr-2 h-4 w-4" />
            Cardápio
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <BarChart3 className="mr-2 h-4 w-4" />
          Relatórios
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
