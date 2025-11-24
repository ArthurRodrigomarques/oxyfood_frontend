"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { UtensilsCrossed } from "lucide-react"; // Ícone de garfo/faca

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Validação
const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: LoginData) {
    try {
      setIsLoading(true);
      // Chama o backend
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      // Guarda o token
      const { token } = response.data;
      localStorage.setItem("oxyfood-token", token);

      toast.success("Bem-vindo de volta!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Credenciais inválidas.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-4 flex flex-col items-center pb-2">
        {/* Logo Circular Laranja */}
        <div className="bg-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-md">
          <UtensilsCrossed className="text-white h-8 w-8" />
        </div>

        {/* Títulos */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            OxyFood
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de Gestão de Pedidos
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-sm">
              Email
            </Label>
            <Input
              id="email"
              placeholder="seu@email.com"
              type="email"
              // Fundo cinza claro suave nos inputs
              className="bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs text-red-500 font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-sm">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-xs text-red-500 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Botão Laranja */}
          <Button
            className="w-full h-11 text-base font-medium mt-2 shadow-sm hover:shadow-md transition-all"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar no Painel"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
