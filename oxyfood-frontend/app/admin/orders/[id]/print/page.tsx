"use client";

import { use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { OrderReceipt } from "@/components/admin/print/order-receipt";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-print", id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}/status`);
      return response.data;
    },
  });

  useEffect(() => {
    if (order) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
        <span className="ml-2">Carregando cupom...</span>
      </div>
    );
  }

  if (!order) {
    return <div className="p-4 text-center">Pedido não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="mb-6 flex gap-4 print:hidden">
        <Button onClick={() => window.print()}>Imprimir Novamente</Button>
        <Button variant="outline" onClick={() => window.close()}>
          Fechar
        </Button>
      </div>

      <OrderReceipt order={order} />
    </div>
  );
}
