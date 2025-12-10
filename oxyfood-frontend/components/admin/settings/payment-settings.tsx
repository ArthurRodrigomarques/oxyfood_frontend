"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Save, CreditCard, Lock } from "lucide-react";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const paymentSettingsSchema = z.object({
  pixKey: z.string().min(3, "Chave Pix é obrigatória"),
  mercadoPagoAccessToken: z.string().optional(),
});

type PaymentSettingsData = z.infer<typeof paymentSettingsSchema>;

interface UpdateSettingsPayload {
  pixKey: string;
  mercadoPagoAccessToken?: string;
}

interface RestaurantSettingsResponse {
  pixKey?: string;
  mercadoPagoAccessToken?: string;
}

export function PaymentSettings() {
  const { activeRestaurantId, user } = useAuthStore();

  const currentRestaurantSlug = user?.restaurants?.find(
    (r) => r.id === activeRestaurantId
  )?.slug;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentSettingsData>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      pixKey: "",
      mercadoPagoAccessToken: "",
    },
  });

  const { data: restaurantSettings } = useQuery({
    queryKey: ["restaurant-settings", activeRestaurantId],
    queryFn: async () => {
      if (!currentRestaurantSlug) return null;
      // Busca os dados atualizados do restaurante
      const response = await api.get<{
        restaurant: RestaurantSettingsResponse;
      }>(`/restaurants/${currentRestaurantSlug}`);
      return response.data.restaurant;
    },
    enabled: !!currentRestaurantSlug,
  });

  useEffect(() => {
    if (restaurantSettings) {
      if (restaurantSettings.pixKey) {
        setValue("pixKey", restaurantSettings.pixKey);
      }
    }
  }, [restaurantSettings, setValue]);

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (data: PaymentSettingsData) => {
      if (!activeRestaurantId) return;

      const payload: UpdateSettingsPayload = {
        pixKey: data.pixKey,
      };

      if (data.mercadoPagoAccessToken) {
        payload.mercadoPagoAccessToken = data.mercadoPagoAccessToken;
      }

      await api.put(`/restaurants/${activeRestaurantId}`, payload);
    },
    onSuccess: () => {
      toast.success("Configurações de pagamento salvas!");
    },
    onError: (error) => {
      console.error(error);
      let msg = "Erro ao salvar configurações.";
      if (error instanceof AxiosError) {
        msg = error.response?.data?.message || msg;
      }
      toast.error(msg);
    },
  });

  const onSubmit = (data: PaymentSettingsData) => {
    updateSettings(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integração de Pagamentos</CardTitle>
          <CardDescription>
            Configure suas chaves para receber via Pix e Cartão Online.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pixKey">Sua Chave Pix (Padrão)</Label>
            <Input
              id="pixKey"
              placeholder="CPF, CNPJ, Email ou Aleatória"
              {...register("pixKey")}
            />
            <p className="text-xs text-muted-foreground">
              Usada para pagamentos manuais ou fallback.
            </p>
            {errors.pixKey && (
              <span className="text-sm text-red-500">
                {errors.pixKey.message}
              </span>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Mercado Pago</h3>
                <p className="text-xs text-gray-500">
                  Para Pix Automático e Cartão de Crédito
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm text-yellow-800">
              <strong>Importante:</strong> Você precisa de um{" "}
              <code>Access Token</code> de produção do Mercado Pago para que o
              sistema gere QR Codes e Links de Pagamento automaticamente.
            </div>

            <div className="space-y-2">
              <Label htmlFor="mpToken" className="flex items-center gap-2">
                Access Token (Produção)
                <Lock className="h-3 w-3 text-gray-400" />
              </Label>
              <Input
                id="mpToken"
                type="password"
                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                {...register("mercadoPagoAccessToken")}
              />
              <p className="text-xs text-muted-foreground">
                Não compartilhamos este token. Deixe em branco se não quiser
                alterar.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 font-bold"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
