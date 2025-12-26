"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertTriangle, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionCardProps {
  restaurantId: string;
  subscriptionStatus: string; // "ACTIVE" | "INACTIVE" | "OVERDUE"
}

export function SubscriptionCard({
  restaurantId,
  subscriptionStatus,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    try {
      setLoading(true);
      const response = await api.post(`/restaurants/${restaurantId}/subscribe`);

      const { paymentLink } = response.data;

      if (paymentLink) {
        toast.success("Redirecionando para o pagamento...");
        window.open(paymentLink, "_blank");
      } else {
        toast.error("Erro ao gerar link de pagamento.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Falha ao iniciar assinatura.");
    } finally {
      setLoading(false);
    }
  }

  const isActive = subscriptionStatus === "ACTIVE";

  return (
    <Card
      className={`border-l-4 ${
        isActive ? "border-l-green-500" : "border-l-red-500"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Assinatura OxyFood Pro
              {isActive ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" /> Ativa
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" /> Inativa
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isActive
                ? "Seu restaurante está visível para vendas."
                : "Seu restaurante está oculto. Assine para começar a vender."}
            </CardDescription>
          </div>
          <CreditCard className="h-8 w-8 text-muted-foreground opacity-20" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>
            Plano Mensal: <span className="font-bold text-black">R$ 99,90</span>
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Cardápio Digital Ilimitado</li>
            <li>Recebimento via Pix Automático</li>
            <li>Painel de Gestão de Pedidos</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50/50 border-t p-4">
        {isActive ? (
          <Button variant="outline" disabled className="w-full sm:w-auto">
            Gerenciar Assinatura (No Asaas)
          </Button>
        ) : (
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Pagamento...
              </>
            ) : (
              "Assinar Agora e Ativar Loja"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
