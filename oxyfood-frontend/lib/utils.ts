import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

//  interface
import { OpeningHour } from "@/types/order";

// Troque "any[]" por "OpeningHour[]"
export function checkIsOpen(openingHours: OpeningHour[]) {
  if (!openingHours || openingHours.length === 0) return false;

  const now = new Date();

  // Força o timezone do Brasil
  const brazilTimeStr = now.toLocaleString("en-US", {
    timeZone: "America/Sao_Paulo",
  });
  const brazilDate = new Date(brazilTimeStr);

  const currentDay = brazilDate.getDay();
  const currentHour = brazilDate.getHours();
  const currentMinute = brazilDate.getMinutes();

  const currentTotalMinutes = currentHour * 60 + currentMinute;

  // O TypeScript agora sabe que 's' tem 'dayOfWeek'
  const todaySchedules = openingHours.filter((s) => s.dayOfWeek === currentDay);

  if (!todaySchedules || todaySchedules.length === 0) return false;

  return todaySchedules.some((schedule) => {
    // O TypeScript sabe que openTime e closeTime são strings
    const [openH, openM] = schedule.openTime.split(":").map(Number);
    const [closeH, closeM] = schedule.closeTime.split(":").map(Number);

    const openTotal = openH * 60 + openM;
    const closeTotal = closeH * 60 + closeM;

    if (closeTotal < openTotal) {
      return (
        currentTotalMinutes >= openTotal || currentTotalMinutes < closeTotal
      );
    } else {
      return (
        currentTotalMinutes >= openTotal && currentTotalMinutes < closeTotal
      );
    }
  });
}
