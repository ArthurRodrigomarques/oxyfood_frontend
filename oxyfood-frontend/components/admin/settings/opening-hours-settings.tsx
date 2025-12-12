"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Loader2, Save, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

interface OpeningHourResponse {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

interface ScheduleItem {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  enabled: boolean;
}

function getInitialSchedule(
  dbSchedule: OpeningHourResponse[] | undefined
): ScheduleItem[] {
  return DAYS_OF_WEEK.map((_, index) => {
    const found = dbSchedule?.find((s) => s.dayOfWeek === index);

    if (found) {
      return {
        dayOfWeek: index,
        openTime: found.openTime,
        closeTime: found.closeTime,
        enabled: true,
      };
    }

    return {
      dayOfWeek: index,
      openTime: "18:00",
      closeTime: "23:00",
      enabled: false,
    };
  });
}

function OpeningHoursForm({
  initialData,
}: {
  initialData: OpeningHourResponse[];
}) {
  const { activeRestaurantId } = useAuthStore();
  const queryClient = useQueryClient();

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() =>
    getInitialSchedule(initialData)
  );

  const { mutate: saveHours, isPending } = useMutation({
    mutationFn: async () => {
      const payload = schedule
        .filter((item) => item.enabled)
        .map(({ dayOfWeek, openTime, closeTime }) => ({
          dayOfWeek,
          openTime,
          closeTime,
        }));

      await api.put(`/restaurants/${activeRestaurantId}/opening-hours`, {
        schedules: payload,
      });
    },
    onSuccess: () => {
      toast.success("Horários atualizados com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-public"] });
    },
    onError: () => {
      toast.error("Erro ao salvar horários.");
    },
  });

  const handleToggleDay = (index: number, checked: boolean) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: checked } : item
      )
    );
  };

  const handleTimeChange = (
    index: number,
    field: "openTime" | "closeTime",
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  return (
    <CardContent className="space-y-6 pt-6">
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div
            key={item.dayOfWeek}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border ${
              item.enabled
                ? "bg-white border-gray-200"
                : "bg-gray-50 border-transparent"
            }`}
          >
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <Switch
                checked={item.enabled}
                onCheckedChange={(checked) => handleToggleDay(index, checked)}
              />
              <Label
                className={
                  item.enabled ? "text-gray-900 font-medium" : "text-gray-400"
                }
              >
                {DAYS_OF_WEEK[index]}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  className="w-32 pl-9"
                  value={item.openTime}
                  onChange={(e) =>
                    handleTimeChange(index, "openTime", e.target.value)
                  }
                  disabled={!item.enabled}
                />
              </div>
              <span className="text-gray-400 font-medium">às</span>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  className="w-32 pl-9"
                  value={item.closeTime}
                  onChange={(e) =>
                    handleTimeChange(index, "closeTime", e.target.value)
                  }
                  disabled={!item.enabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={() => saveHours()}
          disabled={isPending}
          className="bg-orange-500 hover:bg-orange-600 font-bold text-white"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar Horários
        </Button>
      </div>
    </CardContent>
  );
}

export function OpeningHoursSettings() {
  const { activeRestaurantId, user } = useAuthStore();

  const currentRestaurantSlug = user?.restaurants?.find(
    (r) => r.id === activeRestaurantId
  )?.slug;

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant-settings", activeRestaurantId],
    queryFn: async () => {
      if (!currentRestaurantSlug) return null;
      const response = await api.get(`/restaurants/${currentRestaurantSlug}`);
      return response.data.restaurant;
    },
    enabled: !!currentRestaurantSlug,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horário de Funcionamento</CardTitle>
        <CardDescription>
          Defina os dias e horários que sua loja abre e fecha automaticamente.
        </CardDescription>
      </CardHeader>

      {restaurant && (
        <OpeningHoursForm initialData={restaurant.openingHours || []} />
      )}
    </Card>
  );
}
