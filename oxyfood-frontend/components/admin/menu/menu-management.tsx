"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { ProductItem } from "./product-item";
import { ProductDialog } from "./product-dialog";
import { DeleteDialog } from "./delete-dialog";

interface ApiOptionGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
}

interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  available: boolean;
  optionGroups: ApiOptionGroup[];
}

interface ApiCategory {
  id: string;
  name: string;
  products: ApiProduct[];
}

interface AdminMenuResponse {
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
}

export function MenuManagement() {
  const { activeRestaurantId } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Estado dos Modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FrontendProduct | null>(
    null
  );
  const [productToDelete, setProductToDelete] =
    useState<FrontendProduct | null>(null);

  // 1. BUSCAR DADOS (READ)
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
        });
      });
    });

    return flatList;
  }, [menuData]);

  // 2. MUTAÇÃO: CRIAR OU EDITAR
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
        // Editar (PUT)
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        // Criar (POST)
        const targetCategory = menuData?.categories.find(
          (c) => c.name === data.category
        );

        if (!targetCategory) throw new Error("Categoria não encontrada.");

        await api.post(`/categories/${targetCategory.id}/products`, payload);
      }
    },
    onSuccess: () => {
      toast.success(
        editingProduct
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao salvar produto.");
    },
  });

  // 3. MUTAÇÃO: DELETAR
  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("Produto removido.");
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      setIsDeleteDialogOpen(false);
    },
    onError: () => toast.error("Erro ao remover produto."),
  });

  // 4. MUTAÇÃO: TOGGLE DISPONIBILIDADE
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
      toast.success("Disponibilidade atualizada.");
    },
    onError: () => toast.error("Erro ao atualizar status."),
  });

  // Filtros de visualização
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data: Partial<FrontendProduct>) => {
    saveProduct(data);
  };

  const categoriesList = menuData?.categories?.map((c) => c.name) || [
    "Lanches",
    "Bebidas",
  ];

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

        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-700 text-white font-medium shadow-sm h-10 px-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 max-w-full bg-white border-gray-200 h-11"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-gray-100/50 p-1 h-auto flex-wrap justify-start gap-2">
          <TabsTrigger value="all" className="px-4 py-2">
            Todos
          </TabsTrigger>
          {categoriesList.map((catName) => (
            <TabsTrigger key={catName} value={catName} className="px-4 py-2">
              {catName}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-3 animate-in fade-in-50">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onEdit={(productToEdit) => {
                setEditingProduct(productToEdit as FrontendProduct);
                setIsDialogOpen(true);
              }}
              onDelete={(productToDelete) => {
                setProductToDelete(productToDelete as FrontendProduct);
                setIsDeleteDialogOpen(true);
              }}
              onToggleAvailability={(id, current) =>
                toggleAvailability({ id, available: !current })
              }
            />
          ))}
        </TabsContent>

        {categoriesList.map((catName) => (
          <TabsContent key={catName} value={catName} className="space-y-3">
            {filteredProducts
              .filter((p) => p.category === catName)
              .map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onEdit={(productToEdit) => {
                    setEditingProduct(productToEdit as FrontendProduct);
                    setIsDialogOpen(true);
                  }}
                  onDelete={(productToDelete) => {
                    setProductToDelete(productToDelete as FrontendProduct);
                    setIsDeleteDialogOpen(true);
                  }}
                  onToggleAvailability={(id, current) =>
                    toggleAvailability({ id, available: !current })
                  }
                />
              ))}
          </TabsContent>
        ))}
      </Tabs>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        onSave={(data) => handleSave(data as Partial<FrontendProduct>)}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => productToDelete && deleteProduct(productToDelete.id)}
        productName={productToDelete?.name}
      />
    </div>
  );
}
