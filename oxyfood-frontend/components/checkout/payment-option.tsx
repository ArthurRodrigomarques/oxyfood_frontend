import { LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type PaymentMethodType = "Dinheiro" | "Pix" | "Cartao" | "CartaoOnline";

interface PaymentOptionProps {
  value: PaymentMethodType;
  icon: LucideIcon;
  label: string;
  selected: string;
}

export function PaymentOption({
  value,
  icon: Icon,
  label,
  selected,
}: PaymentOptionProps) {
  return (
    <Label
      htmlFor={value}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-muted/50",
        selected === value
          ? "border-orange-500 bg-orange-50 text-orange-700"
          : "border-muted bg-white text-muted-foreground"
      )}
    >
      <RadioGroupItem value={value} id={value} className="sr-only" />
      <Icon
        className={cn(
          "h-6 w-6",
          selected === value ? "text-orange-500" : "text-gray-400"
        )}
      />
      <span className="text-xs font-bold text-center">{label}</span>
    </Label>
  );
}
