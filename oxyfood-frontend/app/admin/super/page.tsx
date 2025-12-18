"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  DollarSign,
  Store,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminMetrics {
  totalRestaurants: number;
  activeRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
}

interface AdminRestaurant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  subscriptionStatus: string;
  user: {
    name: string;
    email: string;
  };
  _count: {
    orders: number;
  };
}

export default function SuperAdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Proteção Client-Side
  useEffect(() => {
    if (user && user.role !== "SUPER_ADMIN") {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  // Buscar Métricas
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ["super-admin-metrics"],
    queryFn: async () => {
      const res = await api.get<AdminMetrics>("/admin/metrics");
      return res.data;
    },
    enabled: user?.role === "SUPER_ADMIN",
  });

  // Buscar Lista de Lojas
  const { data: restaurantsResponse, isLoading: loadingRestaurants } = useQuery(
    {
      queryKey: ["super-admin-restaurants"],
      queryFn: async () => {
        const res = await api.get<{ restaurants: AdminRestaurant[] }>(
          "/admin/restaurants"
        );
        return res.data;
      },
      enabled: user?.role === "SUPER_ADMIN",
    }
  );

  if (!user || user.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            Painel do Super Admin
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral de faturamento e gestão da plataforma OxyFood.
          </p>
        </div>
      </div>

      {/* --- CARDS DE MÉTRICAS --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loadingMetrics ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor bruto transacionado
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lojas Cadastradas
            </CardTitle>
            <Store className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {loadingMetrics ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {metrics?.totalRestaurants || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.activeRestaurants} ativas (planos pagos)
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loadingMetrics ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {metrics?.totalOrders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pedidos finalizados na plataforma
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Receita Estimada (SaaS)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            {loadingMetrics ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {/* Estimativa simples: Lojas Ativas * R$ 99 (Ticket Médio) */}
                  {formatCurrency((metrics?.activeRestaurants || 0) * 99.9)}
                </div>
                <p className="text-xs text-blue-200">
                  Baseado em assinaturas ativas
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- TABELA DE LOJAS --- */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Restaurantes</CardTitle>
          <CardDescription>
            Lista de todos os parceiros cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRestaurants ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loja</TableHead>
                  <TableHead>Dono</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurantsResponse?.restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">
                      {restaurant.name}
                      <span className="block text-xs text-muted-foreground">
                        /{restaurant.slug}
                      </span>
                    </TableCell>
                    <TableCell>
                      {restaurant.user.name}
                      <span className="block text-xs text-muted-foreground">
                        {restaurant.user.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(restaurant.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </TableCell>
                    <TableCell>{restaurant._count.orders}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          restaurant.subscriptionStatus === "ACTIVE"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          restaurant.subscriptionStatus === "ACTIVE"
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {restaurant.subscriptionStatus === "ACTIVE"
                          ? "Ativo"
                          : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`/restaurants/${restaurant.slug}`}
                          target="_blank"
                        >
                          Ver Loja
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
