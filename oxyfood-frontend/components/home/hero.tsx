import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-gray-900">
            Seu Restaurante no <br />
            <span className="text-orange-600">Mundo Digital</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A plataforma completa para delivery, cardápio digital e gestão de
            pedidos. Sem taxas abusivas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {/* Botão Principal - Cadastro */}
          <Button
            size="lg"
            className="text-lg h-14 px-8 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-orange-200 transition-all"
            asChild
          >
            <Link href="/register">
              Começar Grátis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {/* Botão Secundário - Ver Demo */}
          <Button
            size="lg"
            variant="outline"
            className="text-lg h-14 px-8 rounded-full border-2 hover:bg-gray-50"
            asChild
          >
            <Link href="/restaurants/hamburgueria-do-ze" target="_blank">
              Ver Loja Demo <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Prova Social / Estatísticas */}
        <div className="pt-12 grid grid-cols-3 gap-4 md:gap-12 border-t mt-12 max-w-3xl mx-auto">
          <div>
            <p className="text-3xl font-bold text-gray-900">+1</p>
            <p className="text-sm text-muted-foreground">Restaurantes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">1k</p>
            <p className="text-sm text-muted-foreground">Pedidos/mês</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">99.9%</p>
            <p className="text-sm text-muted-foreground">perfeição</p>
          </div>
        </div>
      </div>
    </section>
  );
}
