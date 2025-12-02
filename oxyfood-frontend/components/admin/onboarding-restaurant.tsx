"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Store, Loader2, ArrowRight } from "lucide-react";

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

const createRestaurantSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
  addressText: z.string().min(5, "Endereço é obrigatório."),
  phoneNumber: z.string().min(9, "Telefone inválido."),
  pixKey: z.string().min(3, "Chave Pix é obrigatória para receber pagamentos."),
});

type CreateRestaurantData = z.infer<typeof createRestaurantSchema>;

export function OnboardingRestaurant() {
  const [isLoading, setIsLoading] = useState(false);

  const { login, token } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRestaurantData>({
    resolver: zodResolver(createRestaurantSchema),
  });

  async function handleCreateRestaurant(data: CreateRestaurantData) {
    try {
      setIsLoading(true);

      await api.post("/restaurants", {
        ...data,
        deliveryFee: 5,
        freeDeliveryAbove: 100,
      });

      toast.success("Restaurante criado com sucesso!");

      if (token) {
        const profileResponse = await api.get("/me");
        login(token, profileResponse.data.user);
      }
    } catch (error) {
      console.error(error);

      let msg = "Erro ao criar restaurante.";

      if (error instanceof AxiosError) {
        msg = error.response?.data?.message || msg;
      }

      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[80vh] p-4 bg-gray-50/50">
      <Card className="max-w-lg w-full border-none shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit mb-4">
            <Store className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Vamos criar a sua loja!
          </CardTitle>
          <CardDescription>
            Você ainda não tem um restaurante cadastrado. Preencha os dados
            abaixo para começar a receber pedidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(handleCreateRestaurant)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Restaurante</Label>
              <Input
                id="name"
                placeholder="Ex: Burguer Kingão"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressText">Endereço Completo</Label>
              <Input
                id="addressText"
                placeholder="Rua das Flores, 123"
                {...register("addressText")}
              />
              {errors.addressText && (
                <span className="text-xs text-red-500">
                  {errors.addressText.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">WhatsApp / Telefone</Label>
                <Input
                  id="phoneNumber"
                  placeholder="(11) 99999-9999"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <span className="text-xs text-red-500">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pixKey">Chave Pix</Label>
                <Input
                  id="pixKey"
                  placeholder="CPF, Email ou Aleatória"
                  {...register("pixKey")}
                />
                {errors.pixKey && (
                  <span className="text-xs text-red-500">
                    {errors.pixKey.message}
                  </span>
                )}
              </div>
            </div>

            <Button
              className="w-full h-11 mt-4 bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <span className="flex items-center">
                  Criar Restaurante <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
