import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Rocket } from "lucide-react";

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="bg-gradient-to-br from-orange-600 to-orange-500 border-none shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />

        <CardContent className="py-20 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Pronto para decolar suas vendas?
          </h2>
          <p className="text-xl text-orange-50 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de restaurantes que já estão crescendo com a
            OxyFood. Teste grátis por 7 dias, sem compromisso.
          </p>
          <Button
            size="lg"
            className="text-lg px-12 h-16 bg-white text-orange-600 hover:bg-gray-50 font-bold rounded-full shadow-xl transition-transform hover:scale-105"
            asChild
          >
            <Link href="/register">
              Criar Minha Conta Agora <Rocket className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
