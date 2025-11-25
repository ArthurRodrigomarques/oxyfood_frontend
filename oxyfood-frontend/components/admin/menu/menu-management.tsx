"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { ProductItem } from "./product-item";
import { ProductDialog } from "./product-dialog";
import { DeleteDialog } from "./delete-dialog";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

// Dados para teste
const initialProducts: Product[] = [
  {
    id: "1",
    name: "X-Burger Duplo",
    description: "Dois hambúrgueres artesanais de 150g, queijo cheddar...",
    price: 28.9,
    category: "lanches",
    image: "https://placehold.co/600x400/FF5733/FFFFFF?text=X-Burger",
    available: true,
  },
  {
    id: "2",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela de búfala...",
    price: 45.9,
    category: "pizzas",
    image: "https://placehold.co/600x400/FF5733/FFFFFF?text=Pizza",
    available: true,
  },
];

export function MenuManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      } as Product;
      setProducts([...products, newProduct]);
      toast.success("Produto criado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success("Produto removido.");
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
    <div className="space-y-6 p-6 bg-white rounded-lg border shadow-sm">
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
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 max-w-md bg-gray-50"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 bg-gray-100/50">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="lanches">Hambúrgueres</TabsTrigger>
          <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
          <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              Nenhum produto encontrado.
            </div>
          )}
        </TabsContent>
      </Tabs>

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
