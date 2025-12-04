"use client";

import { Product, Option, OptionGroup } from "@/types/order";
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
    <div className="flex flex-col h-full max-h-[90vh]">
      <div className="shrink-0">
        <div className="relative h-48 sm:h-56 w-full">
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

        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {product.name}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {product.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 mb-2">
            <span className="text-xl font-bold text-emerald-600">
              {formatCurrency(product.basePrice)}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 pb-6 space-y-6">
          {product.optionGroups.map((group) => (
            <div key={group.id} id={`group-${group.id}`} className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                <div>
                  <h4 className="font-bold text-gray-800">{group.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {group.minSelection > 0
                      ? `Escolha de ${group.minSelection} a ${group.maxSelection}`
                      : `Até ${group.maxSelection} opções`}
                  </p>
                </div>
                {group.minSelection > 0 && (
                  <span className="text-[10px] uppercase font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    Obrigatório
                  </span>
                )}
              </div>

              <div className="space-y-1 pl-1">
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
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center space-x-3 flex-1 cursor-pointer">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer font-normal text-base text-gray-700"
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
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
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
                            className="flex-1 cursor-pointer font-normal text-base text-gray-700"
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

          <div className="space-y-2 pt-2">
            <Label htmlFor="notes" className="font-bold text-gray-800">
              Alguma observação?
            </Label>
            <Input
              id="notes"
              placeholder="Ex: Sem cebola, capricha no molho..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 sm:p-6 border-t bg-white shrink-0 z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center border rounded-lg h-10 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-10 rounded-none rounded-l-lg hover:bg-gray-100 text-gray-500"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="h-full w-10 flex items-center justify-center font-bold text-base border-x bg-gray-50">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-10 rounded-none rounded-r-lg hover:bg-gray-100 text-primary"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Total</p>
            <p className="text-xl font-extrabold text-gray-900 leading-none">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-200/50 transition-all rounded-xl"
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
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-none shadow-2xl bg-white h-auto max-h-[90vh]">
          <ProductModalContent {...props} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <DrawerContent className="p-0 gap-0 max-h-[95vh] rounded-t-2xl bg-white">
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
