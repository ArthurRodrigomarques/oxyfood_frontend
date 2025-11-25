import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="bg-gradient-to-r from-orange-100 to-white border-primary/20 shadow-lg">
        <CardContent className="py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Pronto para começar?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de restaurantes que já estão crescendo com nossa
            plataforma.
          </p>
          <Button
            size="lg"
            className="text-lg px-12 h-14 shadow-xl hover:scale-105 transition-transform"
            asChild
          >
            <a href="/admin/login">Criar Conta Grátis</a>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
