import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check } from "lucide-react";

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
      className={`relative flex flex-col bg-white transition-all hover:shadow-lg ${
        isPopular
          ? "border-primary border-2 shadow-md scale-105 z-10"
          : "border"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium shadow-sm">
          Mais Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-foreground">R$ {price}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 flex-1 mb-6">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="bg-primary/10 p-1 rounded-full">
                <Check className="w-3 h-3 text-primary shrink-0" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full" variant={variant}>
          {buttonText}
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
