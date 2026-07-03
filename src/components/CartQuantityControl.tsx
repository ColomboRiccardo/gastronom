"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { type Product } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

interface CartQuantityControlProps {
  product: Product;
  size?: "sm" | "md";
  className?: string;
}

const CartQuantityControl = ({ product, size = "sm", className }: CartQuantityControlProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const { t } = useLanguage();
  const quantity = items.find((i) => i.product.id === product.id)?.quantity ?? 0;

  const [inputValue, setInputValue] = useState(String(quantity));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(quantity));
    }
  }, [quantity, isEditing]);

  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleAdd = (e: React.MouseEvent) => {
    stopPropagation(e);
    addItem(product);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    stopPropagation(e);
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    stopPropagation(e);
    updateQuantity(product.id, quantity + 1);
  };

  const commitInput = () => {
    setIsEditing(false);
    const parsed = Number.parseInt(inputValue, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, parsed);
    }
  };

  const btnSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const inputSize = size === "sm" ? "h-8 w-10" : "h-10 flex-1 min-w-12";

  if (quantity === 0) {
    return (
      <Button
        size="sm"
        className={cn(
          "bg-primary hover:bg-primary/90 text-primary-foreground gap-1 shrink-0",
          className,
        )}
        onClick={handleAdd}
      >
        <ShoppingCart className="h-4 w-4" />
        {size === "sm" ? "Add" : t("products.add_to_cart")}
      </Button>
    );
  }

  return (
    <div
      className={cn("flex items-center border border-border rounded-md shrink-0", className)}
      onClick={stopPropagation}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(btnSize, "rounded-r-none shrink-0")}
        onClick={handleDecrease}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </Button>
      <Input
        type="number"
        min={1}
        value={inputValue}
        onChange={(e) => {
          setIsEditing(true);
          setInputValue(e.target.value);
        }}
        onBlur={commitInput}
        onKeyDown={(e) => {
          stopPropagation(e);
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        onClick={stopPropagation}
        className={cn(
          inputSize,
          "text-center border-0 border-x border-border rounded-none px-0 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
        aria-label="Quantity"
      />
      <Button
        variant="ghost"
        size="icon"
        className={cn(btnSize, "rounded-l-none shrink-0")}
        onClick={handleIncrease}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
};

export default CartQuantityControl;
