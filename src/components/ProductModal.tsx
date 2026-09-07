"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Save, X, Heart } from "lucide-react";
import CartQuantityControl from "@/components/CartQuantityControl";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { LANGUAGES, useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { type Product } from "@/components/ProductCard";
import { type AdminProductUpdate } from "@/lib/products/types";
import { saveAdminProductEdits } from "@/lib/products/admin-client";
import { resolveProductCopy } from "@/lib/products/resolve-copy";
import { Switch } from "@/components/ui/switch";
import { type Language } from "@/lib/i18n/translate";

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
  const { t, language } = useLanguage();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contentLanguage, setContentLanguage] = useState<Language>(language);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editIsFrozen, setEditIsFrozen] = useState(false);

  useEffect(() => {
    if (!open || !product) return;
    setContentLanguage(language);
    setIsEditing(false);
  }, [open, product?.id, language]);

  if (!product) return null;

  const copy = resolveProductCopy(product, product.translations, contentLanguage);
  const hasExactTranslation = Boolean(
    product.translations?.some(
      (row) => row.language === contentLanguage && row.name?.trim(),
    ),
  );

  const loadEditFieldsForLanguage = (lang: Language) => {
    const next = resolveProductCopy(product, product.translations, lang);
    setEditName(next.name);
    setEditDescription(next.description);
  };

  const handleStartEdit = () => {
    loadEditFieldsForLanguage(contentLanguage);
    setEditPrice(product.priceNum.toFixed(2));
    setEditStock(String(adminStock));
    setEditBadge(adminBadge ?? product.badge ?? "");
    setEditIsFrozen(adminIsFrozen || Boolean(product.isFrozen));
    setIsEditing(true);
  };

  const handleContentLanguageChange = (lang: Language) => {
    setContentLanguage(lang);
    if (isEditing) {
      loadEditFieldsForLanguage(lang);
    }
  };

  const handleSaveEdit = async () => {
    const price = Number.parseFloat(editPrice);
    const stock = Number.parseInt(editStock, 10);

    if (!editName.trim()) {
      toast.error(t("product.name_required"));
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      toast.error(t("product.price_invalid"));
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      toast.error(t("product.stock_invalid"));
      return;
    }

    setIsSaving(true);
    const update: AdminProductUpdate = {
      name: editName,
      description: editDescription,
      price,
      stock,
      badge: editBadge.trim() || null,
      isFrozen: editIsFrozen,
      language: contentLanguage,
    };
    const ok = await saveAdminProductEdits(product.id, update);
    setIsSaving(false);

    if (!ok) {
      toast.error(t("product.save_failed"));
      return;
    }

    toast.success(t("product.save_ok", { language: contentLanguage.toUpperCase() }));
    setIsEditing(false);
    onAdminSaved?.(update);
    onOpenChange(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setIsEditing(false); }}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={copy.name}
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
                toggleItem({ ...product, name: copy.name, description: copy.description });
              }}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`}
              />
            </button>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-4 space-y-4">
            {mode === "admin" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("product.content_language")}
                  </p>
                  {!hasExactTranslation && (
                    <p className="text-xs text-amber-700 mt-0.5">{t("product.translation_fallback")}</p>
                  )}
                </div>
                <Select
                  value={contentLanguage}
                  onValueChange={(v) => handleContentLanguageChange(v as Language)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogHeader className="space-y-1 p-0 text-left">
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="font-display text-2xl font-bold h-auto py-1"
                />
              ) : (
                <DialogTitle className="font-display text-2xl font-bold text-foreground">
                  {copy.name}
                </DialogTitle>
              )}
            </DialogHeader>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                    {t("product.description")}
                  </label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                      {t("product.price_eur")}
                    </label>
                    <Input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} type="number" step="0.01" min="0" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                      {t("product.stock")}
                    </label>
                    <Input value={editStock} onChange={(e) => setEditStock(e.target.value)} type="number" min="0" step="1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                      {t("product.category")}
                    </label>
                    <Input value={product.category} disabled />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                      {t("product.badge")}
                    </label>
                    <Input
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      placeholder={t("product.badge_placeholder")}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("product.frozen_label")}</p>
                    <p className="text-xs text-muted-foreground">{t("product.frozen_hint")}</p>
                  </div>
                  <Switch checked={editIsFrozen} onCheckedChange={setEditIsFrozen} />
                </div>
              </div>
            ) : (
              <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {copy.description}
              </p>
            )}
          </div>

          <div className="shrink-0 border-t border-border bg-background px-6 py-4 space-y-3">
            {!isEditing ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                    {t("product.price")}
                  </p>
                  <span className="font-display text-3xl font-bold text-primary">{product.price}</span>
                </div>

                {mode === "customer" && (
                  <CartQuantityControl
                    product={{ ...product, name: copy.name, description: copy.description }}
                    size="md"
                    className="w-full"
                  />
                )}

                {mode === "admin" && (
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                    onClick={handleStartEdit}
                  >
                    <Pencil className="w-4 h-4" />
                    {t("product.edit")}
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={() => void handleSaveEdit()}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? t("product.saving") : t("product.save")}
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleCancelEdit} disabled={isSaving}>
                  <X className="w-4 h-4" />
                  {t("product.cancel")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
