"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Configure quando você quer receber alertas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="new-orders" className="text-base font-medium">
              Notificar Novos Pedidos
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba alerta sonoro para novos pedidos
            </p>
          </div>
          <Switch id="new-orders" defaultChecked />
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="email-notif" className="text-base font-medium">
              Notificações por Email
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba resumo diário por email
            </p>
          </div>
          <Switch id="email-notif" defaultChecked />
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="push-notif" className="text-base font-medium">
              Notificações Push
            </Label>
            <p className="text-sm text-muted-foreground">
              Alertas no navegador
            </p>
          </div>
          <Switch id="push-notif" />
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium mt-4">
          Salvar Preferências
        </Button>
      </CardContent>
    </Card>
  );
}
