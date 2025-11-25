import { Order } from "@/types/order";
import { OrderCard } from "./order-card";
import { Badge } from "@/components/ui/badge";

interface OrderColumnProps {
  title: string;
  colorClass: string; // Ex: "bg-red-500"
  orders: Order[];
  onUpdateStatus: (orderId: string) => void;
}

export function OrderColumn({
  title,
  colorClass,
  orders,
  onUpdateStatus,
}: OrderColumnProps) {
  return (
    <div className="flex-1 min-w-[350px] bg-gray-50/50 rounded-lg p-2 h-full flex flex-col">
      <div
        className={`${colorClass} text-white p-3 rounded-md mb-4 flex justify-between items-center shadow-sm`}
      >
        <span className="font-bold text-sm uppercase tracking-wide">
          {title}
        </span>
        <Badge
          variant="secondary"
          className="bg-white/20 text-white hover:bg-white/30 border-none"
        >
          {orders.length}
        </Badge>
      </div>

      {/* Lista de Cards */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
        {orders.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-10 italic opacity-50">
            Nenhum pedido aqui
          </div>
        )}
      </div>
    </div>
  );
}
