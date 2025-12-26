"use client";

import { useEffect, useState } from "react";
import { SettingsView } from "@/components/admin/settings/settings-view";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { SubscriptionCard } from "@/components/admin/settings/subscription-card";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RestaurantSettingsData {
  id: string;
  name: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "OVERDUE";
}

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<RestaurantSettingsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/me");

        const userData = response.data.user;

        if (
          userData &&
          userData.restaurants &&
          userData.restaurants.length > 0
        ) {
          setRestaurant(userData.restaurants[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Não foi possível carregar os dados da assinatura.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <div className="md:hidden bg-white border-b p-4 flex items-center gap-3 shrink-0">
        <MobileSidebar />
        <span className="font-bold text-lg text-gray-800">Configurações</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {restaurant && (
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight mb-4 px-1">
                Meu Plano
              </h2>
              <SubscriptionCard
                restaurantId={restaurant.id}
                subscriptionStatus={restaurant.subscriptionStatus}
              />
            </div>
          )}

          <SettingsView />
        </div>
      </div>
    </main>
  );
}
