"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
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
  AdminMenuResponse,
  MenuOption,
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

  // Estados de Edição
  const [editingGroup, setEditingGroup] = useState<MenuOptionGroup | null>(
    null
  );
  const [editingOption, setEditingOption] = useState<MenuOption | null>(null);

  // Formulário de GRUPO
  const {
    register: registerGroup,
    handleSubmit: submitGroup,
    reset: resetGroup,
    setValue: setGroupValue,
  } = useForm<OptionGroupForm>({
    resolver: zodResolver(optionGroupSchema) as Resolver<OptionGroupForm>,
    defaultValues: { type: "SINGLE", minSelection: 0, maxSelection: 1 },
  });

  // Formulário de OPÇÃO
  const {
    register: registerOption,
    handleSubmit: submitOption,
    reset: resetOption,
    setValue: setOptionValue,
  } = useForm<OptionForm>({
    resolver: zodResolver(optionSchema) as Resolver<OptionForm>,
    defaultValues: { priceDelta: 0 },
  });

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

  const liveProduct = adminMenu?.categories
    .flatMap((c) => c.products)
    .find((p) => p.id === product?.id);

  const groups: MenuOptionGroup[] = liveProduct?.optionGroups || [];

  // --- MUTATIONS: GRUPOS ---

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

  const { mutate: updateGroup, isPending: isUpdatingGroup } = useMutation({
    mutationFn: async (data: OptionGroupForm) => {
      if (!editingGroup) return;
      await api.put(`/option-groups/${editingGroup.id}`, data);
    },
    onSuccess: () => {
      toast.success("Grupo atualizado!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      resetGroup();
      setEditingGroup(null);
    },
    onError: () => toast.error("Erro ao atualizar grupo"),
  });

  const { mutate: deleteGroup } = useMutation({
    mutationFn: async (groupId: string) => {
      await api.delete(`/option-groups/${groupId}`);
    },
    onSuccess: () => {
      toast.success("Grupo removido!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      if (activeGroupId) setActiveGroupId(null);
    },
    onError: () => toast.error("Erro ao remover grupo"),
  });

  // --- MUTATIONS: OPÇÕES ---

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

  const { mutate: updateOption, isPending: isUpdatingOption } = useMutation({
    mutationFn: async (data: OptionForm) => {
      if (!editingOption) return;
      await api.put(`/options/${editingOption.id}`, data);
    },
    onSuccess: () => {
      toast.success("Opção atualizada!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      resetOption();
      setEditingOption(null);
    },
    onError: () => toast.error("Erro ao atualizar opção"),
  });

  const { mutate: deleteOption } = useMutation({
    mutationFn: async (optionId: string) => {
      await api.delete(`/options/${optionId}`);
    },
    onSuccess: () => {
      toast.success("Opção removida!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
    },
    onError: () => toast.error("Erro ao remover opção"),
  });

  // --- HANDLERS ---

  const onGroupSubmit = (data: OptionGroupForm) => {
    if (editingGroup) {
      updateGroup(data);
    } else {
      createGroup(data);
    }
  };

  const onStartEditGroup = (e: React.MouseEvent, group: MenuOptionGroup) => {
    e.stopPropagation();
    setEditingGroup(group);
    setGroupValue("name", group.name);
    setGroupValue("type", group.type);
    setGroupValue("minSelection", group.minSelection);
    setGroupValue("maxSelection", group.maxSelection);
  };

  const onCancelEditGroup = () => {
    setEditingGroup(null);
    resetGroup();
  };

  const onOptionSubmit = (data: OptionForm) => {
    if (editingOption) {
      updateOption(data);
    } else {
      createOption(data);
    }
  };

  const onStartEditOption = (opt: MenuOption) => {
    setEditingOption(opt);
    setOptionValue("name", opt.name);
    setOptionValue("priceDelta", Number(opt.priceDelta));
  };

  const onCancelEditOption = () => {
    setEditingOption(null);
    resetOption();
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-gray-700">
                  {editingGroup ? "Editar Grupo" : "Novo Grupo"}
                </h3>
                {editingGroup && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onCancelEditGroup}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

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
                  className={`w-full h-8 ${
                    editingGroup
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                  disabled={isCreatingGroup || isUpdatingGroup}
                >
                  {isCreatingGroup || isUpdatingGroup ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : editingGroup ? (
                    <>
                      <Save className="h-3 w-3 mr-1" /> Salvar
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" /> Criar Grupo
                    </>
                  )}
                </Button>
              </form>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setActiveGroupId(group.id);
                      if (editingGroup) onCancelEditGroup(); // Cancela edição se trocar de grupo
                    }}
                    className={`p-3 rounded-lg cursor-pointer border transition-all group relative ${
                      activeGroupId === group.id
                        ? "bg-orange-50 border-orange-200 shadow-sm"
                        : "bg-white border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-4">
                        <span
                          className={`font-bold text-sm block truncate ${
                            activeGroupId === group.id
                              ? "text-orange-700"
                              : "text-gray-700"
                          }`}
                        >
                          {group.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          {group.type === "SINGLE"
                            ? "1 opção"
                            : `${group.minSelection}-${group.maxSelection} opções`}
                        </span>
                      </div>

                      {/* Ações do Grupo (Hover) */}
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:text-blue-600"
                          onClick={(e) => onStartEditGroup(e, group)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Excluir este grupo e todas as suas opções?"
                              )
                            ) {
                              deleteGroup(group.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
                <div className="p-4 border-b bg-white shrink-0 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    {groups.find((g) => g.id === activeGroupId)?.name}
                  </h3>
                  <span className="text-xs text-gray-400">Gerenciar Itens</span>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2 pb-4">
                    {groups
                      .find((g) => g.id === activeGroupId)
                      ?.options?.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex items-center justify-between bg-white p-3 rounded-md border shadow-sm group"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-sm block">
                              {opt.name}
                            </span>
                            <span className="text-xs font-bold text-green-600">
                              {Number(opt.priceDelta) > 0
                                ? `+ ${formatCurrency(opt.priceDelta)}`
                                : "Grátis"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover:text-blue-600"
                              onClick={() =>
                                onStartEditOption(opt as unknown as MenuOption)
                              }
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover:text-red-600"
                              onClick={() => {
                                if (confirm(`Excluir a opção "${opt.name}"?`)) {
                                  deleteOption(opt.id);
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500">
                      {editingOption
                        ? `Editando: ${editingOption.name}`
                        : "Nova Opção"}
                    </span>
                    {editingOption && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancelEditOption}
                        className="h-6 text-xs px-2"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                  <form
                    onSubmit={submitOption(onOptionSubmit)}
                    className="flex gap-3 items-end"
                  >
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Nome</Label>
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
                      className={`${
                        editingOption
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      disabled={isCreatingOption || isUpdatingOption}
                    >
                      {isCreatingOption || isUpdatingOption ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : editingOption ? (
                        <Save className="h-4 w-4" />
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
