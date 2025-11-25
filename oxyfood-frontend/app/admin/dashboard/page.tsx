"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { OrderColumn } from "@/components/admin/order-column";
import { mockOrders } from "@/data/mock-orders";
import { Order, OrderStatus } from "@/types/order";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // Função para mover o pedido para a próxima etapa
  const handleUpdateStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        let nextStatus: OrderStatus = order.status;
        if (order.status === "PENDING") nextStatus = "PREPARING";
        else if (order.status === "PREPARING") nextStatus = "OUT";
        else if (order.status === "OUT") nextStatus = "COMPLETED";

        return { ...order, status: nextStatus };
      })
    );
  };

  // Filtros
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING");
  const deliveryOrders = orders.filter((o) => o.status === "OUT");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar Fixa */}
      <Sidebar />

      {/* 2. Área Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Superior */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Painel de Pedidos
            </h1>
            <p className="text-sm text-muted-foreground">
              OxyFood - Hamburgueria Artesanal
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Toggle Loja */}
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Loja</span>
              <Switch checked={isStoreOpen} onCheckedChange={setIsStoreOpen} />
              <Badge className={isStoreOpen ? "bg-green-500" : "bg-red-500"}>
                {isStoreOpen ? "ABERTA" : "FECHADA"}
              </Badge>
            </div>

            {/* Busca */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pedidos..."
                className="pl-9 bg-gray-50"
              />
            </div>

            {/* Notificações */}
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {pendingOrders.length > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>
          </div>
        </header>

        {/* Área do Kanban (Scroll Horizontal se necessário) */}
        <div className="flex-1 p-6 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-6 h-full min-w-[1000px]">
            {/* Coluna 1: Novos */}
            <OrderColumn
              title="NOVOS PEDIDOS"
              colorClass="bg-red-500"
              orders={pendingOrders}
              onUpdateStatus={handleUpdateStatus}
            />

            {/* Coluna 2: Em Preparo */}
            <OrderColumn
              title="EM PREPARO"
              colorClass="bg-amber-500"
              orders={preparingOrders}
              onUpdateStatus={handleUpdateStatus}
            />

            {/* Coluna 3: Saiu para Entrega */}
            <OrderColumn
              title="SAIU PARA ENTREGA"
              colorClass="bg-green-600"
              orders={deliveryOrders}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
