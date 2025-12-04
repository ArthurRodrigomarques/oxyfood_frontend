"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";
import {
  FrontendProduct,
  MenuOptionGroup,
  MenuOption,
  AdminMenuResponse,
} from "./menu-management";
import { useAuthStore } from "@/store/auth-store";

// --- Tipos & Schemas ---
const optionGroupSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  type: z.enum(["SINGLE", "MULTIPLE"]),
  minSelection: z.coerce.number().min(0),
  maxSelection: z.coerce.number().min(1),
});

const optionSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  priceDelta: z.coerce.number().min(0),
});

type OptionGroupForm = z.infer<typeof optionGroupSchema>;
type OptionForm = z.infer<typeof optionSchema>;

interface OptionsDialogProps {
  product: FrontendProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- Componente Principal ---
export function OptionsDialog({
  product,
  open,
  onOpenChange,
}: OptionsDialogProps) {
  const queryClient = useQueryClient();
  const { activeRestaurantId } = useAuthStore();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Formulário de GRUPO
  const {
    register: registerGroup,
    handleSubmit: submitGroup,
    reset: resetGroup,
  } = useForm<OptionGroupForm>({
    resolver: zodResolver(optionGroupSchema) as Resolver<OptionGroupForm>,
    defaultValues: { type: "SINGLE", minSelection: 0, maxSelection: 1 },
  });

  // Formulário de OPÇÃO
  const {
    register: registerOption,
    handleSubmit: submitOption,
    reset: resetOption,
  } = useForm<OptionForm>({
    resolver: zodResolver(optionSchema) as Resolver<OptionForm>,
    defaultValues: { priceDelta: 0 },
  });

  // --- CORREÇÃO AQUI ---
  // Adicionamos a queryFn para satisfazer o React Query e permitir re-fetch
  const { data: adminMenu } = useQuery<AdminMenuResponse>({
    queryKey: ["admin-menu", activeRestaurantId],
    queryFn: async () => {
      const response = await api.get<AdminMenuResponse>(
        `/restaurants/${activeRestaurantId}/menu`
      );
      return response.data;
    },
    enabled: !!activeRestaurantId && open,
  });

  // Encontra o produto atualizado dentro dos dados "vivos"
  const liveProduct = adminMenu?.categories
    .flatMap((c) => c.products)
    .find((p) => p.id === product?.id);

  const groups: MenuOptionGroup[] = liveProduct?.optionGroups || [];

  // Mutation: Criar Grupo
  const { mutate: createGroup, isPending: isCreatingGroup } = useMutation({
    mutationFn: async (data: OptionGroupForm) => {
      if (!product) return;
      await api.post(`/products/${product.id}/option-groups`, data);
    },
    onSuccess: () => {
      toast.success("Grupo adicionado!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      resetGroup();
    },
    onError: () => toast.error("Erro ao criar grupo"),
  });

  // Mutation: Criar Opção
  const { mutate: createOption, isPending: isCreatingOption } = useMutation({
    mutationFn: async (data: OptionForm) => {
      if (!activeGroupId) return;
      await api.post(`/option-groups/${activeGroupId}/options`, data);
    },
    onSuccess: () => {
      toast.success("Opção adicionada!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      resetOption();
    },
    onError: () => toast.error("Erro ao criar opção"),
  });

  const onGroupSubmit = (data: OptionGroupForm) => {
    createGroup(data);
  };

  const onOptionSubmit = (data: OptionForm) => {
    createOption(data);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gray-50 p-0 gap-0 flex flex-col h-[85vh] max-h-[700px]">
        <DialogHeader className="p-6 bg-white border-b shrink-0">
          <DialogTitle className="text-xl font-bold">
            Complementos:{" "}
            <span className="text-orange-600">{product.name}</span>
          </DialogTitle>
          <DialogDescription>
            Gerencie os adicionais e opções deste produto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* COLUNA DA ESQUERDA: GRUPOS */}
          <div className="w-1/3 border-r bg-white flex flex-col">
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">
                Novo Grupo
              </h3>
              <form onSubmit={submitGroup(onGroupSubmit)} className="space-y-3">
                <Input
                  placeholder="Nome (ex: Bordas)"
                  {...registerGroup("name")}
                  className="bg-white h-8 text-sm"
                />
                <div className="flex gap-2">
                  <select
                    {...registerGroup("type")}
                    className="h-8 text-xs border rounded w-full bg-white px-2"
                  >
                    <option value="SINGLE">Escolha Única</option>
                    <option value="MULTIPLE">Múltipla</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    {...registerGroup("minSelection")}
                    className="h-8 text-xs bg-white"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    {...registerGroup("maxSelection")}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full bg-orange-500 hover:bg-orange-600 h-8"
                  disabled={isCreatingGroup}
                >
                  {isCreatingGroup ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  Criar Grupo
                </Button>
              </form>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setActiveGroupId(group.id)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all ${
                      activeGroupId === group.id
                        ? "bg-orange-50 border-orange-200 shadow-sm"
                        : "bg-white border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-bold text-sm truncate ${
                          activeGroupId === group.id
                            ? "text-orange-700"
                            : "text-gray-700"
                        }`}
                      >
                        {group.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {group.type === "SINGLE"
                        ? "1 opção"
                        : `${group.minSelection} até ${group.maxSelection} opções`}
                    </div>
                  </div>
                ))}
                {groups.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Nenhum grupo criado.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* COLUNA DA DIREITA: OPÇÕES DO GRUPO SELECIONADO */}
          <div className="flex-1 bg-gray-50 flex flex-col h-full overflow-hidden">
            {activeGroupId ? (
              <>
                <div className="p-4 border-b bg-white shrink-0">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    Itens do Grupo
                  </h3>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2 pb-4">
                    {groups
                      .find((g) => g.id === activeGroupId)
                      ?.options?.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex items-center justify-between bg-white p-3 rounded-md border shadow-sm"
                        >
                          <span className="font-medium text-sm">
                            {opt.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-green-600">
                              {Number(opt.priceDelta) > 0
                                ? `+ ${formatCurrency(opt.priceDelta)}`
                                : "Grátis"}
                            </span>
                          </div>
                        </div>
                      ))}

                    {(!groups.find((g) => g.id === activeGroupId)?.options ||
                      groups.find((g) => g.id === activeGroupId)?.options
                        ?.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                        Este grupo está vazio. <br />
                        Adicione opções abaixo.
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 bg-white border-t shrink-0 z-10">
                  <form
                    onSubmit={submitOption(onOptionSubmit)}
                    className="flex gap-3 items-end"
                  >
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Nome da Opção</Label>
                      <Input
                        placeholder="Ex: Bacon Extra"
                        {...registerOption("name")}
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">Preço (+)</Label>
                      <Input
                        type="number"
                        step="0.50"
                        placeholder="0.00"
                        {...registerOption("priceDelta")}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isCreatingOption}
                    >
                      {isCreatingOption ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
                <div className="bg-gray-100 p-4 rounded-full">
                  <GripVertical className="h-8 w-8 opacity-20" />
                </div>
                Selecione um grupo à esquerda <br /> para gerenciar os itens.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
