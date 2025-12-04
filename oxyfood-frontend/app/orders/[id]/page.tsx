"use client";

import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  Phone,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

// Tipos
type OrderStatus = "PENDING" | "PREPARING" | "OUT" | "COMPLETED" | "REJECTED";

interface OrderItem {
  id: string;
  quantity: number;
  product: { name: string; imageUrl?: string };
  optionsDescription?: string;
  unitPrice: string;
}

interface OrderDetails {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerAddress: string;
  totalPrice: string;
  deliveryFee: string;
  paymentMethod: string;
  createdAt: string;
  restaurant: {
    name: string;
    phoneNumber: string;
  };
  orderItems: OrderItem[];
}

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [elapsedTime, setElapsedTime] = useState(0);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery<OrderDetails>({
    queryKey: ["order-details", id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}/status`);

      return response.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Para de atualizar se acabou ou foi cancelado
      return status === "COMPLETED" || status === "REJECTED" ? false : 5000;
    },
  });

  // Contador de tempo decorrido
  useEffect(() => {
    if (!order?.createdAt) return;
    const start = new Date(order.createdAt).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      setElapsedTime(Math.floor((now - start) / 60000)); // Minutos
    }, 1000 * 60);

    return () => clearInterval(timer);
  }, [order?.createdAt]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-orange-500 p-4 rounded-full shadow-xl">
            <ChefHat className="h-8 w-8 text-white animate-bounce" />
          </div>
        </div>
        <p className="mt-6 text-gray-500 font-medium animate-pulse">
          Localizando seu pedido...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Pedido não encontrado
        </h1>
        <p className="text-muted-foreground mt-2 mb-6">
          Não conseguimos encontrar os detalhes deste pedido.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Voltar ao Cardápio</Link>
        </Button>
      </div>
    );
  }

  // Configuração da Timeline
  const steps = [
    {
      status: "PENDING",
      label: "Pedido Enviado",
      desc: "Aguardando confirmação do restaurante",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      status: "PREPARING",
      label: "Em Preparo",
      desc: "O restaurante está preparando sua comida",
      icon: ChefHat,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      status: "OUT",
      label: "Saiu para Entrega",
      desc: "Seu pedido está a caminho",
      icon: Bike,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      status: "COMPLETED",
      label: "Entregue",
      desc: "Pedido concluído. Bom apetite!",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-100",
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);
  const isRejected = order.status === "REJECTED";

  const copyPix = () => {
    // Exemplo de funcionalidade de copiar código (se fosse Pix)
    navigator.clipboard.writeText("CODIGO_PIX_EXEMPLO");
    toast.success("Código copiado!");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-10">
      {/* HEADER SIMPLES */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b">
        <div className="container max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-gray-800">Acompanhar Pedido</h1>
            <p className="text-xs text-muted-foreground">
              #{order.id.slice(0, 6).toUpperCase()} • {order.restaurant?.name}
            </p>
          </div>
          {order.status !== "COMPLETED" && !isRejected && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100 border-none"
            >
              <Clock className="h-3 w-3 mr-1" />
              {elapsedTime} min
            </Badge>
          )}
        </div>
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-6">
        {/* CARD DE STATUS */}
        <Card className="border-none shadow-sm overflow-hidden">
          {isRejected ? (
            <div className="p-8 text-center bg-red-50">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😢</span>
              </div>
              <h2 className="text-xl font-bold text-red-700">
                Pedido Cancelado
              </h2>
              <p className="text-red-600/80 mt-2 text-sm">
                O restaurante não pôde aceitar seu pedido neste momento.
              </p>
              <Button
                className="mt-6 bg-red-600 hover:bg-red-700 text-white"
                asChild
              >
                <Link href="/">Tentar Novamente</Link>
              </Button>
            </div>
          ) : (
            <div className="p-6 bg-white">
              <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="relative flex gap-4">
                      <div
                        className={cn(
                          "relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-all duration-500",
                          isCompleted || isCurrent
                            ? step.bg
                            : "bg-gray-50 grayscale"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-6 w-6 transition-all duration-500",
                            isCompleted || isCurrent
                              ? step.color
                              : "text-gray-300"
                          )}
                        />
                      </div>
                      <div
                        className={cn(
                          "pt-1 transition-opacity duration-500",
                          isCompleted || isCurrent
                            ? "opacity-100"
                            : "opacity-40"
                        )}
                      >
                        <h3 className="font-bold text-gray-900">
                          {step.label}
                        </h3>
                        <p className="text-sm text-gray-500 leading-snug">
                          {step.desc}
                        </p>
                        {isCurrent && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold rounded uppercase tracking-wider animate-pulse">
                            Agora
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* DETALHES DA ENTREGA */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 border-none shadow-sm flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">
                Endereço de Entrega
              </h4>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                {order.customerAddress}
              </p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-sm flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <Phone className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">
                Contato da Loja
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">
                {order.restaurant?.phoneNumber || "Não informado"}
              </p>
            </div>
          </Card>
        </div>

        {/* RESUMO DO PEDIDO */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Resumo do Pedido
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex justify-between items-start text-sm">
                <div>
                  <span className="font-bold text-gray-900 mr-2">
                    {item.quantity}x
                  </span>
                  <span className="text-gray-700">
                    {item.product?.name || "Item"}
                  </span>
                  {item.optionsDescription && (
                    <p className="text-xs text-gray-500 mt-0.5 pl-6">
                      {item.optionsDescription}
                    </p>
                  )}
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(Number(item.unitPrice) * item.quantity)}
                </span>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    Number(order.totalPrice) - Number(order.deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                <span>Total</span>
                <span className="text-green-600">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-xs text-gray-500 mt-4">
              <span>Pagamento via {order.paymentMethod}</span>
              {order.paymentMethod === "Pix" && (
                <button
                  onClick={copyPix}
                  className="flex items-center gap-1 text-blue-600 font-bold hover:underline"
                >
                  <Copy className="h-3 w-3" /> Copiar Código
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* AJUDA / FOOTER */}
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Precisa de ajuda? Fale com o suporte
          </Button>
        </div>
      </main>
    </div>
  );
}
