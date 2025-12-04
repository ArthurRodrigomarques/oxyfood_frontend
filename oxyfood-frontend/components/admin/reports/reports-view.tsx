"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardMetrics {
  revenue: number;
  ordersCount: number;
  averageTicket: number;
  activeCustomers: number;
  topProducts: {
    name: string;
    qty: number;
    revenue: number;
  }[];
  recentOrders: {
    id: string;
    date: string;
    customer: string;
    items: number;
    total: number;
    status: string;
  }[];
}

export function ReportsView() {
  const { activeRestaurantId } = useAuthStore();

  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery<DashboardMetrics>({
    queryKey: ["restaurant-metrics", activeRestaurantId],
    queryFn: async () => {
      if (!activeRestaurantId) return null;
      const response = await api.get(
        `/restaurants/${activeRestaurantId}/metrics`
      );
      return response.data;
    },
    enabled: !!activeRestaurantId,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Não foi possível carregar os relatórios. Tente novamente mais tarde.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "REJECTED":
        return "bg-red-500 hover:bg-red-600";
      case "PENDING":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      COMPLETED: "Concluído",
      REJECTED: "Cancelado",
      PENDING: "Pendente",
      PREPARING: "Em Preparo",
      OUT: "Em Entrega",
    };
    return map[status] || status;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">
          Relatórios e Análises
        </h2>
        <p className="text-muted-foreground">
          Visão geral dos últimos 30 dias.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">Vendas confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.ordersCount}</div>
            <p className="text-xs text-muted-foreground">
              Total de pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.averageTicket)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio por venda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Clientes únicos atendidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ABAS DE DETALHES */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="sales">Últimas Transações</TabsTrigger>
          <TabsTrigger value="products">Produtos Mais Vendidos</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Qtd. Itens</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhuma venda registrada ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.recentOrders.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {new Date(sale.date).toLocaleDateString("pt-BR")}{" "}
                          <span className="text-xs text-gray-400">
                            {new Date(sale.date).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {sale.customer}
                        </TableCell>
                        <TableCell>{sale.items}</TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(sale.total)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              sale.status
                            )} border-none`}
                          >
                            {getStatusLabel(sale.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Campeões de Venda</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Qtd. Vendida</TableHead>
                    <TableHead className="text-right">Receita Gerada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.topProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum produto vendido ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <span className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                            #{index + 1}
                          </span>
                          {product.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.qty}
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          {formatCurrency(product.revenue)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
