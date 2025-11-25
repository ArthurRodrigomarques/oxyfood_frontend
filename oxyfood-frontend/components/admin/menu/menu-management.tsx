"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

// Componentes Locais
import { ProductItem } from "./product-item";
import { ProductDialog } from "./product-dialog";
import { DeleteDialog } from "./delete-dialog";
import { Product, products as initialProducts } from "@/data/mockData";

export function MenuManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado dos Modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filtros
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleSave = (data: Partial<Product>) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...data } : p
        )
      );
      toast.success("Produto atualizado com sucesso!");
    } else {
      const newProduct = {
        ...data,
        id: Math.random().toString(),
        available: true,
        image: data.image || "/placeholder.png", // Fallback de imagem
      } as Product;
      setProducts([...products, newProduct]);
      toast.success("Produto adicionado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success("Produto removido do cardápio.");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleToggleAvailability = (id: string, current: boolean) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, available: !current } : p))
    );
    toast.info(current ? "Produto pausado." : "Produto ativado.");
  };

  return (
    <div className="space-y-6">
      {/* Header da Secção */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gerenciar Cardápio
          </h2>
          <p className="text-muted-foreground">
            Adicione, edite ou remova produtos do seu cardápio
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-900 hover:bg-orange-800 text-white font-medium shadow-sm h-10 px-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 max-w-full bg-white border-gray-200 h-11"
        />
      </div>

      {/* Tabs e Lista */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-gray-100/50 p-1 h-auto flex-wrap justify-start gap-2">
          <TabsTrigger value="all" className="px-4 py-2">
            Todos
          </TabsTrigger>
          <TabsTrigger value="lanches" className="px-4 py-2">
            Hambúrgueres
          </TabsTrigger>
          <TabsTrigger value="pizzas" className="px-4 py-2">
            Pizzas
          </TabsTrigger>
          <TabsTrigger value="sobremesas" className="px-4 py-2">
            Sobremesas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 animate-in fade-in-50">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onEdit={(p) => {
                setEditingProduct(p);
                setIsDialogOpen(true);
              }}
              onDelete={(p) => {
                setProductToDelete(p);
                setIsDeleteDialogOpen(true);
              }}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-muted-foreground">
                Nenhum produto encontrado.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setEditingProduct(null);
                  setIsDialogOpen(true);
                }}
                className="text-primary mt-2"
              >
                Adicionar um produto agora
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        onSave={handleSave}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        productName={productToDelete?.name}
      />
    </div>
  );
}
