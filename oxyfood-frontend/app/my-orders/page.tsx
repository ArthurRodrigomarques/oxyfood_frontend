"use client";

import { useEffect, useState } from "react";
import { useOrderHistoryStore } from "@/store/order-history-store";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Clock,
  ArrowLeft,
  Store,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MyOrdersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { orders } = useOrderHistoryStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const lastRestaurantSlug = orders[0]?.restaurantSlug;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b py-4 px-4 shadow-sm sticky top-0 z-10">
        <div className="container max-w-lg mx-auto flex items-center gap-3">
          {lastRestaurantSlug ? (
            <Link href={`/restaurants/${lastRestaurantSlug}`}>
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
          )}

          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Meus Pedidos
            </h1>
          </div>

          {lastRestaurantSlug && (
            <Link href={`/restaurants/${lastRestaurantSlug}`}>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Cardápio</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="container max-w-lg mx-auto p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">
              Nenhum pedido ainda
            </h3>
            <p className="text-gray-500 max-w-[250px] mt-2 mb-6 text-sm">
              Seus pedidos realizados aparecerão aqui.
            </p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Buscar Restaurantes
              </Button>
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-orange-500"
            >
              <CardContent className="p-0">
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mr-4 border border-orange-200">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate text-base">
                      {order.restaurantName || "Restaurante"}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {order.date
                        ? format(new Date(order.date), "dd/MM 'às' HH:mm", {
                            locale: ptBR,
                          })
                        : "Data indisponível"}
                    </div>
                  </div>

                  <div className="text-right pl-2">
                    <div className="font-bold text-gray-900 text-sm">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-orange-600 flex items-center justify-end mt-1 gap-1">
                      Ver <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
