"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FrontendProduct } from "./menu-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: FrontendProduct | null;
  onSave: (data: Partial<FrontendProduct>) => void;
  categories: CategoryOption[];
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
  categories,
}: ProductDialogProps) {
  const { register, handleSubmit, reset, setValue, control, formState } =
    useForm<Partial<FrontendProduct>>();

  const image = useWatch({ control, name: "image" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          description: product.description || "",
          price: Number(product.price),
          categoryId: product.categoryId,
          image: product.image || "",
          available: product.available,
        });
      } else {
        reset({
          name: "",
          description: "",
          price: 0,
          categoryId: categories.length > 0 ? categories[0].id : "",
          image: "",
          available: true,
        });
      }
    }
  }, [product, open, reset, categories]);

  const onSubmit = async (data: Partial<FrontendProduct>) => {
    if (!data.categoryId) {
      toast.error("Selecione uma categoria.");
      return;
    }

    try {
      const formattedData = {
        ...data,
        price: Number(data.price),
      };

      onSave(formattedData);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[90vh] p-0 flex flex-col overflow-hidden bg-white rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full max-h-[90vh]"
        >
          <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white z-10">
            <DialogTitle className="text-lg sm:text-xl font-bold">
              {product ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Preencha os dados abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <ImageUpload
                label="Foto do Produto"
                value={image}
                onChange={(url) =>
                  setValue("image", url, { shouldDirty: true })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="Ex: X-Burger Duplo"
                className="h-10 sm:h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Descreva os ingredientes..."
                className="min-h-[80px] sm:min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { required: true })}
                  placeholder="0.00"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(val) => setValue("categoryId", val)}
                >
                  <SelectTrigger className="h-10 sm:h-11 w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Nenhuma categoria criada
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-10 sm:h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
            >
              {formState.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
