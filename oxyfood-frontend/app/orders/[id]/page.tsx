"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CheckCircle2,
  ChefHat,
  Bike,
  MapPin,
  XCircle,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type OrderStatus = "PENDING" | "PREPARING" | "OUT" | "COMPLETED" | "REJECTED";

interface OrderStatusResponse {
  status: OrderStatus;
  customerName: string;
  id: string;
}

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, error } = useQuery<OrderStatusResponse | null>({
    queryKey: ["order-status", id],
    queryFn: async () => {
      const response = await api.get<OrderStatusResponse>(
        `/orders/${id}/status`
      );
      return response.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "COMPLETED" || status === "REJECTED" ? false : 5000;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="text-gray-500 font-medium">Buscando seu pedido...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6 p-4 text-center">
        <div className="bg-red-100 p-6 rounded-full">
          <XCircle className="h-12 w-12 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pedido não encontrado
          </h1>
          <p className="text-muted-foreground mt-2">
            Verifique se o link está correto.
          </p>
        </div>
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 rounded-full px-8"
        >
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    );
  }

  const steps = [
    {
      status: "PENDING",
      label: "Aguardando Confirmação",
      description: "O restaurante está analisando seu pedido",
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      status: "PREPARING",
      label: "Em Preparo",
      description: "Seu pedido está sendo feito com carinho",
      icon: ChefHat,
      color: "bg-orange-500",
    },
    {
      status: "OUT",
      label: "Saiu para Entrega",
      description: "O entregador está a caminho",
      icon: Bike,
      color: "bg-purple-500",
    },
    {
      status: "COMPLETED",
      label: "Entregue",
      description: "Bom apetite!",
      icon: CheckCircle2,
      color: "bg-green-500",
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === data.status);
  const isRejected = data.status === "REJECTED";

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-none overflow-hidden rounded-2xl">
        <div className="bg-orange-500 p-6 text-white text-center">
          <div className="bg-white/20 w-fit mx-auto px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
            <span className="text-xs font-bold tracking-widest uppercase">
              Pedido #{id.slice(0, 6).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold">
            {isRejected ? "Pedido Cancelado" : "Acompanhe seu Pedido"}
          </h1>
          <p className="text-orange-100 text-sm mt-1">
            Olá, {data.customerName}!
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-8 bg-white">
          {isRejected ? (
            <div className="text-center py-8">
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-xl mb-2">
                Ops! Ocorreu um problema.
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                O restaurante não pôde aceitar seu pedido neste momento. Tente
                novamente ou escolha outro item.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-10">
              {/* Linha do tempo (Background) */}
              <div className="absolute left-[35px] sm:left-[43px] top-4 bottom-10 w-0.5 bg-gray-100 -z-10" />

              {/* Barra de Progresso (Colorida) */}
              <div
                className="absolute left-[35px] sm:left-[43px] top-4 w-0.5 bg-green-500 -z-10 transition-all duration-1000"
                style={{
                  height: `${(currentStepIndex / (steps.length - 1)) * 85}%`,
                }} // Calcula a altura aproximada
              />

              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.status}
                    className="flex gap-4 sm:gap-6 relative"
                  >
                    <div
                      className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-500 z-10 ${
                        isActive || isCompleted
                          ? `${step.color} border-white shadow-lg text-white scale-110`
                          : "bg-white border-gray-100 text-gray-300"
                      }`}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>

                    <div
                      className={`pt-1 transition-all duration-500 ${
                        isActive
                          ? "opacity-100 translate-x-0"
                          : isCompleted
                          ? "opacity-50"
                          : "opacity-30"
                      }`}
                    >
                      <h4
                        className={`font-bold text-lg ${
                          isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-sm text-gray-500 leading-tight mt-1">
                        {step.description}
                      </p>
                      {isActive && (
                        <Badge
                          variant="outline"
                          className="mt-2 text-orange-600 border-orange-200 bg-orange-50 animate-pulse"
                        >
                          Em andamento
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-sm text-gray-600">
                <span className="block font-bold text-gray-800">
                  Endereço de Entrega
                </span>
                Confirmado no checkout.
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-black rounded-xl"
              asChild
            >
              <Link href="/">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Fazer Novo Pedido
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
