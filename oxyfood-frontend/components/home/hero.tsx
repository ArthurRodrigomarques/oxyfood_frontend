import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Gestão Digital para seu Restaurante
        </h1>
        <p className="text-xl text-muted-foreground">
          Transforme seu negócio com nosso sistema completo de pedidos online e
          gestão de delivery. Simples, rápido e eficiente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="text-lg px-12 h-14 shadow-xl hover:scale-105 transition-transform"
            asChild
          >
            <a href="/admin/login">Começar Grátis</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
