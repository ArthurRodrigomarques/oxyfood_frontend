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
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag } from "lucide-react";

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
        const isAlreadySelected = currentSelection.some(
          (o) => o.id === option.id
        );
        if (isAlreadySelected) return prev;

        if (currentSelection.length >= Number(group.maxSelection)) {
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
    if (product.optionGroups) {
      for (const group of product.optionGroups) {
        const selection = selectedOptions[group.id] || [];
        if (selection.length < group.minSelection) {
          toast.error(
            `Selecione pelo menos ${group.minSelection} opção em "${group.name}".`
          );
          return;
        }
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
    <div className="flex flex-col h-full w-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="relative h-56 sm:h-64 w-full bg-gray-100 shrink-0">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 600px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100">
              <ShoppingBag className="h-12 w-12 opacity-20" />
            </div>
          )}
        </div>

        <div className="px-6 py-6">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            {product.description || "Sem descrição detalhada."}
          </p>
          <div className="mt-4">
            <span className="text-xl font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
              {formatCurrency(product.basePrice)}
            </span>
          </div>
        </div>

        <div className="px-6 pb-8 space-y-8">
          {product.optionGroups && product.optionGroups.length > 0
            ? product.optionGroups.map((group) => (
                <div key={group.id} className="space-y-4">
                  <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm py-3 border-b z-10">
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">
                        {group.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {group.minSelection > 0
                          ? `Selecione de ${group.minSelection} a ${group.maxSelection}`
                          : `Até ${group.maxSelection} opções`}
                      </p>
                    </div>
                    {group.minSelection > 0 ? (
                      <span className="text-[10px] uppercase font-bold bg-gray-800 text-white px-2 py-1 rounded">
                        Obrigatório
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        Opcional
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {group.type === "SINGLE" ? (
                      <RadioGroup
                        value={selectedOptions[group.id]?.[0]?.id || ""}
                        onValueChange={(val) => {
                          const opt = group.options.find((o) => o.id === val);
                          if (opt) handleOptionToggle(group, opt, true);
                        }}
                      >
                        {group.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2 cursor-pointer"
                            onClick={() =>
                              handleOptionToggle(group, option, true)
                            }
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <RadioGroupItem
                                value={option.id}
                                id={option.id}
                              />
                              <Label
                                htmlFor={option.id}
                                className="flex-1 cursor-pointer font-medium text-gray-700"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {Number(option.priceDelta) > 0 && (
                              <span className="text-sm font-semibold text-emerald-600">
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
                            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2 cursor-pointer"
                            onClick={() =>
                              handleOptionToggle(group, option, !isChecked)
                            }
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
                                className="flex-1 cursor-pointer font-medium text-gray-700"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {Number(option.priceDelta) > 0 && (
                              <span className="text-sm font-semibold text-emerald-600">
                                + {formatCurrency(option.priceDelta)}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))
            : null}

          <div className="space-y-3 pt-2">
            <Label
              htmlFor="notes"
              className="font-bold text-gray-800 text-base"
            >
              Alguma observação?
            </Label>
            <Textarea
              id="notes"
              placeholder="Ex: Tirar a cebola, maionese à parte..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 min-h-[100px] resize-none text-base p-4 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20 shrink-0">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center border border-gray-200 rounded-xl h-12 shadow-sm bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 rounded-none rounded-l-xl hover:bg-gray-50 text-gray-600"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <div className="h-full min-w-[3rem] flex items-center justify-center font-bold text-lg border-x border-gray-100">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 rounded-none rounded-r-xl hover:bg-gray-50 text-orange-600"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-right flex-1">
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              Valor Total
            </p>
            <p className="text-2xl font-extrabold text-gray-900 leading-none">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>

        <Button
          className="w-full h-14 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-200 transition-all rounded-xl"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 h-6 w-6" />
          Adicionar à Sacola
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
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-none shadow-2xl bg-white h-[90vh] flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>{props.product.name}</DialogTitle>
            <DialogDescription>
              {props.product.description || "Detalhes do produto"}
            </DialogDescription>
          </DialogHeader>
          <ProductModalContent {...props} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <DrawerContent className="p-0 gap-0 h-[95vh] rounded-t-[20px] bg-white flex flex-col after:!bg-gray-300">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{props.product.name}</DrawerTitle>
          <DrawerDescription>
            {props.product.description || "Detalhes do produto"}
          </DrawerDescription>
        </DrawerHeader>
        <ProductModalContent {...props} />
        <DrawerFooter className="sr-only">
          <DrawerClose>Fechar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
