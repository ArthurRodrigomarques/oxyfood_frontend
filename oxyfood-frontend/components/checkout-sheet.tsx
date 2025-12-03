"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  ShoppingCart,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";
import { RestaurantData } from "@/data/mock-restaurant";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome é obrigatório (mín. 3 letras)"),
  customerPhone: z.string().min(9, "Telefone inválido"),
  customerAddress: z.string().min(10, "Endereço completo é obrigatório"),
  paymentMethod: z.enum(["Dinheiro", "Pix", "Cartao"], {
    message: "Selecione uma forma de pagamento",
  }),
  trocoPara: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutSheetProps {
  restaurant: RestaurantData;
}

export function CheckoutSheet({ restaurant }: CheckoutSheetProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, removeItem, clearCart } = useCartStore();

  const cartTotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = Number(restaurant.deliveryFee || 0);
  const finalTotal = cartTotal + deliveryFee;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "Cartao",
    },
  });

  const selectedPayment = watch("paymentMethod");

  async function onSubmit(data: CheckoutFormData) {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Formatação do payload conforme esperado pelo backend
      const payload = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        paymentMethod: data.paymentMethod,
        trocoPara: data.trocoPara ? Number(data.trocoPara) : undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          options: item.selectedOptions.map((opt) => opt.id),
        })),
      };

      const response = await api.post(
        `/restaurants/${restaurant.id}/orders`,
        payload
      );

      const newOrderId = response.data.order.id;

      toast.success("Pedido realizado com sucesso!");
      clearCart();
      reset();
      setIsOpen(false);

      router.push(`/orders/${newOrderId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0 gap-0 bg-gray-50">
        <SheetHeader className="p-4 bg-white border-b shrink-0">
          <SheetTitle>Seu Carrinho</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
            <p>Seu carrinho está vazio.</p>
            <Button
              variant="link"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-primary"
            >
              Voltar ao cardápio
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4 py-6">
              {/* Lista de Itens */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="font-bold text-sm">
                          R$ {item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qtd: {item.quantity}
                      </p>
                      {item.selectedOptions.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          + {item.selectedOptions.map((o) => o.name).join(", ")}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-orange-600 mt-1 italic">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 self-center"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Formulário de Checkout */}
              <form
                id="checkout-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-900 uppercase tracking-wider">
                    Entrega
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Seu Nome</Label>
                    <Input
                      id="name"
                      placeholder="Como devemos te chamar?"
                      {...register("customerName")}
                      className="bg-white"
                    />
                    {errors.customerName && (
                      <span className="text-xs text-red-500">
                        {errors.customerName.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Celular / WhatsApp</Label>
                    <Input
                      id="phone"
                      placeholder="(99) 99999-9999"
                      {...register("customerPhone")}
                      className="bg-white"
                    />
                    {errors.customerPhone && (
                      <span className="text-xs text-red-500">
                        {errors.customerPhone.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço de Entrega</Label>
                    <Textarea
                      id="address"
                      placeholder="Rua, Número, Bairro, Complemento"
                      {...register("customerAddress")}
                      className="bg-white min-h-[80px]"
                    />
                    {errors.customerAddress && (
                      <span className="text-xs text-red-500">
                        {errors.customerAddress.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-900 uppercase tracking-wider">
                    Pagamento
                  </h3>

                  <RadioGroup
                    defaultValue="Cartao"
                    onValueChange={(val) =>
                      reset({
                        ...watch(),
                        paymentMethod: val as "Cartao" | "Pix" | "Dinheiro",
                      })
                    }
                    className="grid grid-cols-3 gap-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="Cartao"
                        id="card"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                      >
                        <CreditCard className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-xs font-medium">Cartão</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="Pix"
                        id="pix"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="pix"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                      >
                        <QrCode className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-xs font-medium">Pix</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="Dinheiro"
                        id="money"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="money"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                      >
                        <Banknote className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-xs font-medium">Dinheiro</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.paymentMethod && (
                    <span className="text-xs text-red-500">
                      {errors.paymentMethod.message}
                    </span>
                  )}

                  {selectedPayment === "Dinheiro" && (
                    <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-2">
                      <Label htmlFor="change">Troco para quanto?</Label>
                      <Input
                        id="change"
                        type="number"
                        placeholder="Ex: 50,00 (Deixe vazio se não precisar)"
                        {...register("trocoPara")}
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              </form>
            </ScrollArea>

            <SheetFooter className="p-4 bg-white border-t space-y-4 sm:space-y-0 block">
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">
                    R$ {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                form="checkout-form"
                type="submit"
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Finalizar Pedido"
                )}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
