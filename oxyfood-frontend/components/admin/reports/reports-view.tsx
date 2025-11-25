"use client";

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
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

export function ReportsView() {
  const mockSalesData = [
    {
      id: "1",
      date: "15/03/2024",
      customer: "João Silva",
      items: 3,
      total: 89.9,
      status: "completed",
    },
    {
      id: "2",
      date: "15/03/2024",
      customer: "Maria Santos",
      items: 2,
      total: 65.0,
      status: "completed",
    },
    {
      id: "3",
      date: "14/03/2024",
      customer: "Pedro Costa",
      items: 5,
      total: 134.5,
      status: "completed",
    },
    {
      id: "4",
      date: "14/03/2024",
      customer: "Ana Paula",
      items: 2,
      total: 58.0,
      status: "cancelled",
    },
    {
      id: "5",
      date: "13/03/2024",
      customer: "Carlos Souza",
      items: 4,
      total: 112.0,
      status: "completed",
    },
  ];

  const topProducts = [
    { name: "X-Burger Duplo", sales: 45, revenue: 1575.0 },
    { name: "Pizza Margherita", sales: 38, revenue: 1558.0 },
    { name: "X-Bacon Especial", sales: 32, revenue: 1280.0 },
    { name: "Pizza Calabresa", sales: 28, revenue: 1232.0 },
    { name: "X-Salada Veggie", sales: 22, revenue: 748.0 },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Relatórios e Análises
        </h2>
        <p className="text-muted-foreground">
          Acompanhe o desempenho financeiro do seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 6.393,00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">+12.5%</span> vs
              mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">165</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">+8.2%</span> vs mês
              anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 38,74</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">+3.1%</span> vs mês
              anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">+18.3%</span> vs
              mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="sales">Histórico de Vendas</TabsTrigger>
          <TabsTrigger value="products">Produtos Mais Vendidos</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSalesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell className="font-medium">
                        {sale.customer}
                      </TableCell>
                      <TableCell>{sale.items} itens</TableCell>
                      <TableCell>R$ {sale.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sale.status === "completed"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            sale.status === "completed"
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : ""
                          }
                        >
                          {sale.status === "completed"
                            ? "Concluído"
                            : "Cancelado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Vendas (Qtd)</TableHead>
                    <TableHead className="text-right">Receita Gerada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.sales}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        R$ {product.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
