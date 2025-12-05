"use client";

import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReceiptData {
  id: string;
  displayId?: string;
  createdAt: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  trocoPara?: string | number | null;
  subTotalPrice: string | number;
  deliveryFee: string | number;
  totalPrice: string | number;
  restaurant: {
    name: string;
    phoneNumber: string;
  };
  orderItems: {
    id: string;
    quantity: number;
    unitPrice: string | number;
    optionsDescription?: string | null;
    product: {
      name: string;
    };
  }[];
}

interface OrderReceiptProps {
  order: ReceiptData;
}

export function OrderReceipt({ order }: OrderReceiptProps) {
  return (
    <div className="w-[300px] sm:w-[380px] bg-white p-4 text-black font-mono text-xs sm:text-sm leading-tight mx-auto border border-gray-200 print:border-none print:w-full">
      {/* CABEÇALHO */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold uppercase">{order.restaurant.name}</h2>
        <p>{order.restaurant.phoneNumber}</p>
        <p className="mt-2 border-y border-dashed border-black py-1">
          Pedido #{order.id.slice(0, 4).toUpperCase()}
        </p>
        <p className="mt-1">
          {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          })}
        </p>
      </div>

      {/* CLIENTE */}
      <div className="mb-4">
        <p className="font-bold border-b border-black mb-1">CLIENTE</p>
        <p className="font-bold text-sm">{order.customerName}</p>
        <p>{order.customerPhone}</p>
        <p className="mt-1 font-bold">Endereço:</p>
        <p className="break-words">{order.customerAddress}</p>
      </div>

      {/* ITENS */}
      <div className="mb-4">
        <p className="font-bold border-b border-black mb-2">ITENS</p>
        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between font-bold">
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <span>
                  {formatCurrency(Number(item.unitPrice) * item.quantity)}
                </span>
              </div>
              {item.optionsDescription && (
                <p className="pl-4 text-[10px] text-gray-600">
                  + {item.optionsDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-black my-2" />

      {/* TOTAIS */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subTotalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa de Entrega</span>
          <span>{formatCurrency(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-base mt-2 border-t border-black pt-1">
          <span>TOTAL</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>

      {/* PAGAMENTO */}
      <div className="border border-black p-2 text-center mb-6">
        <p className="font-bold">FORMA DE PAGAMENTO</p>
        <p className="uppercase text-sm">{order.paymentMethod}</p>
        {order.paymentMethod === "Dinheiro" && order.trocoPara && (
          <p className="text-xs mt-1">
            Troco para: {formatCurrency(order.trocoPara)}
          </p>
        )}
      </div>

      <div className="text-center text-[10px]">
        <p>*** FIM DO PEDIDO ***</p>
        <p className="mt-1">OxyFood Delivery</p>
      </div>
    </div>
  );
}
