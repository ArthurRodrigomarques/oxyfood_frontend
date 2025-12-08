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
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  LucideIcon,
  Store,
} from "lucide-react";
import { RestaurantData } from "@/types/order";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { formatCurrency, cn } from "@/lib/utils";
import Image from "next/image";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome muito curto"),
  customerPhone: z.string().min(9, "Telefone inválido"),
  customerAddress: z.string().min(10, "Endereço muito curto"),
  paymentMethod: z.enum(["Dinheiro", "Pix", "Cartao"]),
  trocoPara: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutSheetProps {
  restaurant: RestaurantData;
}

interface PaymentOptionProps {
  value: "Dinheiro" | "Pix" | "Cartao";
  icon: LucideIcon;
  label: string;
  selected: string;
}

function PaymentOption({
  value,
  icon: Icon,
  label,
  selected,
}: PaymentOptionProps) {
  return (
    <Label
      htmlFor={value}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-muted/50",
        selected === value
          ? "border-orange-500 bg-orange-50 text-orange-700"
          : "border-muted bg-white text-muted-foreground"
      )}
    >
      <RadioGroupItem value={value} id={value} className="sr-only" />
      <Icon
        className={cn(
          "h-6 w-6",
          selected === value ? "text-orange-500" : "text-gray-400"
        )}
      />
      <span className="text-xs font-bold">{label}</span>
    </Label>
  );
}

export function CheckoutSheet({ restaurant }: CheckoutSheetProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"cart" | "details">("cart");

  const { items, removeItem, clearCart } = useCartStore();

  const cartTotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = Number(restaurant.deliveryFee || 0);
  const finalTotal = cartTotal + deliveryFee;

  // VERIFICAÇÃO DE LOJA FECHADA
  const isStoreClosed = !restaurant.isOpen;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "Cartao",
    },
  });

  const selectedPayment = watch("paymentMethod");

  async function onSubmit(data: CheckoutFormData) {
    if (items.length === 0) return;
    if (isStoreClosed) {
      toast.error("A loja está fechada no momento.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
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

      const createdOrder = response.data.order || response.data;

      // Limpeza do carrinho e UI
      clearCart();
      setIsOpen(false);
      setStep("cart");
      reset();

      if (data.paymentMethod === "Pix") {
        toast.success("Pedido criado! Pague com Pix agora.", {
          description: "O QR Code aparecerá na próxima tela.",
        });
        router.push(`/orders/${createdOrder.id}`);
        return;
      }

      if (data.paymentMethod === "Cartao" && createdOrder.ticketUrl) {
        window.location.href = createdOrder.ticketUrl;
        return;
      }

      toast.success("Pedido enviado!", {
        description: "Aguarde a confirmação do restaurante.",
      });
      router.push(`/orders/${createdOrder.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar pedido.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2 px-6">
          <ShoppingCart className="h-5 w-5" />
          <span>{formatCurrency(cartTotal)}</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0 bg-gray-50 border-l shadow-2xl">
        <SheetHeader className="px-5 py-4 bg-white border-b shrink-0 flex flex-row items-center gap-4 space-y-0">
          {step === "details" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setStep("cart")}
              className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-6" />
          )}

          <SheetTitle className="text-lg font-bold text-gray-800 flex-1 text-center pr-6">
            {step === "cart" ? "Sua Sacola" : "Finalizar Pedido"}
          </SheetTitle>
        </SheetHeader>

        {/* AVISO DE LOJA FECHADA */}
        {isStoreClosed && (
          <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3 text-red-800 animate-in slide-in-from-top-2">
            <div className="bg-red-100 p-2 rounded-full">
              <Store className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Loja Fechada</p>
              <p className="text-xs text-red-600/80">
                Não estamos aceitando pedidos agora.
              </p>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-orange-100 p-6 rounded-full mb-4">
              <ShoppingCart className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Sacola Vazia</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-[200px]">
              Parece que você ainda não escolheu nada delicioso.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="mt-6 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Ver Cardápio
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 bg-gray-50 h-full">
              <div className="px-5 py-6 pb-64">
                {step === "cart" ? (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2"
                      >
                        <div className="h-16 w-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                          {item.product.imageUrl && (
                            <Image
                              src={item.product.imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                              {item.quantity}x {item.product.name}
                            </h4>
                            <span className="font-bold text-sm text-gray-900">
                              {formatCurrency(item.totalPrice)}
                            </span>
                          </div>

                          {item.selectedOptions.length > 0 && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {item.selectedOptions
                                .map((o) => o.name)
                                .join(", ")}
                            </p>
                          )}

                          <div className="flex justify-between items-end mt-1">
                            {item.notes ? (
                              <p className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded max-w-[150px] truncate">
                                Obs: {item.notes}
                              </p>
                            ) : (
                              <span />
                            )}

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form
                    id="checkout-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <User className="h-4 w-4 text-orange-500" />
                        Dados Pessoais
                      </div>
                      <div className="grid gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">
                            Nome Completo
                          </Label>
                          <Input
                            {...register("customerName")}
                            className="bg-gray-50"
                            placeholder="Ex: João Silva"
                          />
                          {errors.customerName && (
                            <span className="text-xs text-red-500">
                              {errors.customerName.message}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">
                            Celular
                          </Label>
                          <Input
                            {...register("customerPhone")}
                            className="bg-gray-50"
                            placeholder="(11) 99999-9999"
                          />
                          {errors.customerPhone && (
                            <span className="text-xs text-red-500">
                              {errors.customerPhone.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        Entrega
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">
                          Endereço Completo
                        </Label>
                        <Textarea
                          {...register("customerAddress")}
                          className="bg-gray-50 min-h-[80px] resize-none"
                          placeholder="Rua, Número, Bairro e Complemento"
                        />
                        {errors.customerAddress && (
                          <span className="text-xs text-red-500">
                            {errors.customerAddress.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-9 rounded-xl border border-gray-100 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <Banknote className="h-4 w-4 text-orange-500" />
                        Pagamento na Entrega
                      </div>

                      <RadioGroup
                        defaultValue="Cartao"
                        onValueChange={(val) => {
                          if (
                            val === "Cartao" ||
                            val === "Pix" ||
                            val === "Dinheiro"
                          ) {
                            setValue("paymentMethod", val);
                          }
                        }}
                        className="grid grid-cols-3 gap-3"
                      >
                        <PaymentOption
                          value="Cartao"
                          icon={CreditCard}
                          label="Cartão"
                          selected={selectedPayment}
                        />
                        <PaymentOption
                          value="Pix"
                          icon={QrCode}
                          label="Pix"
                          selected={selectedPayment}
                        />
                        <PaymentOption
                          value="Dinheiro"
                          icon={Banknote}
                          label="Dinheiro"
                          selected={selectedPayment}
                        />
                      </RadioGroup>

                      {selectedPayment === "Dinheiro" && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                          <Label className="text-xs text-gray-500">
                            Troco para quanto?
                          </Label>
                          <Input
                            type="number"
                            {...register("trocoPara")}
                            placeholder="Ex: 50,00 (Deixe vazio se não precisar)"
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 w-full p-5 bg-white border-t space-y-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] z-20">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxa de Entrega</span>
                  <span>
                    {deliveryFee === 0 ? "Grátis" : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-xl font-extrabold text-orange-600">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {step === "cart" ? (
                <Button
                  className="w-full h-12 text-base font-bold bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setStep("details")}
                  disabled={isStoreClosed}
                >
                  Continuar para Entrega
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  form="checkout-form"
                  type="submit"
                  disabled={isSubmitting || isStoreClosed}
                  className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 rounded-xl shadow-lg hover:shadow-green-200 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : selectedPayment === "Pix" ? (
                    "Pagar com Pix"
                  ) : (
                    "Confirmar Pedido"
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
