import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

function PricingCard({
  title,
  description,
  price,
  features,
  buttonText,
  isPopular = false,
  variant = "default",
}: {
  title: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  variant?: "default" | "outline";
}) {
  return (
    <Card
      className={`relative flex flex-col bg-white transition-all hover:shadow-xl duration-300 ${
        isPopular
          ? "border-orange-500 border-2 shadow-md scale-105 z-10"
          : "border-gray-200"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm uppercase tracking-wide">
          Mais Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-gray-900">
            R$ {price}
          </span>
          <span className="text-muted-foreground font-medium">/mês</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-4 flex-1 mb-8">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <div className="bg-green-100 p-1 rounded-full shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button className="w-full h-12 font-bold" variant={variant} asChild>
          <Link href="/register">{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Planos</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para o tamanho do seu negócio. Sem fidelidade.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          title="Básico"
          description="Para começar"
          price="49"
          features={[
            "Até 50 pedidos/mês",
            "Cardápio digital",
            "Gestão de pedidos",
            "Suporte por email",
          ]}
          buttonText="Começar Agora"
          variant="outline"
        />
        <PricingCard
          title="Profissional"
          description="Para crescer"
          price="99"
          isPopular
          features={[
            "Pedidos ilimitados",
            "Todos recursos do Básico",
            "Relatórios avançados",
            "Suporte prioritário",
            "Customização avançada",
          ]}
          buttonText="Começar Agora"
        />
        <PricingCard
          title="Enterprise"
          description="Para grandes operações"
          price="199"
          features={[
            "Tudo do Profissional",
            "Múltiplas lojas",
            "API personalizada",
            "Suporte 24/7",
            "Gerente de conta dedicado",
          ]}
          buttonText="Falar com Vendas"
          variant="outline"
        />
      </div>
    </section>
  );
}
