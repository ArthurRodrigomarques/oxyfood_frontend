"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface StoreFormData {
  name: string;
  addressText: string;
  phoneNumber: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
}

interface UserRestaurant {
  id: string;
  name: string;
  slug: string;
}

interface MeResponse {
  user: {
    restaurants: UserRestaurant[];
  };
}

interface RestaurantDetailsResponse {
  restaurant: {
    name: string;
    addressText: string;
    phoneNumber: string;
    description: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
  };
}

export function StoreSettings() {
  const { activeRestaurantId } = useAuthStore();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, control } =
    useForm<StoreFormData>();

  const logoUrl = useWatch({ control, name: "logoUrl" });
  const bannerUrl = useWatch({ control, name: "bannerUrl" });

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant-settings", activeRestaurantId],
    queryFn: async () => {
      const meResponse = await api.get<MeResponse>("/me");

      const myRestaurant = meResponse.data.user.restaurants.find(
        (r) => r.id === activeRestaurantId
      );

      if (myRestaurant) {
        const detailsResponse = await api.get<RestaurantDetailsResponse>(
          `/restaurants/${myRestaurant.slug}`
        );
        return detailsResponse.data.restaurant;
      }
      return null;
    },
    enabled: !!activeRestaurantId,
  });

  useEffect(() => {
    if (restaurant) {
      reset({
        name: restaurant.name,
        addressText: restaurant.addressText,
        phoneNumber: restaurant.phoneNumber,
        description: restaurant.description || "",
        logoUrl: restaurant.logoUrl || "",
        bannerUrl: restaurant.bannerUrl || "",
      });
    }
  }, [restaurant, reset]);

  const { mutate: updateStore, isPending } = useMutation({
    mutationFn: async (data: StoreFormData) => {
      await api.put(`/restaurants/${activeRestaurantId}`, data);
    },
    onSuccess: () => {
      toast.success("Loja atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-public"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar loja.");
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit((data) => updateStore(data))}
        className="space-y-6"
      >
        {/* IMAGENS */}
        <Card>
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>
              Personalize como sua loja aparece para os clientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo (Quadrado) */}
              <div className="w-full md:w-48 shrink-0">
                <ImageUpload
                  label="Logo da Loja"
                  value={logoUrl}
                  onChange={(url) => setValue("logoUrl", url)}
                  aspectRatio="square"
                />
              </div>

              {/* Banner (Retangular) */}
              <div className="flex-1">
                <ImageUpload
                  label="Banner de Capa (Recomendado: 1200x400)"
                  value={bannerUrl}
                  onChange={(url) => setValue("bannerUrl", url)}
                  aspectRatio="wide"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DADOS BÁSICOS */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Endereço, contato e descrição.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja</Label>
                <Input id="name" {...register("name")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input id="phone" {...register("phoneNumber")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input id="address" {...register("addressText")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Sobre a loja)</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Conte um pouco sobre sua história, especialidades..."
                {...register("description")}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full md:w-auto"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
