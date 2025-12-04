import { Order } from "@/types/order";
import { OrderCard } from "./order-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="flex-1 min-w-[350px] bg-gray-50/50 rounded-xl border border-gray-200/60 h-full flex flex-col overflow-hidden">
      <div
        className={`p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${colorClass.replace(
              "bg-",
              "bg-"
            )}`}
          />
          <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">
            {title}
          </span>
        </div>
        <Badge
          variant="secondary"
          className={`${colorClass
            .replace("bg-", "bg-")
            .replace("500", "100")} ${colorClass
            .replace("bg-", "text-")
            .replace("500", "700")}`}
        >
          {orders.length}
        </Badge>
      </div>

      {/* Lista de Cards */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3 pb-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={onUpdateStatus}
              onReject={onReject}
            />
          ))}
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-50">
              <p className="text-sm font-medium">Nenhum pedido</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
