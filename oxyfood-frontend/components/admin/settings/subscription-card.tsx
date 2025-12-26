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
  restaurantName: string; // [NOVO] Recebe o nome para exibir
  subscriptionStatus: string;
  hasDocument: boolean; // [NOVO] Saber se já tem CPF/CNPJ salvo
}

export function SubscriptionCard({
  restaurantId,
  restaurantName,
  subscriptionStatus,
  hasDocument,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    // [NOVO] Validação prévia no frontend
    if (!hasDocument) {
      toast.error("Documentação Pendente", {
        description:
          "Por favor, salve o CPF ou CNPJ nas configurações da loja antes de assinar.",
      });
      return;
    }

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
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as { response?: { data?: { message?: string } } };

      const msg =
        apiError.response?.data?.message || "Falha ao iniciar assinatura.";

      toast.error("Erro na assinatura", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  const isActive = subscriptionStatus === "ACTIVE";

  return (
    <Card
      className={`border-l-4 ${
        isActive ? "border-l-green-500" : "border-l-red-500"
      } shadow-sm`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Assinatura: {restaurantName}
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
                ? "Esta loja está visível e pronta para vender."
                : "Realize a assinatura para liberar o cardápio desta loja."}
            </CardDescription>
          </div>
          <CreditCard className="h-8 w-8 text-muted-foreground opacity-20" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md border">
          <p className="flex justify-between items-center mb-2">
            <span>Plano Mensal OxyFood Pro</span>
            <span className="font-bold text-lg text-black">R$ 99,90</span>
          </p>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>• Cobrança vinculada ao seu cadastro de usuário (Dono)</li>
            <li>• Liberação imediata após confirmação do Pix</li>
            <li>• Gestão unificada de pagamentos</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {isActive ? (
          <Button variant="outline" disabled className="w-full sm:w-auto">
            Assinatura Ativa
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
              "Assinar Agora"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
