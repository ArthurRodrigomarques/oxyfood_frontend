"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { OrderColumn } from "@/components/admin/order-column";
import { Order } from "@/types/order";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const RESTAURANT_ID = "4fce2fd8-40f5-4a70-b922-32999bb50c3f";

interface ApiOrderItem {
  id: string;
  quantity: number;
  optionsDescription: string | null;
  product: {
    name: string;
  } | null;
}

interface ApiOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalPrice: string;
  paymentMethod: string;
  status: "PENDING" | "PREPARING" | "OUT" | "COMPLETED" | "REJECTED";
  createdAt: string;
  orderItems: ApiOrderItem[];
}

interface ApiResponse {
  orders: ApiOrder[];
}

export default function DashboardPage() {
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const queryClient = useQueryClient();

  // 1. BUSCAR PEDIDOS (GET)
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", RESTAURANT_ID],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(
        `/restaurants/${RESTAURANT_ID}/orders`
      );

      return response.data.orders.map((order) => ({
        id: order.id,
        displayId: `#${order.id.substring(0, 4).toUpperCase()}`,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        totalPrice: Number(order.totalPrice),
        paymentMethod: order.paymentMethod as "Pix" | "Dinheiro" | "Cartão",
        status: order.status,
        createdAt: new Date(order.createdAt),
        items: order.orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          name: item.product?.name || "Produto Indisponível",
          extras: item.optionsDescription || undefined,
        })),
      })) as Order[];
    },
    refetchInterval: 10000,
  });

  // 2. ATUALIZAR STATUS (PATCH)
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: string;
      newStatus: string;
    }) => {
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      toast.success("Status do pedido atualizado!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar pedido.");
    },
  });

  const handleUpdateStatus = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let nextStatus = "";
    if (order.status === "PENDING") nextStatus = "PREPARING";
    else if (order.status === "PREPARING") nextStatus = "OUT";
    else if (order.status === "OUT") nextStatus = "COMPLETED";

    if (nextStatus) {
      updateStatus({ orderId, newStatus: nextStatus });
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING");
  const deliveryOrders = orders.filter((o) => o.status === "OUT");

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="bg-white border-b px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <MobileSidebar />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Painel de Pedidos
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              OxyFood - Hamburgueria Artesanal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <span className="text-xs sm:text-sm font-medium text-gray-600 hidden sm:inline">
              Loja
            </span>
            <Switch checked={isStoreOpen} onCheckedChange={setIsStoreOpen} />
            <Badge className={isStoreOpen ? "bg-green-500" : "bg-red-500"}>
              {isStoreOpen ? "ON" : "OFF"}
            </Badge>
          </div>

          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pedidos..."
              className="pl-9 bg-gray-50"
            />
          </div>

          <Button size="icon" variant="ghost" className="relative shrink-0">
            <Bell className="h-5 w-5 text-gray-600" />
            {pendingOrders.length > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-6 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 sm:gap-6 h-full min-w-[300px] md:min-w-[1000px] flex-col md:flex-row">
          <OrderColumn
            title="NOVOS PEDIDOS"
            colorClass="bg-red-500"
            orders={pendingOrders}
            onUpdateStatus={handleUpdateStatus}
          />

          <OrderColumn
            title="EM PREPARO"
            colorClass="bg-amber-500"
            orders={preparingOrders}
            onUpdateStatus={handleUpdateStatus}
          />

          <OrderColumn
            title="SAIU PARA ENTREGA"
            colorClass="bg-green-600"
            orders={deliveryOrders}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </main>
  );
}
