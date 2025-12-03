"use client";

import { Product, Option, OptionGroup } from "@/data/mock-restaurant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

type SelectedOptions = {
  [groupId: string]: Option[];
};

function ProductModalContent({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [notes, setNotes] = useState("");
  const addItemToCart = useCartStore((state) => state.addItem);

  const totalPrice = useMemo(() => {
    let base = Number(product.basePrice);

    Object.values(selectedOptions)
      .flat()
      .forEach((opt) => {
        base += Number(opt.priceDelta);
      });

    return base * quantity;
  }, [product, quantity, selectedOptions]);

  const handleOptionToggle = (
    group: OptionGroup,
    option: Option,
    checked: boolean
  ) => {
    setSelectedOptions((prev) => {
      const currentSelection = prev[group.id] || [];

      if (group.type === "SINGLE") {
        return { ...prev, [group.id]: [option] };
      }

      if (checked) {
        if (currentSelection.length >= group.maxSelection) {
          toast.warning(`Máximo de ${group.maxSelection} opções permitido.`);
          return prev;
        }
        return { ...prev, [group.id]: [...currentSelection, option] };
      } else {
        return {
          ...prev,
          [group.id]: currentSelection.filter((o) => o.id !== option.id),
        };
      }
    });
  };

  const handleAddToCart = () => {
    for (const group of product.optionGroups) {
      const selection = selectedOptions[group.id] || [];
      if (selection.length < group.minSelection) {
        toast.error(
          `Selecione pelo menos ${group.minSelection} opção em "${group.name}".`
        );
        const element = document.getElementById(`group-${group.id}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    addItemToCart({
      product,
      quantity,
      selectedOptions: Object.values(selectedOptions).flat(),
      totalPrice,
      notes,
    });

    onClose();
    setTimeout(() => {
      setQuantity(1);
      setSelectedOptions({});
      setNotes("");
    }, 300);
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[80vh]">
      <div className="relative h-56 w-full shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>

      <div className="px-6 pt-6 pb-2 shrink-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {product.description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">
            {formatCurrency(product.basePrice)}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-8 py-4">
          {product.optionGroups.map((group) => (
            <div key={group.id} id={`group-${group.id}`} className="space-y-4">
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {group.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {group.minSelection > 0
                      ? `Escolha de ${group.minSelection} a ${group.maxSelection}`
                      : `Até ${group.maxSelection} opções (Opcional)`}
                  </p>
                </div>
                {group.minSelection > 0 && (
                  <span className="text-[10px] uppercase font-bold bg-muted-foreground/10 text-muted-foreground px-2 py-1 rounded">
                    Obrigatório
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {group.type === "SINGLE" ? (
                  <RadioGroup
                    value={selectedOptions[group.id]?.[0]?.id}
                    onValueChange={(val) => {
                      const opt = group.options.find((o) => o.id === val);
                      if (opt) handleOptionToggle(group, opt, true);
                    }}
                  >
                    {group.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-muted/20 px-2 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1 cursor-pointer">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer font-normal text-base"
                          >
                            {option.name}
                          </Label>
                        </div>
                        {Number(option.priceDelta) > 0 && (
                          <span className="text-sm font-medium text-emerald-600">
                            + {formatCurrency(option.priceDelta)}
                          </span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  group.options.map((option) => {
                    const isChecked =
                      selectedOptions[group.id]?.some(
                        (o) => o.id === option.id
                      ) || false;
                    return (
                      <div
                        key={option.id}
                        className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-muted/20 px-2 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            id={option.id}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleOptionToggle(group, option, !!checked)
                            }
                          />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer font-normal text-base"
                          >
                            {option.name}
                          </Label>
                        </div>
                        {Number(option.priceDelta) > 0 && (
                          <span className="text-sm font-medium text-emerald-600">
                            + {formatCurrency(option.priceDelta)}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}

          <div className="space-y-3 pt-4">
            <Label htmlFor="notes" className="font-semibold text-foreground">
              Alguma observação?
            </Label>
            <Input
              id="notes"
              placeholder="Ex: Tirar a cebola, maionese à parte..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-muted/30 border-muted-foreground/20 focus:bg-background transition-colors"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-6 border-t bg-background mt-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center border rounded-lg h-12 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 rounded-none rounded-l-lg hover:bg-muted/50 text-muted-foreground"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="h-full w-12 flex items-center justify-center font-bold text-lg border-x bg-muted/10">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 rounded-none rounded-r-lg hover:bg-muted/50 text-primary"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Total do item</p>
            <p className="text-xl font-extrabold text-foreground">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>

        <Button
          className="w-full h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
}

export function ProductModal(props: ProductModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Dialog open={props.isOpen} onOpenChange={props.onClose}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-none shadow-2xl">
          <ProductModalContent {...props} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <DrawerContent className="p-0 gap-0 max-h-[96vh] rounded-t-xl">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Detalhes do Produto</DrawerTitle>
        </DrawerHeader>
        <ProductModalContent {...props} />
        <DrawerFooter className="sr-only">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
