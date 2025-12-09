"use client";

import { Order } from "@/types/order";
import { OrderCard } from "./order-card";
import { Badge } from "@/components/ui/badge";

interface OrderColumnProps {
  title: string;
  colorClass: string;
  orders: Order[];
  onUpdateStatus: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

export function OrderColumn({
  title,
  colorClass,
  orders,
  onUpdateStatus,
  onReject,
}: OrderColumnProps) {
  return (
    <div className="flex-none md:flex-1 w-full md:w-auto md:min-w-[350px] bg-gray-50/50 rounded-xl border border-gray-200/60 h-[500px] md:h-full flex flex-col overflow-hidden shadow-sm">
      {/* Cabeçalho da Coluna */}
      <div
        className={`p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10 shrink-0`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colorClass}`} />
          <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">
            {title}
          </span>
        </div>
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-700 border-gray-200"
        >
          {orders.length}
        </Badge>
      </div>

      {/* Área de Rolagem Nativa */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-100/50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onAdvance={onUpdateStatus}
            onReject={onReject}
          />
        ))}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <p className="text-sm font-medium">Nenhum pedido</p>
          </div>
        )}
      </div>
    </div>
  );
}
