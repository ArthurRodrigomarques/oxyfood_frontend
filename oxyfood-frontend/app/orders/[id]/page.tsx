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
  Phone,
  Copy,
  ArrowLeft,
  QrCode,
  AlertCircle,
  Store,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import { Order } from "@/types/order";

const steps = [
  {
    status: "PENDING",
    label: "Aguardando",
    desc: "Aguardando restaurante aceitar",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    status: "PREPARING",
    label: "Em Preparo",
    desc: "A cozinha está trabalhando",
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
    desc: "Pedido concluído",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-100",
  },
];

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
  } = useQuery<Order>({
    queryKey: ["order-details", id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`); // Rota pública de detalhes que criamos
      return response.data.order;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "REJECTED") return false;
      return 5000;
    },
  });

  useEffect(() => {
    if (!order?.createdAt) return;
    const start = new Date(order.createdAt).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      setElapsedTime(Math.floor((now - start) / 60000));
    }, 1000 * 60);

    return () => clearInterval(timer);
  }, [order?.createdAt]);

  const copyPix = () => {
    if (order?.paymentLink) {
      navigator.clipboard.writeText(order.paymentLink);
      toast.success("Código Pix copiado!", {
        description: "Cole no app do seu banco para pagar.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="text-orange-600 font-medium text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold mb-2 text-gray-800">
          Pedido não encontrado
        </h1>
        <p className="text-gray-500 mb-6 max-w-xs">
          Não conseguimos carregar este pedido. Ele pode não existir ou ter sido
          removido.
        </p>
        <Link href="/my-orders">
          <Button variant="outline">Ir para Meus Pedidos</Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);
  const isRejected = order.status === "REJECTED";

  const showPixPayment =
    order.paymentMethod === "Pix" &&
    order.paymentStatus !== "APPROVED" &&
    order.paymentLink;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* HEADER DE NAVEGAÇÃO */}
      <header className="bg-white px-4 py-3 sticky top-0 z-20 shadow-sm border-b flex items-center gap-3">
        {/* Botão VOLTAR agora leva para /my-orders */}
        <Link href="/my-orders">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 -ml-2"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>

        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-800 text-sm sm:text-base truncate">
            Pedido #{order.displayId || order.id.slice(0, 4).toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground truncate">
            {order.customerName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRejected && order.status !== "COMPLETED" && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 font-mono whitespace-nowrap"
            >
              {elapsedTime} min
            </Badge>
          )}
          {/* Botão Extra para ir à Loja (Home) */}
          <Link href="/">
            <Button size="icon" variant="ghost" className="text-orange-500">
              <Store className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-6">
        {/* ÁREA DE PAGAMENTO PIX */}
        {showPixPayment && (
          <Card className="p-6 border-2 border-green-500 bg-green-50 shadow-md animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <QrCode className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">
                  Pagamento Pendente
                </h3>
                <p className="text-sm text-green-700">
                  Pague para o restaurante confirmar seu pedido.
                </p>
              </div>

              {order.qrCodeBase64 && (
                <div className="bg-white p-2 rounded-lg shadow-sm border border-green-100">
                  <Image
                    src={`data:image/jpeg;base64,${order.qrCodeBase64}`}
                    alt="QR Code Pix"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              )}

              <div className="w-full">
                <Button
                  onClick={copyPix}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 shadow-sm"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Código Pix
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* STATUS DO PEDIDO */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          {isRejected ? (
            <div className="p-8 text-center bg-red-50">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-700">
                Pedido Cancelado
              </h2>
              <p className="text-red-600/80 mt-2 text-sm">
                Infelizmente o restaurante não pôde aceitar este pedido.
              </p>
            </div>
          ) : (
            <div className="p-6 relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
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
                          "h-6 w-6 transition-colors duration-500",
                          isCompleted || isCurrent
                            ? step.color
                            : "text-gray-300"
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "pt-1 transition-opacity duration-500",
                        isCompleted || isCurrent ? "opacity-100" : "opacity-40"
                      )}
                    >
                      <h3 className="font-bold text-gray-900 text-lg">
                        {step.label}
                      </h3>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* DETALHES DE ENTREGA */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 flex items-start gap-3 border-none shadow-sm bg-white">
            <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-gray-800">Endereço</h4>
              <p className="text-sm text-gray-500 break-words">
                {order.customerAddress}
              </p>
            </div>
          </Card>
          <Card className="p-4 flex items-start gap-3 border-none shadow-sm bg-white">
            <Phone className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-gray-800">Contato</h4>
              <p className="text-sm text-gray-500">{order.customerPhone}</p>
            </div>
          </Card>
        </div>

        {/* RESUMO DO PEDIDO */}
        <Card className="p-5 border-none shadow-sm space-y-4 bg-white">
          <div className="flex items-center gap-2 border-b pb-3">
            <ShoppingBag className="h-5 w-5 text-gray-400" />
            <h3 className="font-bold text-gray-800">Resumo do Pedido</h3>
          </div>

          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div className="flex gap-2">
                  <span className="font-bold text-gray-900 min-w-[20px]">
                    {item.quantity}x
                  </span>
                  <div className="flex flex-col">
                    <span className="text-gray-700">{item.product?.name}</span>
                    {item.optionsDescription && (
                      <span className="text-xs text-gray-400">
                        {item.optionsDescription}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(Number(item.unitPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(order.subTotalPrice) || 0)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Taxa de Entrega</span>
              <span>
                {Number(order.deliveryFee) > 0
                  ? formatCurrency(Number(order.deliveryFee))
                  : "Grátis"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 text-gray-900">
              <span>Total</span>
              <span className="text-green-600">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 flex justify-between items-center">
            <span>Forma de Pagamento:</span>
            <span className="font-bold uppercase text-gray-700">
              {order.paymentMethod}
            </span>
          </div>
        </Card>
      </main>
    </div>
  );
}
