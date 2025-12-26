"use client";

import { useAuthStore } from "@/store/auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreSettings } from "./store-settings";
import { DeliverySettings } from "./delivery-settings";
import { PaymentSettings } from "./payment-settings";
import { NotificationSettings } from "./notification-settings";
import { OpeningHoursSettings } from "./opening-hours-settings";
import { SubscriptionCard } from "./subscription-card";

export function SettingsView() {
  const { user, activeRestaurantId } = useAuthStore();

  const currentRestaurant = user?.restaurants?.find(
    (r) => r.id === activeRestaurantId
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua loja
          </p>
        </div>

        {currentRestaurant && (
          <SubscriptionCard
            restaurantId={currentRestaurant.id}
            restaurantName={currentRestaurant.name}
            subscriptionStatus={currentRestaurant.subscriptionStatus}
            // Verifica se existe algum valor no campo cpfCnpj
            hasDocument={!!currentRestaurant.cpfCnpj}
          />
        )}
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
