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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type RegisterData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(data: RegisterData) {
    try {
      setIsLoading(true);
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Conta criada com sucesso! Faça login.");
      router.push("/login");
    } catch (error) {
      console.error(error);

      let msg = "Erro ao criar conta.";

      if (error instanceof AxiosError) {
        msg = error.response?.data?.message || msg;
      }

      toast.error(msg);
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
            Criar Conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Junte-se ao OxyFood hoje
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              className="bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-xs text-red-500 font-medium">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
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
            className="w-full h-11 mt-4 text-base font-medium shadow-sm hover:shadow-md transition-all"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando
                conta...
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Entrar
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
