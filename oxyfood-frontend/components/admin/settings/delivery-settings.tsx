"use client";

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
import { Switch } from "@/components/ui/switch";

export function DeliverySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Entrega</CardTitle>
        <CardDescription>Gerencie áreas de entrega e taxas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="delivery-time">
            Tempo Médio de Entrega (minutos)
          </Label>
          <Input id="delivery-time" type="number" defaultValue="45" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery-fee">Taxa de Entrega Padrão (R$)</Label>
          <Input id="delivery-fee" defaultValue="5,00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="free-delivery">
            Pedido Mínimo para Entrega Grátis (R$)
          </Label>
          <Input id="free-delivery" defaultValue="50,00" />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="space-y-0.5">
            <Label className="text-base">Aceitar Pedidos para Entrega</Label>
            <p className="text-sm text-muted-foreground">
              Ative para receber pedidos com entrega
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
}
