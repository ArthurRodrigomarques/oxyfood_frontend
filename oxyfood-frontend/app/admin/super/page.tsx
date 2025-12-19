"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  DollarSign,
  Store,
  ShoppingBag,
  BarChart3,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminMetrics {
  totalRestaurants: number;
  activeRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
}

interface AdminRestaurant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE";
  isOpen: boolean;
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
  const queryClient = useQueryClient();

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

  // Mutation para alterar status
  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: async (restaurantId: string) => {
      await api.patch(`/admin/restaurants/${restaurantId}/toggle`);
    },
    onSuccess: () => {
      toast.success("Status da loja atualizado!");
      queryClient.invalidateQueries({ queryKey: ["super-admin-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-metrics"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar status.");
    },
  });

  if (!user || user.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            Painel Master
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão global da plataforma OxyFood.
          </p>
        </div>
      </div>

      {/* --- CARDS DE MÉTRICAS --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-l-4 border-l-green-500">
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
                  GMV (Volume Bruto de Mercadorias)
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
                  {metrics?.activeRestaurants} ativas no momento
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
                  Pedidos processados
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-blue-600 text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Ticket Médio Global
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            {loadingMetrics ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics?.averageTicket || 0)}
                </div>
                <p className="text-xs text-blue-200">
                  Média de valor por pedido
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- TABELA DE LOJAS --- */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurantes Parceiros</CardTitle>
          <CardDescription>
            Controle de ativação e acesso das lojas.
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
                  <TableHead>Restaurante</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead className="text-center">Vendas</TableHead>
                  <TableHead className="text-center">Assinatura</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurantsResponse?.restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {restaurant.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          slug: {restaurant.slug}
                        </span>
                        {restaurant.isOpen ? (
                          <span className="text-[10px] text-green-600 font-bold mt-1">
                            • ABERTA AGORA
                          </span>
                        ) : (
                          <span className="text-[10px] text-red-400 mt-1">
                            • FECHADA
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{restaurant.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {restaurant.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(restaurant.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {restaurant._count.orders} pedidos
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          disabled={isToggling}
                          checked={restaurant.subscriptionStatus === "ACTIVE"}
                          onCheckedChange={() => toggleStatus(restaurant.id)}
                        />
                        <span
                          className={`text-xs font-bold ${
                            restaurant.subscriptionStatus === "ACTIVE"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {restaurant.subscriptionStatus === "ACTIVE"
                            ? "ATIVA"
                            : "INATIVA"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <a
                          href={`/restaurants/${restaurant.slug}`}
                          target="_blank"
                          title="Ver página pública"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-500" />
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
