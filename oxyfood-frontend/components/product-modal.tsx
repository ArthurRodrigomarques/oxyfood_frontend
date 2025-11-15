"use client";

import { Product, Option, OptionGroup } from "@/data/mock-restaurant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

type SelectedOptions = {
  [groupId: string]: Option | Option[];
};

function ProductModalContent({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [notes, setNotes] = useState("");
  const addItemToCart = useCartStore((state) => state.addItem);

  const totalPrice = useMemo(() => {
    let base = parseFloat(product.basePrice);

    Object.values(selectedOptions).forEach((optionOrOptions) => {
      if (Array.isArray(optionOrOptions)) {
        optionOrOptions.forEach((opt) => {
          base += parseFloat(opt.priceDelta);
        });
      } else if (optionOrOptions) {
        base += parseFloat(optionOrOptions.priceDelta);
      }
    });

    return base * quantity;
  }, [product, quantity, selectedOptions]);

  function handleOptionChange(
    group: OptionGroup,
    option: Option,
    checked?: boolean
  ) {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev };
      const currentGroupSelection = newOptions[group.id];

      if (group.type === "SINGLE") {
        newOptions[group.id] = option;
      } else if (group.type === "MULTIPLE") {
        let newGroupArray: Option[] = Array.isArray(currentGroupSelection)
          ? [...currentGroupSelection]
          : [];

        if (checked) {
          if (newGroupArray.length < group.maxSelection) {
            newGroupArray.push(option);
          } else {
            toast.warning(
              `Máximo de ${
                group.maxSelection
              } ${group.name.toLowerCase()} atingido.`
            );
            return prev;
          }
        } else {
          newGroupArray = newGroupArray.filter((opt) => opt.id !== option.id);
        }
        newOptions[group.id] = newGroupArray;
      }

      return newOptions;
    });
  }

  function handleAddToCart() {
    for (const group of product.optionGroups) {
      if (group.minSelection > 0) {
        const selection = selectedOptions[group.id];
        const selectionCount = Array.isArray(selection)
          ? selection.length
          : selection
          ? 1
          : 0;

        if (selectionCount < group.minSelection) {
          toast.error(
            `Selecione pelo menos ${
              group.minSelection
            } ${group.name.toLowerCase()}.`
          );
          return;
        }
      }
    }

    const allSelectedOptions = Object.values(selectedOptions).flat();

    addItemToCart({
      product,
      quantity,
      selectedOptions: allSelectedOptions,
      totalPrice,
      notes,
    });

    onClose();
    setTimeout(() => {
      setQuantity(1);
      setSelectedOptions({});
      setNotes("");
    }, 500);
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl || "https://placehold.co/600x400"}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="p-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
            <DialogDescription>{product.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {product.optionGroups.map((group) => (
              <fieldset key={group.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <legend className="font-medium">{group.name}</legend>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {group.minSelection > 0 ? `Obrigatório` : "Opcional"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selecione{" "}
                  {group.type === "SINGLE"
                    ? "1 opção"
                    : `até ${group.maxSelection} ${
                        group.maxSelection > 1 ? "opções" : "opção"
                      }`}
                  .
                </p>

                {group.type === "SINGLE" && (
                  <RadioGroup
                    onValueChange={(optionId) => {
                      const opt = group.options.find((o) => o.id === optionId);
                      if (opt) handleOptionChange(group, opt);
                    }}
                  >
                    {group.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between"
                      >
                        <Label
                          htmlFor={option.id}
                          className="flex-1 cursor-pointer py-2"
                        >
                          {option.name}
                        </Label>
                        <span className="text-sm mr-2">
                          + R$ {parseFloat(option.priceDelta).toFixed(2)}
                        </span>
                        <RadioGroupItem value={option.id} id={option.id} />
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {group.type === "MULTIPLE" && (
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between"
                      >
                        <Label
                          htmlFor={option.id}
                          className="flex-1 cursor-pointer py-2"
                        >
                          {option.name}
                        </Label>
                        <span className="text-sm mr-2">
                          + R$ {parseFloat(option.priceDelta).toFixed(2)}
                        </span>
                        <Checkbox
                          id={option.id}
                          onCheckedChange={(checked) => {
                            handleOptionChange(group, option, !!checked);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="mt-4" />
              </fieldset>
            ))}

            <fieldset className="space-y-2">
              <legend className="font-medium">Observações</legend>
              <Input
                placeholder="Ex: Tirar a cebola, maionese à parte..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </fieldset>
          </div>
        </div>
      </div>

      <DialogFooter className="p-4 flex-col sm:flex-row sm:justify-between items-center w-full gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </Button>
          <span className="font-bold w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </Button>
        </div>

        <Button className="flex-1 w-full sm:w-auto" onClick={handleAddToCart}>
          Adicionar (R$ {totalPrice.toFixed(2)})
        </Button>
      </DialogFooter>
    </>
  );
}

export function ProductModal(props: ProductModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Dialog open={props.isOpen} onOpenChange={props.onClose}>
        <DialogContent className="max-w-md p-0 gap-0">
          <ProductModalContent {...props} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <DrawerContent className="p-0 gap-0">
        <DrawerHeader className="p-4 pb-0">
          <DrawerTitle>{props.product.name}</DrawerTitle>
        </DrawerHeader>
        <ProductModalContent {...props} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
