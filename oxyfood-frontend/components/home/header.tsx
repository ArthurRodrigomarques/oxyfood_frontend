import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-full">
            <UtensilsCrossed className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-primary">OxyFood</span>
        </div>

        <nav className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Funcionalidades
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Planos
          </a>
          <a
            href="#about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sobre
          </a>
        </nav>

        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/register">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
