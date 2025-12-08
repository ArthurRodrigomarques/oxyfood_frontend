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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // <--- IMPORTANTE: Importar Image do Next
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
      const response = await api.get(`/orders/${id}/status`);
      return response.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Continua atualizando se não estiver concluído OU se o pagamento estiver pendente
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
        <div className="animate-pulse text-orange-600 font-bold">
          Carregando pedido...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-2">Pedido não encontrado</h1>
        <Link href="/" className="text-orange-600 hover:underline">
          Voltar ao início
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
    <div className="min-h-screen bg-[#F7F7F7] pb-10">
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800">
            Pedido #{order.id.slice(0, 4).toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground">{order.customerName}</p>
        </div>
        {!isRejected && order.status !== "COMPLETED" && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {elapsedTime} min
          </Badge>
        )}
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-6">
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
                  Copie o código abaixo e pague no seu banco para liberar o
                  pedido.
                </p>
              </div>

              {order.qrCodeBase64 && (
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  {/* ALTERADO: Usando Next Image para otimização */}
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
                <p className="text-xs text-green-600/80 mt-2">
                  O status atualizará automaticamente após o pagamento.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="border-none shadow-sm overflow-hidden bg-white">
          {isRejected ? (
            <div className="p-8 text-center bg-red-50">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-700">
                Pedido Cancelado
              </h2>
              <p className="text-red-600/80 mt-2 text-sm">
                Entre em contato com o restaurante.
              </p>
            </div>
          ) : (
            <div className="p-6 relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="relative flex gap-4">
                    <div
                      className={cn(
                        "relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-all",
                        isCompleted || isCurrent
                          ? step.bg
                          : "bg-gray-50 grayscale"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-6 w-6",
                          isCompleted || isCurrent
                            ? step.color
                            : "text-gray-300"
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "pt-1",
                        isCompleted || isCurrent ? "opacity-100" : "opacity-40"
                      )}
                    >
                      <h3 className="font-bold text-gray-900">{step.label}</h3>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 flex items-start gap-3 border-none shadow-sm">
            <MapPin className="h-5 w-5 text-gray-500 mt-1" />
            <div>
              <h4 className="font-bold text-sm">Endereço</h4>
              <p className="text-sm text-gray-500">{order.customerAddress}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-start gap-3 border-none shadow-sm">
            <Phone className="h-5 w-5 text-gray-500 mt-1" />
            <div>
              <h4 className="font-bold text-sm">Contato</h4>
              <p className="text-sm text-gray-500">{order.customerPhone}</p>
            </div>
          </Card>
        </div>

        <Card className="p-4 border-none shadow-sm space-y-2">
          <h3 className="font-bold border-b pb-2 mb-2">Resumo</h3>
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              {/* Aqui os erros de 'item.product' e 'item.unitPrice' vão desaparecer */}
              <span>
                {item.quantity}x {item.product?.name}
              </span>
              <span>
                {formatCurrency(Number(item.unitPrice) * item.quantity)}
              </span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
          <div className="text-xs text-gray-500 text-right">
            Pagamento via {order.paymentMethod} • Status:{" "}
            {order.paymentStatus === "APPROVED" ? "Pago ✅" : "Pendente ⏳"}
          </div>
        </Card>
      </main>
    </div>
  );
}
