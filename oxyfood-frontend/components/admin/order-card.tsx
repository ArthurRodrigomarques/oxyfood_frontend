"use client";

import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  User,
  MapPin,
  Banknote,
  CreditCard,
  QrCode,
  CheckCircle2,
  XCircle,
  Bike,
  ChefHat,
  Timer,
  Printer,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";

interface OrderCardProps {
  order: Order;
  onAdvance: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onUpdateStatus?: (orderId: string) => void;
}

export function OrderCard({
  order,
  onAdvance,
  onReject,
  onUpdateStatus,
}: OrderCardProps) {
  const PaymentIcon =
    {
      Pix: QrCode,
      Cartão: CreditCard,
      "Cartão (Online)": CreditCard,
      Cartao: CreditCard,
      CartaoOnline: CreditCard,
      Dinheiro: Banknote,
    }[order.paymentMethod] || Banknote;

  const statusConfig = {
    PENDING: {
      color: "bg-blue-100 text-blue-700",
      border: "border-blue-200",
      icon: Timer,
    },
    PREPARING: {
      color: "bg-orange-100 text-orange-700",
      border: "border-orange-200",
      icon: ChefHat,
    },
    OUT: {
      color: "bg-purple-100 text-purple-700",
      border: "border-purple-200",
      icon: Bike,
    },
    COMPLETED: {
      color: "bg-green-100 text-green-700",
      border: "border-green-200",
      icon: CheckCircle2,
    },
    REJECTED: {
      color: "bg-red-100 text-red-700",
      border: "border-red-200",
      icon: XCircle,
    },
  };

  const config = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const getActionLabel = () => {
    switch (order.status) {
      case "PENDING":
        return "Aceitar Pedido";
      case "PREPARING":
        return "Despachar Entrega";
      case "OUT":
        return "Concluir";
      default:
        return null;
    }
  };

  const actionLabel = getActionLabel();

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    const width = 450;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      `/admin/orders/${order.id}/print`,
      "ImprimirPedido",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no`
    );
  };

  const handleMainAction = () => {
    if (onAdvance) {
      onAdvance(order.id);
    } else if (onUpdateStatus) {
      onUpdateStatus(order.id);
    }
  };

  return (
    <Card
      className={`border-2 shadow-sm ${config.border} flex flex-col h-full group relative`}
    >
      <CardHeader className="p-3 pb-2 bg-gray-50/50 border-b flex flex-row justify-between items-center space-y-0">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-white font-mono font-bold text-xs px-1.5"
          >
            {order.displayId}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {order.createdAt &&
              formatDistanceToNow(new Date(order.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-gray-200"
            onClick={handlePrint}
            title="Imprimir Cupom"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <StatusIcon className={`h-5 w-5 ${config.color.split(" ")[1]}`} />
        </div>
      </CardHeader>

      <CardContent className="p-3 flex-1 flex flex-col gap-3">
        <div className="flex items-start gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-gray-800 leading-none">
              {order.customerName}
            </p>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1" title={order.customerAddress}>
                {order.customerAddress}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3 flex-1">
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <div className="h-10 w-10 shrink-0 bg-gray-100 rounded-md overflow-hidden relative border border-gray-200">
                {item.product?.imageUrl ? (
                  <Image
                    src={item.product.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                    IMG
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex gap-1.5 leading-tight">
                  <span className="font-bold text-gray-900 text-xs mt-0.5">
                    {item.quantity}x
                  </span>
                  <span className="text-gray-700 font-medium">
                    {item.product?.name}
                  </span>
                </div>
                {item.optionsDescription && (
                  <p className="text-xs text-orange-600 mt-0.5 italic leading-tight">
                    {item.optionsDescription}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mt-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <PaymentIcon className="h-3.5 w-3.5" />
              <span>{order.paymentMethod}</span>
            </div>
            <span className="font-bold text-base text-gray-900">
              {formatCurrency(Number(order.totalPrice))}
            </span>
          </div>
          {order.trocoPara && (
            <div className="text-[10px] text-muted-foreground text-right mt-1">
              Troco para {formatCurrency(Number(order.trocoPara))}
            </div>
          )}
        </div>
      </CardContent>

      {(actionLabel || order.status === "PENDING") && (
        <CardFooter className="p-3 pt-0 flex gap-2">
          {order.status === "PENDING" && (
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-9"
              onClick={() => onReject(order.id)}
            >
              Rejeitar
            </Button>
          )}

          {actionLabel && (
            <Button
              className={`flex-1 h-9 font-bold ${
                order.status === "PENDING"
                  ? "bg-green-600 hover:bg-green-700"
                  : order.status === "PREPARING"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleMainAction}
            >
              {actionLabel}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
