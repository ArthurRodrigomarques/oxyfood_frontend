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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderCardProps {
  order: Order;
  onAdvance: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

export function OrderCard({ order, onAdvance, onReject }: OrderCardProps) {
  const PaymentIcon =
    {
      Pix: QrCode,
      Cartão: CreditCard,
      Cartao: CreditCard, // Garantindo compatibilidade
      Dinheiro: Banknote,
    }[order.paymentMethod] || Banknote;

  // Define cores e ícones baseados no status
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

  // Texto do botão principal
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

  return (
    <Card
      className={`border-2 shadow-sm ${config.border} flex flex-col h-full`}
    >
      {/* CABEÇALHO */}
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
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
        <StatusIcon className={`h-5 w-5 ${config.color.split(" ")[1]}`} />
      </CardHeader>

      <CardContent className="p-3 flex-1 flex flex-col gap-3">
        {/* Cliente */}
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

        {/* Itens */}
        <div className="space-y-2 flex-1">
          {order.items.map((item, i) => (
            <div key={i} className="text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-gray-900 bg-gray-100 px-1.5 rounded h-fit text-xs border border-gray-200">
                  {item.quantity}x
                </span>
                <span className="text-gray-700 font-medium leading-tight">
                  {item.name}
                </span>
              </div>
              {item.extras && (
                <p className="text-xs text-muted-foreground pl-7 mt-0.5 italic">
                  + {item.extras}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Total e Pagamento */}
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mt-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <PaymentIcon className="h-3.5 w-3.5" />
              <span>{order.paymentMethod}</span>
            </div>
            <span className="font-bold text-base text-gray-900">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>

      {/* AÇÕES (FOOTER) */}
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
              onClick={() => onAdvance(order.id)}
            >
              {actionLabel}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
