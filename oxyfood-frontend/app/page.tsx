import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Bem-vindo ao Oxyfood
        </h1>
        <p className="text-muted-foreground mt-2">
          Este é o seu futuro sistema de PDV e Delivery.
        </p>

        <Button asChild className="mt-8">
          <Link href="/restaurants/hamburgueria-do-ze">
            Ver Cardápio Mockado
          </Link>
        </Button>
      </div>
    </main>
  );
}
