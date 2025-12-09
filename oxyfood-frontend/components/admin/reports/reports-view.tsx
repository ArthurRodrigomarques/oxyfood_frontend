"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
  chartData: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

const chartConfig = {
  revenue: {
    label: "Receita (R$)",
    color: "#f97316", // Orange-500
  },
  orders: {
    label: "Pedidos",
    color: "#3b82f6", // Blue-500
  },
} satisfies ChartConfig;

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
    <div className="space-y-4 p-4 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Visão geral do desempenho da sua loja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {formatCurrency(metrics.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Pedidos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {metrics.ordersCount}
            </div>
            <p className="text-xs text-muted-foreground">Vendas realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {formatCurrency(metrics.averageTicket)}
            </div>
            <p className="text-xs text-muted-foreground">Média por pedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {metrics.activeCustomers}
            </div>
            <p className="text-xs text-muted-foreground">Compraram este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* ÁREA DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Receita */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Faturamento Semanal</CardTitle>
            <CardDescription className="text-xs">
              Receita diária dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart
                accessibilityLayer
                data={metrics.chartData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="var(--color-revenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pedidos */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Volume de Pedidos</CardTitle>
            <CardDescription className="text-xs">
              Quantidade de vendas por dia
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={metrics.chartData}
                margin={{ top: 10 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-orders)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* TABELAS DETALHADAS */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="sales" className="text-xs sm:text-sm">
            Últimas Vendas
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs sm:text-sm">
            Top Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Histórico Recente</CardTitle>
              <CardDescription className="text-xs">
                Seus últimos pedidos processados
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-xs">Data</TableHead>
                    <TableHead className="text-xs">Cliente</TableHead>
                    <TableHead className="text-xs text-center hidden sm:table-cell">
                      Itens
                    </TableHead>
                    <TableHead className="text-xs">Valor</TableHead>
                    <TableHead className="text-xs text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground text-sm"
                      >
                        Nenhuma venda registrada ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.recentOrders.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="text-xs">
                          {new Date(sale.date).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="font-medium text-xs truncate max-w-[100px] sm:max-w-none">
                          {sale.customer}
                        </TableCell>
                        <TableCell className="text-xs text-center hidden sm:table-cell">
                          {sale.items}
                        </TableCell>
                        <TableCell className="font-bold text-xs">
                          {formatCurrency(sale.total)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={`${getStatusColor(
                              sale.status
                            )} border-none text-white text-[10px] px-2 py-0.5 h-auto`}
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
            <CardHeader className="p-4">
              <CardTitle className="text-base">Campeões de Venda</CardTitle>
              <CardDescription className="text-xs">
                Produtos com maior saída no período
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Produto</TableHead>
                    <TableHead className="text-xs text-right">Qtd.</TableHead>
                    <TableHead className="text-xs text-right">
                      Receita
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.topProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-8 text-muted-foreground text-sm"
                      >
                        Nenhum produto vendido ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium flex items-center gap-2 text-xs">
                          <span className="bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                            #{index + 1}
                          </span>
                          <span className="truncate max-w-[150px] sm:max-w-none">
                            {product.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {product.qty}
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600 text-xs">
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
