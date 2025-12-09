"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Loader2, Trash2, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

import { ProductItem } from "./product-item";
import { ProductDialog } from "./product-dialog";
import { DeleteDialog } from "./delete-dialog";
import { CategoryDialog } from "./category-dialog";
import { OptionsDialog } from "./options-dialog";

export interface MenuOption {
  id: string;
  name: string;
  priceDelta: number | string;
  groupId?: string;
}

export interface MenuOptionGroup {
  id: string;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  minSelection: number;
  maxSelection: number;
  options: MenuOption[];
}

interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  available: boolean;
  optionGroups?: MenuOptionGroup[];
}

export interface ApiCategory {
  id: string;
  name: string;
  products: ApiProduct[];
}

export interface AdminMenuResponse {
  categories: ApiCategory[];
}

export interface FrontendProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  image: string;
  available: boolean;
  optionGroups: MenuOptionGroup[];
}

export function MenuManagement() {
  const { activeRestaurantId } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);
  const [productToManageOptions, setProductToManageOptions] =
    useState<FrontendProduct | null>(null);

  const [productToDelete, setProductToDelete] =
    useState<FrontendProduct | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [editingProduct, setEditingProduct] = useState<FrontendProduct | null>(
    null
  );

  const { data: menuData, isLoading } = useQuery<AdminMenuResponse>({
    queryKey: ["admin-menu", activeRestaurantId],
    queryFn: async () => {
      const response = await api.get<AdminMenuResponse>(
        `/restaurants/${activeRestaurantId}/menu`
      );
      return response.data;
    },
    enabled: !!activeRestaurantId,
  });

  const products: FrontendProduct[] = useMemo(() => {
    if (!menuData?.categories) return [];
    const flatList: FrontendProduct[] = [];

    menuData.categories.forEach((category) => {
      category.products.forEach((product) => {
        flatList.push({
          id: product.id,
          name: product.name,
          description: product.description || "",
          price: Number(product.basePrice),
          category: category.name,
          categoryId: category.id,
          image: product.imageUrl || "",
          available: product.available,
          optionGroups: product.optionGroups || [],
        });
      });
    });
    return flatList;
  }, [menuData]);

  const { mutate: saveProduct } = useMutation({
    mutationFn: async (data: Partial<FrontendProduct>) => {
      const payload = {
        name: data.name,
        description: data.description,
        basePrice: data.price,
        imageUrl: data.image,
        available: data.available,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);

        // Se mudou de categoria (verificando se categoryId veio no data)
        if (data.categoryId && data.categoryId !== editingProduct.categoryId) {
          // Nota: O backend precisaria de uma rota específica para mover produtos ou o update suportar categoryId
          // Por enquanto, assumimos que o update atualiza dados básicos.
          // Se precisar mover, implemente no backend ou delete/crie novamente (não recomendado).
        }
      } else {
        if (!data.categoryId) throw new Error("Categoria é obrigatória.");

        await api.post(`/categories/${data.categoryId}/products`, payload);
      }
    },
    onSuccess: () => {
      toast.success("Produto salvo!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      setIsProductDialogOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao salvar produto.");
    },
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Produto removido.");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      setProductToDelete(null);
    },
    onError: () => toast.error("Erro ao remover produto."),
  });

  const { mutate: toggleAvailability } = useMutation({
    mutationFn: async ({
      id,
      available,
    }: {
      id: string;
      available: boolean;
    }) => {
      await api.put(`/products/${id}`, { available });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      toast.success("Status atualizado.");
    },
  });

  const { mutate: createCategory } = useMutation({
    mutationFn: async (name: string) => {
      await api.post(`/restaurants/${activeRestaurantId}/categories`, { name });
    },
    onSuccess: () => {
      toast.success("Categoria criada!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
    },
    onError: () => toast.error("Erro ao criar categoria."),
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Categoria removida!");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      setCategoryToDelete(null);
    },
    onError: () =>
      toast.error("Não é possível excluir categoria com produtos."),
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gerenciar Cardápio
          </h2>
          <p className="text-muted-foreground">
            {products.length} produtos cadastrados
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsCategoryDialogOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Categoria
          </Button>

          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsProductDialogOpen(true);
            }}
            className="bg-orange-500 hover:bg-orange-700 text-white flex-1 sm:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Produto
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-gray-100/50 p-1 h-auto flex-wrap justify-start gap-2 w-full sm:w-auto">
          <TabsTrigger value="all" className="px-4 py-2">
            Todos
          </TabsTrigger>
          {menuData?.categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="px-4 py-2">
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
              Nenhum produto encontrado.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onEdit={(p) => {
                  setEditingProduct(p as unknown as FrontendProduct);
                  setIsProductDialogOpen(true);
                }}
                onDelete={(p) => {
                  setProductToDelete(p as unknown as FrontendProduct);
                }}
                onToggleAvailability={(id, current) =>
                  toggleAvailability({ id, available: !current })
                }
                onManageOptions={(p) => {
                  setProductToManageOptions(p);
                  setIsOptionsDialogOpen(true);
                }}
              />
            ))
          )}
        </TabsContent>

        {menuData?.categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border mb-4">
              <span className="font-semibold text-sm text-gray-700">
                Gerenciar Categoria: {cat.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() =>
                  setCategoryToDelete({ id: cat.id, name: cat.name })
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Categoria
              </Button>
            </div>

            {filteredProducts.filter((p) => p.categoryId === cat.id).length ===
            0 ? (
              <div className="text-center py-8 text-muted-foreground italic">
                Nenhum produto nesta categoria.
              </div>
            ) : (
              filteredProducts
                .filter((p) => p.categoryId === cat.id)
                .map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={(p) => {
                      setEditingProduct(p as unknown as FrontendProduct);
                      setIsProductDialogOpen(true);
                    }}
                    onDelete={(p) => {
                      setProductToDelete(p as unknown as FrontendProduct);
                    }}
                    onToggleAvailability={(id, current) =>
                      toggleAvailability({ id, available: !current })
                    }
                    onManageOptions={(p) => {
                      setProductToManageOptions(p);
                      setIsOptionsDialogOpen(true);
                    }}
                  />
                ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={editingProduct}
        onSave={saveProduct}
        categories={
          menuData?.categories.map((c) => ({ id: c.id, name: c.name })) || []
        }
      />

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSave={createCategory}
      />

      <OptionsDialog
        open={isOptionsDialogOpen}
        onOpenChange={setIsOptionsDialogOpen}
        product={productToManageOptions}
      />

      <DeleteDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        onConfirm={() => productToDelete && deleteProduct(productToDelete.id)}
        productName={productToDelete?.name}
      />

      <DeleteDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        onConfirm={() =>
          categoryToDelete && deleteCategory(categoryToDelete.id)
        }
        productName={`Categoria: ${categoryToDelete?.name}`}
      />
    </div>
  );
}
