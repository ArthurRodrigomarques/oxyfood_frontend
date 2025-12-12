"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreSettings } from "./store-settings";
import { DeliverySettings } from "./delivery-settings";
import { PaymentSettings } from "./payment-settings";
import { NotificationSettings } from "./notification-settings";
import { OpeningHoursSettings } from "./opening-hours-settings";

export function SettingsView() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua loja
        </p>
      </div>

      {/* Sistema de Abas */}
      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="store">Loja</TabsTrigger>
          <TabsTrigger value="schedule">Horários</TabsTrigger>
          <TabsTrigger value="delivery">Entrega</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Conteúdo da Aba 'Loja' */}
        <TabsContent value="store">
          <StoreSettings />
        </TabsContent>

        <TabsContent value="schedule">
          <OpeningHoursSettings />
        </TabsContent>

        {/* Conteúdo da Aba 'Entrega' */}
        <TabsContent value="delivery">
          <DeliverySettings />
        </TabsContent>

        {/* Conteúdo da Aba 'Pagamento' */}
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>

        {/* Conteúdo da Aba 'Notificações' */}
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
