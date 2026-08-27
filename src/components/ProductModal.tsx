"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Pencil, Save, X, Heart } from "lucide-react";
import CartQuantityControl from "@/components/CartQuantityControl";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { type Product } from "@/components/ProductCard";
import { type AdminProductUpdate } from "@/lib/products/types";
import { saveAdminProductEdits } from "@/lib/products/admin-client";
import { Switch } from "@/components/ui/switch";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "customer" | "admin";
  adminStock?: number;
  adminBadge?: string | null;
  adminIsFrozen?: boolean;
  onAdminSaved?: (update: AdminProductUpdate) => void;
}

const ProductModal = ({
  product,
  open,
  onOpenChange,
  mode = "customer",
  adminStock = 0,
  adminBadge = null,
  adminIsFrozen = false,
  onAdminSaved,
}: ProductModalProps) => {
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Admin edit state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editIsFrozen, setEditIsFrozen] = useState(false);

  if (!product) return null;

  const handleStartEdit = () => {
    setEditName(product.name);
    setEditDescription(product.description);
    setEditPrice(product.priceNum.toFixed(2));
    setEditStock(String(adminStock));
    setEditBadge(adminBadge ?? product.badge ?? "");
    setEditIsFrozen(adminIsFrozen || Boolean(product.isFrozen));
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const price = Number.parseFloat(editPrice);
    const stock = Number.parseInt(editStock, 10);

    if (!editName.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      toast.error("Enter a valid price");
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      toast.error("Enter a valid stock amount");
      return;
    }

    setIsSaving(true);
    const ok = await saveAdminProductEdits(product.id, {
      name: editName,
      description: editDescription,
      price,
      stock,
      badge: editBadge.trim() || null,
      isFrozen: editIsFrozen,
    });
    setIsSaving(false);

    if (!ok) {
      toast.error("Failed to save product changes");
      return;
    }

    toast.success("Product updated — sync will not overwrite these fields");
    setIsEditing(false);
    onAdminSaved?.({
      name: editName,
      description: editDescription,
      price,
      stock,
      badge: editBadge.trim() || null,
      isFrozen: editIsFrozen,
    });
    onOpenChange(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setIsEditing(false); }}>
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
                  toast(t("product.wishlist_signin_title"), {
                    description: t("product.wishlist_signin_desc"),
                    action: {
                      label: t("product.wishlist_signin_action"),
                      onClick: () => {
                        onOpenChange(false);
                        router.push("/login");
                      },
                    },
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
                  <Input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} type="number" step="0.01" min="0" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Stock</label>
                  <Input value={editStock} onChange={(e) => setEditStock(e.target.value)} type="number" min="0" step="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Category</label>
                  <Input value={product.category} disabled />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Badge</label>
                  <Input value={editBadge} onChange={(e) => setEditBadge(e.target.value)} placeholder="e.g. New, Popular" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">Frozen / no courier</p>
                  <p className="text-xs text-muted-foreground">Pickup or local delivery only</p>
                </div>
                <Switch checked={editIsFrozen} onCheckedChange={setEditIsFrozen} />
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
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                    {mode === "customer" ? t("product.price") : "Price"}
                  </p>
                  <span className="font-display text-3xl font-bold text-primary">{product.price}</span>
                </div>
              </div>

              {mode === "customer" && (
                <CartQuantityControl product={product} size="md" className="w-full" />
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
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                onClick={() => void handleSaveEdit()}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleCancelEdit} disabled={isSaving}>
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
