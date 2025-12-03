"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CheckCircle2,
  ChefHat,
  Bike,
  MapPin,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Status possíveis vindos do backend
type OrderStatus = "PENDING" | "PREPARING" | "OUT" | "COMPLETED" | "REJECTED";

interface OrderStatusResponse {
  status: OrderStatus;
  customerName: string;
}

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-status", id],
    queryFn: async () => {
      const response = await api.get<OrderStatusResponse>(
        `/orders/${id}/status`
      );
      return response.data;
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-muted-foreground">Buscando seu pedido...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-xl font-bold">Pedido não encontrado</h1>
        <Button asChild variant="outline">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    );
  }

  const steps = [
    {
      status: "PENDING",
      label: "Aguardando Confirmação",
      icon: Loader2,
      activeColor: "text-blue-500",
    },
    {
      status: "PREPARING",
      label: "Em Preparo",
      icon: ChefHat,
      activeColor: "text-orange-500",
    },
    {
      status: "OUT",
      label: "Saiu para Entrega",
      icon: Bike,
      activeColor: "text-purple-500",
    },
    {
      status: "COMPLETED",
      label: "Entregue",
      icon: CheckCircle2,
      activeColor: "text-green-500",
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === data.status);

  const isRejected = data.status === "REJECTED";

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center pb-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
            Pedido #{id.slice(0, 6).toUpperCase()}
          </p>
          <CardTitle className="text-2xl text-foreground">
            Olá, {data.customerName}!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {isRejected ? (
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-red-700 text-lg">
                Pedido Cancelado
              </h3>
              <p className="text-red-600/80 mt-1">
                O restaurante não pôde aceitar seu pedido neste momento.
              </p>
            </div>
          ) : (
            <div className="relative space-y-8 pl-4">
              {/* Linha vertical de conexão */}
              <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-gray-200 -z-10" />

              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.status}
                    className="flex items-center gap-4 bg-white z-10"
                  >
                    <div
                      className={`h-14 w-14 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive || isCompleted
                          ? `${step.activeColor} border-current bg-white`
                          : "border-gray-200 text-gray-300 bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${isActive ? "animate-pulse" : ""}`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-bold ${
                          isActive || isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <p className="text-xs text-muted-foreground animate-in fade-in">
                          Atualizado agora mesmo
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Separator />

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>Endereço de entrega informado no checkout.</p>
              </div>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/">Fazer Novo Pedido</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
