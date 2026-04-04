"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Pencil, Save, X, Package, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { type Product } from "@/components/ProductCard";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "customer" | "admin";
}

const ProductModal = ({ product, open, onOpenChange, mode = "customer" }: ProductModalProps) => {
  const { addItem, items, updateQuantity } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Admin edit state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("");

  if (!product) return null;

  const cartItem = items.find((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setQuantity(1);
  };

  const handleStartEdit = () => {
    setEditName(product.name);
    setEditDescription(product.description);
    setEditPrice(product.priceNum.toFixed(2));
    setEditWeight(product.description.match(/\d+\s*(g|ml|kg|L|pcs?)/i)?.[0] || "");
    setEditStock("48");
    setEditCategory(product.category);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // In a real app this would persist changes
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setQuantity(1); setIsEditing(false); } }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold font-body px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          <span className="absolute top-4 right-4 bg-accent/90 text-accent-foreground text-xs font-medium font-body px-2 py-1 rounded">
            {product.category}
          </span>
          {mode === "customer" && (
            <button
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-sm"
              onClick={() => {
                if (!isAuthenticated) {
                  toast("Sign in required", {
                    description: "Please sign in to add items to your wishlist.",
                    action: { label: "Sign In", onClick: () => { onOpenChange(false); router.push("/login"); } },
                  });
                  return;
                }
                toggleItem(product);
              }}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`}
              />
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Header */}
          <DialogHeader className="space-y-1 p-0">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="font-display text-2xl font-bold h-auto py-1"
              />
            ) : (
              <DialogTitle className="font-display text-2xl font-bold text-foreground">
                {product.name}
              </DialogTitle>
            )}
          </DialogHeader>

          {/* Description */}
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Price (€)</label>
                  <Input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} type="number" step="0.01" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Weight / Volume</label>
                  <Input value={editWeight} onChange={(e) => setEditWeight(e.target.value)} placeholder="e.g. 700ml" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Category</label>
                  <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Stock</label>
                  <Input value={editStock} onChange={(e) => setEditStock(e.target.value)} type="number" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Product Image</label>
                <Button variant="outline" size="sm" className="gap-2">
                  <Package className="w-4 h-4" />
                  Upload New Image
                </Button>
              </div>
            </div>
          ) : (
            <p className="font-body text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          <Separator />

          {/* Price & Actions */}
          {!isEditing && (
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Price</p>
                  <span className="font-display text-3xl font-bold text-primary">{product.price}</span>
                </div>
                {cartItem && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {cartItem.quantity} in cart
                  </Badge>
                )}
              </div>

              {mode === "customer" && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-foreground">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart — €{(product.priceNum * quantity).toFixed(2)}
                  </Button>
                </div>
              )}

              {mode === "admin" && (
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                  onClick={handleStartEdit}
                >
                  <Pencil className="w-4 h-4" />
                  Edit Product
                </Button>
              )}
            </div>
          )}

          {/* Admin edit actions */}
          {isEditing && (
            <div className="flex gap-3">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={handleSaveEdit}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleCancelEdit}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
