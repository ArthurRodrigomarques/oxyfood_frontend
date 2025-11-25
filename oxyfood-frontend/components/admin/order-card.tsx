import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string) => void;
}

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const PaymentIcon =
    {
      Pix: Wallet,
      Cartão: CreditCard,
      Dinheiro: Banknote,
    }[order.paymentMethod] || Wallet;

  const getAction = () => {
    switch (order.status) {
      case "PENDING":
        return {
          label: "ACEITAR PEDIDO",
          color: "bg-orange-500 hover:bg-orange-600",
        };
      case "PREPARING":
        return {
          label: "PRONTO P/ ENTREGA",
          color: "bg-green-600 hover:bg-green-700",
        };
      case "OUT":
        return {
          label: "CONCLUIR PEDIDO",
          color: "bg-gray-100 hover:bg-gray-200 text-gray-900 border",
        };
      default:
        return null;
    }
  };

  const action = getAction();

  return (
    <Card className="mb-4 border-none shadow-sm ring-1 ring-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{order.displayId}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <Clock className="w-3 h-3 mr-1" />
              {order.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          {order.status === "PENDING" && (
            <Badge variant="destructive" className="uppercase">
              Novo
            </Badge>
          )}
        </div>

        {/* Dados do Cliente */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Phone className="w-4 h-4 mr-2" />
            {order.customerPhone}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{order.customerAddress}</span>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="border-t border-b py-3 mb-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.id}>
              <div className="font-medium text-sm">
                {item.quantity}x {item.name}
              </div>
              {item.extras && (
                <div className="text-xs text-muted-foreground pl-4">
                  {item.extras}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total e Pagamento */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <PaymentIcon className="w-4 h-4 mr-2" />
            {order.paymentMethod}
          </div>
          <div className="text-lg font-bold text-orange-500">
            R$ {order.totalPrice.toFixed(2)}
          </div>
        </div>

        {action && (
          <Button
            className={`w-full font-bold ${action.color}`}
            onClick={() => onUpdateStatus(order.id)}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
