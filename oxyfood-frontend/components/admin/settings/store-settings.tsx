"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

export function StoreSettings() {
  return (
    <div className="space-y-6">
      {/* Secção 1: Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
          <CardDescription>
            Atualize as informações básicas do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input id="name" defaultValue="OxyFood - Hamburgueria Artesanal" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue="Rua das Flores, 123 - Centro" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" defaultValue="(11) 99999-9999" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              defaultValue="Hambúrgueres artesanais feitos com ingredientes frescos e de qualidade."
              rows={4}
            />
          </div>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium mt-2">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Secção 2: Horário de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle>Horário de Funcionamento</CardTitle>
          <CardDescription>
            Defina os horários de abertura e fechamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Segunda a Sexta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Label className="text-base font-medium">Segunda a Sexta</Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input type="time" defaultValue="11:00" className="w-32" />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <span className="text-muted-foreground">até</span>
              <div className="relative">
                <Input type="time" defaultValue="23:00" className="w-32" />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Sábado e Domingo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Label className="text-base font-medium">Sábado e Domingo</Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input type="time" defaultValue="12:00" className="w-32" />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <span className="text-muted-foreground">até</span>
              <div className="relative">
                <Input type="time" defaultValue="00:00" className="w-32" />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium mt-2">
            Salvar Horários
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
