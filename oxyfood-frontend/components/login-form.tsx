"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

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

      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("oxyfood-token", token);
      }

      const profileResponse = await api.get("/me");
      const { user } = profileResponse.data;

      login(token, user);
      toast.success(`Bem-vindo de volta, ${user.name}!`);

      if (user.restaurants && user.restaurants.length > 0) {
        router.push("/admin/dashboard");
      } else {
        router.push("/admin/onboarding");
      }
    } catch (error) {
      console.error(error);
      let errorMessage = "Ocorreu um erro ao fazer login.";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast.error("Erro de Autenticação", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-4 flex flex-col items-center pb-2">
        <div className="bg-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-md">
          <UtensilsCrossed className="text-white h-8 w-8" />
        </div>
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="seu@email.com"
              type="email"
              className="bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs text-red-500 font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
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

          <Button
            className="w-full h-11 text-base font-medium mt-2 shadow-sm hover:shadow-md transition-all"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
              </>
            ) : (
              "Entrar no Painel"
            )}
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Criar conta
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
