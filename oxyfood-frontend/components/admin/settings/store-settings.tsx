"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { QrCodeCard } from "./qr-code-card";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { RestaurantData } from "@/types/order";

// Interfaces para a API
interface MeResponse {
  user: {
    restaurants: { id: string; slug: string }[];
  };
}

interface RestaurantDetailsResponse {
  restaurant: RestaurantData;
}

// Schema de validação
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  slug: z.string().min(1, "URL amigável é obrigatória"),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  addressText: z.string().min(1, "Endereço é obrigatório"),
  phoneNumber: z.string().min(1, "Telefone é obrigatório"),
  cpfCnpj: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function StoreSettings() {
  const { activeRestaurantId } = useAuthStore();
  const queryClient = useQueryClient();

  // 1. Configuração do Formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      logoUrl: "",
      bannerUrl: "",
      addressText: "",
      phoneNumber: "",
      cpfCnpj: "",
    },
  });

  // 2. Busca de Dados
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

  // 3. Atualiza o form quando os dados chegam
  useEffect(() => {
    if (restaurant) {
      form.reset({
        name: restaurant.name || "",
        description: restaurant.description || "",
        slug: restaurant.slug || "",
        logoUrl: restaurant.logoUrl || "",
        bannerUrl: restaurant.bannerUrl || "",
        addressText: restaurant.addressText || "",
        phoneNumber: restaurant.phoneNumber || "",
        cpfCnpj: restaurant.cpfCnpj || "",
      });
    }
  }, [restaurant, form]);

  // 4. Mutação para Salvar (CORRIGIDO: patch -> put)
  const { mutate: updateStore, isPending: isSaving } = useMutation({
    mutationFn: async (values: FormValues) => {
      // Backend espera PUT para atualização completa/parcial nesta rota
      await api.put(`/restaurants/${activeRestaurantId}`, values);
    },
    onSuccess: () => {
      toast.success("Loja atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });

      if (restaurant?.slug) {
        queryClient.invalidateQueries({
          queryKey: ["restaurant-public", restaurant.slug],
        });
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar loja. Verifique os dados.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!restaurant) {
    return <div>Não foi possível carregar os dados da loja.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <QrCodeCard slug={restaurant.slug} restaurantName={restaurant.name} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => updateStore(data))}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagens */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo da Loja</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        label="Logo"
                      />
                    </FormControl>
                    <FormDescription>
                      Formato quadrado (ex: 500x500px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner de Capa</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        aspectRatio="wide"
                        label="Banner"
                      />
                    </FormControl>
                    <FormDescription>
                      Formato horizontal (ex: 1200x400px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dados Principais */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Loja</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: OxyFood Burguer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Amigável (Slug)</FormLabel>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground bg-muted p-2 rounded-md h-10 flex items-center border border-r-0 rounded-r-none border-input">
                        oxyfood.com/
                      </span>
                      <FormControl>
                        <Input
                          placeholder="minha-loja"
                          className="rounded-l-none"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Link para seus clientes acessarem.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Curta</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: O melhor hambúrguer artesanal da cidade..."
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-xl border">
            <FormField
              control={form.control}
              name="addressText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Rua, Número, Bairro, Cidade - UF"
                      className="resize-none bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp / Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(11) 99999-9999"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF ou CNPJ (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0001-00"
                        className="bg-white"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600 font-bold min-w-[150px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
