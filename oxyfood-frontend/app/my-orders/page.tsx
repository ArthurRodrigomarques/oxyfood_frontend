"use client";

import { useOrderHistoryStore } from "@/store/order-history-store";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MyOrdersPage() {
  const { orders } = useOrderHistoryStore();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b py-6 px-4 shadow-sm">
        <div className="container max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-orange-500" />
            Meus Pedidos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Histórico das suas últimas compras
          </p>
        </div>
      </div>

      <div className="container max-w-lg mx-auto p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="bg-gray-200 p-6 rounded-full mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">
              Nenhum pedido ainda
            </h3>
            <p className="text-gray-500 max-w-[250px] mt-2 mb-6">
              Seus pedidos realizados aparecerão aqui para você acompanhar.
            </p>
            <Button asChild>
              <Link href="/">Fazer um Pedido</Link>
            </Button>
          </div>
        ) : (
          orders.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center p-4"
                >
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {order.restaurantName}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(order.date), "dd/MM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-xs text-orange-600 font-medium flex items-center justify-end mt-1">
                      Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
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
