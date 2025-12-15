"use client";

import { useEffect } from "react";
import { useForm, useWatch, Resolver } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const deliverySettingsSchema = z
  .object({
    deliveryFee: z.coerce.number().min(0, "A taxa não pode ser negativa"),
    isOpen: z.boolean(),
    freeDeliveryAbove: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      return Number(val);
    }, z.number().min(0).nullable()),
    deliveryTimeMin: z.coerce.number().min(1, "Mínimo 1 minuto"),
    deliveryTimeMax: z.coerce.number().min(1, "Mínimo 1 minuto"),
  })
  .refine((data) => data.deliveryTimeMax >= data.deliveryTimeMin, {
    message: "O tempo máximo deve ser maior ou igual ao mínimo",
    path: ["deliveryTimeMax"],
  });

type DeliverySettingsData = z.infer<typeof deliverySettingsSchema>;

interface UserRestaurant {
  id: string;
  slug: string;
}

interface MeResponse {
  user: {
    restaurants: UserRestaurant[];
  };
}

interface RestaurantDetailsResponse {
  restaurant: {
    deliveryFee: string | number;
    freeDeliveryAbove: string | number | null;
    isOpen: boolean;
    deliveryTimeMin?: number;
    deliveryTimeMax?: number;
  };
}

export function DeliverySettings() {
  const { activeRestaurantId } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<DeliverySettingsData>({
    resolver: zodResolver(
      deliverySettingsSchema
    ) as Resolver<DeliverySettingsData>,
    defaultValues: {
      isOpen: false,
      deliveryFee: 0,
      freeDeliveryAbove: null,
      deliveryTimeMin: 30,
      deliveryTimeMax: 45,
    },
  });

  const isOpen = useWatch({ control, name: "isOpen" });

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant-settings", activeRestaurantId],
    queryFn: async () => {
      if (!activeRestaurantId) return null;

      const meRes = await api.get<MeResponse>("/me");
      const myRest = meRes.data.user.restaurants.find(
        (r) => r.id === activeRestaurantId
      );

      if (!myRest) return null;

      const res = await api.get<RestaurantDetailsResponse>(
        `/restaurants/${myRest.slug}`
      );
      return res.data.restaurant;
    },
    enabled: !!activeRestaurantId,
  });

  useEffect(() => {
    if (restaurant) {
      setValue("deliveryFee", Number(restaurant.deliveryFee));
      setValue(
        "freeDeliveryAbove",
        restaurant.freeDeliveryAbove !== null
          ? Number(restaurant.freeDeliveryAbove)
          : null
      );
      setValue("isOpen", restaurant.isOpen);
      setValue("deliveryTimeMin", restaurant.deliveryTimeMin || 30);
      setValue("deliveryTimeMax", restaurant.deliveryTimeMax || 45);
    }
  }, [restaurant, setValue]);

  const { mutate: saveSettings, isPending } = useMutation({
    mutationFn: async (data: DeliverySettingsData) => {
      await api.put(`/restaurants/${activeRestaurantId}`, {
        deliveryFee: data.deliveryFee,
        freeDeliveryAbove: data.freeDeliveryAbove,
        deliveryTimeMin: data.deliveryTimeMin,
        deliveryTimeMax: data.deliveryTimeMax,
      });

      await api.patch(`/restaurants/${activeRestaurantId}/toggle-status`, {
        isOpen: data.isOpen,
      });
    },
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-public"] });
    },
    onError: () => {
      toast.error("Erro ao salvar configurações.");
    },
  });

  const onSubmit = (data: DeliverySettingsData) => {
    saveSettings(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Entrega</CardTitle>
        <CardDescription>
          Gerencie taxas e disponibilidade da loja
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-gray-50">
            <div className="space-y-0.5">
              <Label className="text-base font-bold">Loja Aberta</Label>
              <p className="text-sm text-muted-foreground">
                {isOpen
                  ? "Sua loja está visível e recebendo pedidos."
                  : "Sua loja está fechada. Clientes não podem pedir."}
              </p>
            </div>
            <Switch
              checked={isOpen}
              onCheckedChange={(checked) => setValue("isOpen", checked)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="delivery-fee">Taxa de Entrega Padrão (R$)</Label>
              <Input
                id="delivery-fee"
                type="number"
                step="0.50"
                placeholder="Ex: 5.00"
                {...register("deliveryFee")}
              />
              {errors.deliveryFee && (
                <span className="text-xs text-red-500">
                  {errors.deliveryFee.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="free-delivery">
                Entrega Grátis acima de (R$)
              </Label>
              <Input
                id="free-delivery"
                type="number"
                step="1.00"
                placeholder="Ex: 50.00 (Opcional)"
                {...register("freeDeliveryAbove")}
              />
              <p className="text-[10px] text-muted-foreground">
                Deixe vazio ou 0 para cobrar entrega sempre.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tempo de Entrega (minutos)</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  {...register("deliveryTimeMin")}
                />
              </div>
              <span className="text-gray-400 font-bold">-</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Máx"
                  {...register("deliveryTimeMax")}
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Ex: 30 - 45 min. Isso aparecerá para o cliente.
            </p>
            {errors.deliveryTimeMin && (
              <span className="text-xs text-red-500">
                {errors.deliveryTimeMin.message}
              </span>
            )}
            {errors.deliveryTimeMax && (
              <span className="text-xs text-red-500">
                {errors.deliveryTimeMax.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
