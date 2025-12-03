"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

interface StoreFormData {
  name: string;
  addressText: string;
  phoneNumber: string;
  description: string;
}

interface UserRestaurant {
  id: string;
  name: string;
  slug: string;
}

export function StoreSettings() {
  const { activeRestaurantId } = useAuthStore();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<StoreFormData>();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant-settings", activeRestaurantId],
    queryFn: async () => {
      const meResponse = await api.get("/me");

      const myRestaurant = meResponse.data.user.restaurants.find(
        (r: UserRestaurant) => r.id === activeRestaurantId
      );

      if (myRestaurant) {
        const detailsResponse = await api.get(
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
      });
    }
  }, [restaurant, reset]);

  // 2. Mutação para atualizar
  const { mutate: updateStore, isPending } = useMutation({
    mutationFn: async (data: StoreFormData) => {
      await api.put(`/restaurants/${activeRestaurantId}`, data);
    },
    onSuccess: () => {
      toast.success("Informações da loja atualizadas!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });
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
      <Card>
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
          <CardDescription>
            Atualize as informações básicas do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => updateStore(data))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Loja</Label>
              <Input id="name" {...register("name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" {...register("addressText")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phoneNumber")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Conte um pouco sobre sua loja..."
                {...register("description")}
              />
            </div>

            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium mt-2"
              disabled={isPending}
            >
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
