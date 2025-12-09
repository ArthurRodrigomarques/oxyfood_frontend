"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FrontendProduct } from "./menu-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";

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
  const { register, handleSubmit, reset, setValue, control } =
    useForm<Partial<FrontendProduct>>();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUrl = useWatch({ control, name: "image" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (error) => {
      setIsSubmitting(false);
      toast.error(`Erro no upload: ${error.message}`);
    },
  });

  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setIsSubmitting(false);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setValue("image", localPreviewUrl);
  };

  const onSubmit = async (data: Partial<FrontendProduct>) => {
    if (!data.categoryId) {
      toast.error("Selecione uma categoria.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = data.image;

      if (selectedFile) {
        const uploadRes = await startUpload([selectedFile]);
        if (uploadRes && uploadRes[0]) {
          finalImageUrl = uploadRes[0].url;
        } else {
          throw new Error("Falha ao receber URL da imagem.");
        }
      }

      const formattedData = {
        ...data,
        image: finalImageUrl,
        price: Number(data.price),
      };

      onSave(formattedData);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados e clique em salvar para enviar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Imagem do Produto
            </Label>

            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/10 transition-colors cursor-pointer bg-gray-50 relative group">
              {isSubmitting && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                  <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                  <span className="text-xs font-bold mt-2 text-orange-600">
                    Enviando imagem e salvando...
                  </span>
                </div>
              )}

              {imageUrl ? (
                <div className="relative w-full h-48 rounded-md overflow-hidden shadow-sm">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("image", "");
                        setSelectedFile(null);
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
                      Clique para escolher
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      (JPG, PNG - Max 4MB)
                    </span>
                  </div>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isSubmitting}
                onChange={handleImageSelect}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="Ex: X-Burger Duplo"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva os ingredientes..."
              className="min-h-[100px] resize-none"
            />
          </div>

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
                value={selectedCategoryId}
                onValueChange={(val) => setValue("categoryId", val)}
              >
                <SelectTrigger className="h-11">
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

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm"
            >
              {isSubmitting
                ? "Salvando..."
                : product
                ? "Salvar Alterações"
                : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
