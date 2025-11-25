"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Product } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
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
import Image from "next/image";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (data: Partial<Product>) => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
}: ProductDialogProps) {
  const { register, handleSubmit, reset, setValue, control } =
    useForm<Partial<Product>>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageUrl = useWatch({
    control,
    name: "image",
  });

  useEffect(() => {
    if (
      imageUrl &&
      typeof imageUrl === "string" &&
      imageUrl.startsWith("http")
    ) {
      // setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("category", product.category);
      setValue("image", product.image);
      // setImagePreview(product.image || null);
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        category: "lanches",
        image: "",
      });
      // setImagePreview(null);
    }
  }, [product, open, reset, setValue]);

  const onSubmit = (data: Partial<Product>) => {
    const formattedData = { ...data, price: Number(data.price) };
    onSave(formattedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do novo produto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          {/* Área de Upload de Imagem */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Imagem do Produto
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/10 transition-colors cursor-pointer bg-gray-50/50 relative group">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-md overflow-hidden shadow-sm">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("image", "");
                        setImagePreview(null);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white p-3 rounded-full shadow-sm border">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-primary">
                      Clique para upload
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      ou arraste e solte
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, JPG ou GIF (max. 800x400px)
                  </p>
                </>
              )}

              {/* Input "escondido" */}
              <Input
                {...register("image")}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImagePreview(url);
                    setValue("image", url);
                  }
                }}
                type="file"
                accept="image/*"
              />
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="Ex: X-Burger Duplo"
              className="h-11"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva os ingredientes e características do produto..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Preço e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { required: true })}
                placeholder="0.00"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                onValueChange={(val) => setValue("category", val)}
                defaultValue={product?.category || "lanches"}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lanches">🍔 Lanches</SelectItem>
                  <SelectItem value="pizzas">🍕 Pizzas</SelectItem>
                  <SelectItem value="bebidas">🥤 Bebidas</SelectItem>
                  <SelectItem value="sobremesas">🍰 Sobremesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm"
            >
              {product ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
