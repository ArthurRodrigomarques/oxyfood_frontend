import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShoppingBag, BarChart3, Settings, Smartphone } from "lucide-react";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-2 border-transparent hover:border-primary/20 transition-all hover:shadow-md bg-white">
      <CardHeader>
        <div className="mb-4 bg-orange-50 w-fit p-3 rounded-lg">{icon}</div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-base pt-2">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-orange-50/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            O que oferecemos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas para simplificar a sua operação e aumentar as
            suas vendas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<ShoppingBag className="w-10 h-10 text-primary" />}
            title="Pedidos Online"
            description="Receba pedidos diretamente pelo seu cardápio digital personalizado."
          />
          <FeatureCard
            icon={<BarChart3 className="w-10 h-10 text-primary" />}
            title="Relatórios"
            description="Acompanhe vendas, produtos mais pedidos e performance do seu negócio."
          />
          <FeatureCard
            icon={<Settings className="w-10 h-10 text-primary" />}
            title="Gestão Completa"
            description="Gerencie cardápio, pedidos, configurações e muito mais em um só lugar."
          />
          <FeatureCard
            icon={<Smartphone className="w-10 h-10 text-primary" />}
            title="Mobile First"
            description="Interface responsiva perfeita para qualquer dispositivo móvel."
          />
        </div>
      </div>
    </section>
  );
}
