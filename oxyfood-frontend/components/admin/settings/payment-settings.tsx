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

export function PaymentSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formas de Pagamento</CardTitle>
        <CardDescription>
          Selecione as formas de pagamento aceitas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Item de Pagamento */}
        <div className="flex items-center justify-between">
          <Label htmlFor="cash" className="text-base">
            Dinheiro
          </Label>
          <Switch id="cash" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="credit" className="text-base">
            Cartão de Crédito
          </Label>
          <Switch id="credit" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="debit" className="text-base">
            Cartão de Débito
          </Label>
          <Switch id="debit" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="pix" className="text-base">
            Pix
          </Label>
          <Switch id="pix" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="voucher" className="text-base">
            Vale Refeição
          </Label>
          <Switch id="voucher" />
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium mt-4">
          Salvar Formas de Pagamento
        </Button>
      </CardContent>
    </Card>
  );
}
