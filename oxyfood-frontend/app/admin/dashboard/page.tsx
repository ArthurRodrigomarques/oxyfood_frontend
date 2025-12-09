"use client";

import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { OrderColumn } from "@/components/admin/order-column";
import { OnboardingRestaurant } from "@/components/admin/onboarding-restaurant";
import { useAuthStore } from "@/store/auth-store";
import { Order } from "@/types/order";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";

// --- Interfaces locais para tipar a resposta da API ---
interface ApiOrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  optionsDescription: string | null;
  product: { name: string; imageUrl?: string | null } | null;
}

interface ApiOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalPrice: string;
  deliveryFee: string;
  paymentMethod: string;
  status: "PENDING" | "PREPARING" | "OUT" | "COMPLETED" | "REJECTED";
  createdAt: string;
  orderItems: ApiOrderItem[];
}

interface ApiResponse {
  orders: ApiOrder[];
}

interface RestaurantDetails {
  restaurant: {
    isOpen: boolean;
    name: string;
  };
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { activeRestaurantId, user } = useAuthStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.mp3");
    }
  }, []);

  const activeRestaurantSlug = user?.restaurants?.find(
    (r) => r.id === activeRestaurantId
  )?.slug;

  const { data: restaurantData } = useQuery({
    queryKey: ["restaurant-status", activeRestaurantId],
    queryFn: async () => {
      if (!activeRestaurantSlug) return null;
      const response = await api.get<RestaurantDetails>(
        `/restaurants/${activeRestaurantSlug}`
      );
      return response.data;
    },
    enabled: !!activeRestaurantSlug,
  });

  const isStoreOpen = restaurantData?.restaurant?.isOpen ?? false;

  const { mutate: toggleStoreStatus, isPending: isToggling } = useMutation({
    mutationFn: async (checked: boolean) => {
      await api.patch(`/restaurants/${activeRestaurantId}/toggle-status`, {
        isOpen: checked,
      });
    },
    onSuccess: (_, variables) => {
      const statusText = variables ? "ABERTA" : "FECHADA";
      toast.success(`A loja agora está ${statusText}`);
      queryClient.invalidateQueries({ queryKey: ["restaurant-status"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-public"] });
    },
    onError: () => {
      toast.error("Erro ao alterar status da loja.");
    },
  });

  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    isRefetching,
  } = useQuery({
    queryKey: ["orders", activeRestaurantId],
    queryFn: async () => {
      if (!activeRestaurantId) return [];
      const response = await api.get<ApiResponse>(
        `/restaurants/${activeRestaurantId}/orders`
      );

      return response.data.orders.map((order) => ({
        id: order.id,
        displayId: `#${order.id.substring(0, 4).toUpperCase()}`,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        totalPrice: Number(order.totalPrice),
        deliveryFee: Number(order.deliveryFee || 0), // Correção: Mapeando deliveryFee
        paymentMethod: order.paymentMethod as "Pix" | "Dinheiro" | "Cartão",
        status: order.status,
        createdAt: new Date(order.createdAt),
        items: order.orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice || 0),
          optionsDescription: item.optionsDescription || undefined,
          product: {
            name: item.product?.name || "Produto Indisponível",
            imageUrl: item.product?.imageUrl || null,
          },
        })),
      })) as Order[];
    },
    enabled: !!activeRestaurantId,
  });

  useEffect(() => {
    if (!activeRestaurantId) return;

    const token = localStorage.getItem("oxyfood-token");
    const socketUrl = "http://localhost:3333";

    const socket = io(socketUrl, {
      auth: {
        token: token,
      },
    });

    socket.on("connect", () => {
      console.log("Conectado ao WebSocket!");
      socket.emit("join-restaurant", activeRestaurantId);
    });

    socket.on("connect_error", (err) => {
      console.error("Erro de conexão no socket:", err.message);
      if (
        err.message === "Autenticação necessária." ||
        err.message === "Token inválido ou expirado."
      ) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
      }
    });

    socket.on("new-order", (newOrder) => {
      audioRef.current
        ?.play()
        .catch((e) => console.log("Som bloqueado pelo navegador", e));

      toast.success(`Novo pedido de ${newOrder.customerName}!`, {
        duration: 5000,
        icon: "🍔",
        description: `Valor: R$ ${Number(newOrder.totalPrice).toFixed(2)}`,
      });

      queryClient.invalidateQueries({ queryKey: ["orders"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [activeRestaurantId, queryClient]);

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: string;
      newStatus: string;
    }) => {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
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

  const handleReject = (orderId: string) => {
    if (confirm("Tem certeza que deseja rejeitar este pedido?")) {
      updateStatus({ orderId, newStatus: "REJECTED" });
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING");
  const deliveryOrders = orders.filter((o) => o.status === "OUT");

  if (!activeRestaurantId) {
    return (
      <main className="flex-1 h-screen overflow-y-auto bg-gray-50">
        <OnboardingRestaurant />
      </main>
    );
  }

  if (isLoadingOrders) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="bg-white border-b px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              Painel de Pedidos
              {isRefetching && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Gerencie seus pedidos em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
              isStoreOpen
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <span
              className={`text-xs font-bold ${
                isStoreOpen ? "text-green-700" : "text-red-700"
              }`}
            >
              {isStoreOpen ? "ABERTO" : "FECHADO"}
            </span>
            <Switch
              checked={isStoreOpen}
              onCheckedChange={(checked) => toggleStoreStatus(checked)}
              disabled={isToggling}
              className="scale-75 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-400"
            />
          </div>

          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pedidos..."
              className="pl-9 h-9 bg-gray-50 text-sm"
            />
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["orders"] });
                queryClient.invalidateQueries({
                  queryKey: ["restaurant-status"],
                });
              }}
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="relative shrink-0 h-9 w-9"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {pendingOrders.length > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Kanban */}
      <div className="flex-1 p-4 overflow-y-auto md:overflow-hidden bg-gray-50/50">
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-full md:overflow-x-auto pb-4 md:pb-0 min-w-0">
          <OrderColumn
            title="NOVOS PEDIDOS"
            colorClass="bg-blue-500"
            orders={pendingOrders}
            onUpdateStatus={handleUpdateStatus}
            onReject={handleReject}
          />

          <OrderColumn
            title="EM PREPARO"
            colorClass="bg-orange-500"
            orders={preparingOrders}
            onUpdateStatus={handleUpdateStatus}
            onReject={handleReject}
          />

          <OrderColumn
            title="SAIU PARA ENTREGA"
            colorClass="bg-purple-600"
            orders={deliveryOrders}
            onUpdateStatus={handleUpdateStatus}
            onReject={handleReject}
          />
        </div>
      </div>
    </main>
  );
}
