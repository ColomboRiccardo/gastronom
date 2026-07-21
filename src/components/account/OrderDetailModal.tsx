"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Edit,
  X,
  Plus,
  Minus,
  Search,
  RefreshCw,
  Mail,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared types                                                       */
/* ------------------------------------------------------------------ */

export interface OrderItem {
  productId?: number;
  name: string;
  qty: number;
  price: string;
}

export interface OrderDetail {
  id: string;
  date: string;
  customer?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  modificationProposal?: OrderItem[];
  modificationMessage?: string;
  modificationSentAt?: string;
  total: string;
  status: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

interface ProductOption {
  id: number;
  name: string;
  price: number;
}

interface Props {
  order: OrderDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  onStatusChange?: (orderId: string, newStatus: string) => void;
  onDelete?: (orderId: string) => void;
  onProposeModification?: (
    orderId: string,
    items: OrderItem[],
    newTotal: string,
    message: string,
  ) => Promise<{ ok: boolean; whatsappUrl?: string | null; error?: string }>;
}

/* ------------------------------------------------------------------ */
/*  Status pipeline                                                    */
/* ------------------------------------------------------------------ */

const STATUSES = ["Received", "Processing", "Shipped", "Delivered"] as const;

const statusMeta: Record<string, { icon: React.ElementType; color: string }> = {
  Received: { icon: Clock, color: "text-muted-foreground" },
  Processing: { icon: Package, color: "text-yellow-600" },
  Modification: { icon: RefreshCw, color: "text-orange-600" },
  Shipped: { icon: Truck, color: "text-blue-600" },
  Delivered: { icon: CheckCircle2, color: "text-green-600" },
  Cancelled: { icon: X, color: "text-destructive" },
};

function StatusPipeline({ current }: { current: string }) {
  const isCancelled = current === "Cancelled";
  const isModification = current === "Modification";
  const activeIdx = STATUSES.indexOf(current as (typeof STATUSES)[number]);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-3 px-2 rounded-lg bg-destructive/5 border border-destructive/20">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-sm font-semibold text-destructive">Order Cancelled</span>
      </div>
    );
  }

  if (isModification) {
    return (
      <div className="flex items-center gap-2 py-3 px-2 rounded-lg bg-orange-50 border border-orange-200">
        <RefreshCw className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-semibold text-orange-800">
          Awaiting customer response to proposed changes
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center w-full min-w-0 gap-0 py-2">
      {STATUSES.map((s, i) => {
        const reached = i <= activeIdx;
        const meta = statusMeta[s];
        const Icon = meta.icon;
        return (
          <div key={s} className="flex items-center flex-1 min-w-0 last:flex-none">
            <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors shrink-0",
                  reached
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium text-center leading-tight px-0.5",
                  reached ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
            </div>
            {i < STATUSES.length - 1 && (
              <div
                className={cn(
                  "h-0.5 mx-1 mt-[-18px] flex-1 min-w-2",
                  i < activeIdx ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const statusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800 border-green-200";
    case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Modification": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Received": return "bg-muted text-muted-foreground border-border";
    case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const parsePrice = (p: string) => parseFloat(p.replace("€", ""));
const formatPrice = (n: number) => `€${n.toFixed(2)}`;

const calcTotal = (items: OrderItem[]) =>
  formatPrice(items.reduce((sum, it) => sum + parsePrice(it.price) * it.qty, 0));

/* ------------------------------------------------------------------ */
/*  Add Product Popover                                                */
/* ------------------------------------------------------------------ */

function AddProductPopover({
  products,
  onAdd,
}: {
  products: ProductOption[];
  onAdd: (product: ProductOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">No products found</p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                className="w-full flex justify-between items-center px-2 py-1.5 text-sm rounded-md hover:bg-secondary/60 transition-colors text-left"
                onClick={() => {
                  onAdd(p);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span className="truncate mr-2">{p.name}</span>
                <span className="text-muted-foreground text-xs shrink-0">{formatPrice(p.price)}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

const OrderDetailModal = ({
  order,
  open,
  onOpenChange,
  isAdmin = false,
  onStatusChange,
  onDelete,
  onProposeModification,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingItems, setEditingItems] = useState(false);
  const [localItems, setLocalItems] = useState<OrderItem[]>([]);
  const [modificationMessage, setModificationMessage] = useState("");
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [sendingProposal, setSendingProposal] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [replaceOpenIndex, setReplaceOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !isAdmin || !editingItems) return;

    let cancelled = false;
    setProductsLoading(true);

    fetch("/api/admin/products/options")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, isAdmin, editingItems]);

  if (!order) return null;

  const hasProposal = Boolean(order.modificationProposal?.length);
  const displayItems =
    !editingItems && order.status === "Modification" && hasProposal
      ? order.modificationProposal!
      : editingItems
        ? localItems
        : order.items;

  const displayTotal = editingItems ? calcTotal(localItems) : order.total;

  const startEditing = () => {
    const base =
      order.status === "Modification" && order.modificationProposal?.length
        ? order.modificationProposal
        : order.items;
    setLocalItems(base.map((item) => ({ ...item })));
    setModificationMessage(order.modificationMessage ?? "");
    setWhatsappUrl(null);
    setEditingItems(true);
  };

  const cancelEditing = () => {
    setEditingItems(false);
    setLocalItems([]);
    setModificationMessage("");
    setReplaceOpenIndex(null);
  };

  const sendProposal = async () => {
    if (!onProposeModification || localItems.length === 0) return;

    setSendingProposal(true);
    const newTotal = calcTotal(localItems);
    const result = await onProposeModification(
      order.id,
      localItems,
      newTotal,
      modificationMessage.trim(),
    );
    setSendingProposal(false);

    if (result.ok) {
      setWhatsappUrl(result.whatsappUrl ?? null);
      setEditingItems(false);
      setReplaceOpenIndex(null);
    }
  };

  const updateQty = (index: number, delta: number) => {
    setLocalItems((prev) => {
      const next = [...prev];
      const newQty = next[index].qty + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = { ...next[index], qty: newQty };
      }
      return next;
    });
  };

  const removeItem = (index: number) => {
    setLocalItems((prev) => prev.filter((_, i) => i !== index));
    setReplaceOpenIndex(null);
  };

  const replaceItem = (index: number, product: ProductOption) => {
    setLocalItems((prev) => {
      const next = [...prev];
      next[index] = {
        productId: product.id,
        name: product.name,
        qty: next[index].qty,
        price: formatPrice(product.price),
      };
      return next;
    });
    setReplaceOpenIndex(null);
  };

  const addProduct = (product: ProductOption) => {
    setLocalItems((prev) => {
      const existing = prev.findIndex((it) => it.productId === product.id || it.name === product.name);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + 1 };
        return next;
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, qty: 1, price: formatPrice(product.price) },
      ];
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete?.(order.id);
    onOpenChange(false);
    setConfirmDelete(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setConfirmDelete(false);
          setEditingItems(false);
          setReplaceOpenIndex(null);
          setWhatsappUrl(null);
        }
      }}
    >
      <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[85vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex flex-wrap items-center gap-2 pr-8">
            <span className="font-mono text-primary break-all">{order.id}</span>
            <Badge variant="outline" className={statusColor(order.status)}>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Order Progress</p>
          <StatusPipeline current={order.status} />
        </div>

        {order.status === "Modification" && order.modificationMessage && !editingItems && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1">Message to customer</p>
            <p>{order.modificationMessage}</p>
            {order.modificationSentAt && (
              <p className="text-xs text-orange-700 mt-1">
                Sent {new Date(order.modificationSentAt).toLocaleString("en-GB")}
              </p>
            )}
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Date</p>
            <p className="font-medium">{order.date}</p>
          </div>
          {order.customer && (
            <div>
              <p className="text-muted-foreground text-xs">Customer</p>
              <p className="font-medium">{order.customer}</p>
            </div>
          )}
          {order.paymentMethod && (
            <div>
              <p className="text-muted-foreground text-xs">Payment</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
          )}
          {order.shippingAddress && (
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">Shipping Address</p>
              <p className="font-medium">{order.shippingAddress}</p>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {order.status === "Modification" && hasProposal && !editingItems
                ? "Proposed items"
                : "Items"}
              {editingItems && <span className="text-primary ml-1">(Editing)</span>}
            </p>
            {isAdmin && !editingItems && order.status !== "Delivered" && order.status !== "Cancelled" && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary" onClick={startEditing}>
                <Edit className="w-3 h-3" />
                Propose changes
              </Button>
            )}
          </div>

          {order.status === "Modification" && hasProposal && !editingItems && (
            <div className="mb-3 rounded-md border border-dashed border-border p-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Original order</p>
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <div key={`orig-${item.name}-${i}`} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.name} ×{item.qty}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {displayItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No items in this order</p>
            ) : (
              displayItems.map((item, i) => (
                <div
                  key={`${item.productId ?? item.name}-${i}`}
                  className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center py-2 px-3 rounded-md bg-secondary/40 border border-border min-w-0"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                    {editingItems && replaceOpenIndex === i ? (
                      <Select
                        value={item.productId ? String(item.productId) : undefined}
                        onValueChange={(value) => {
                          const product = products.find((p) => String(p.id) === value);
                          if (product) replaceItem(i, product);
                        }}
                      >
                        <SelectTrigger className="h-8 flex-1 min-w-0 text-sm">
                          <SelectValue placeholder="Select product..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {products.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name} — {formatPrice(p.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm font-medium break-words">{item.name}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2 text-sm shrink-0 sm:pl-3">
                    {editingItems ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setReplaceOpenIndex(replaceOpenIndex === i ? null : i)}
                          disabled={productsLoading}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Replace
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(i, -1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-5 text-center font-medium">{item.qty}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(i, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="font-semibold ml-1 w-16 text-right">{item.price}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeItem(i)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">x{item.qty}</span>
                        <span className="font-semibold">{item.price}</span>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {editingItems && (
            <div className="mt-2">
              <AddProductPopover products={products} onAdd={addProduct} />
            </div>
          )}

          {editingItems && (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Note to customer (optional)
                </p>
                <Textarea
                  placeholder="e.g. Beluga caviar is out of stock, we suggest red salmon caviar instead."
                  value={modificationMessage}
                  onChange={(e) => setModificationMessage(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={cancelEditing} disabled={sendingProposal}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={sendProposal}
                  disabled={displayItems.length === 0 || sendingProposal}
                  className="gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {sendingProposal ? "Sending..." : "Send proposal via email"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="font-display text-lg font-bold text-primary">{displayTotal}</span>
          </div>
        </div>

        {isAdmin && !editingItems && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Actions</p>
              <div className="flex flex-wrap gap-2">
                <Select value={order.status} onValueChange={(v) => onStatusChange?.(order.id, v)}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Edit className="w-3.5 h-3.5" />
                      <SelectValue placeholder="Change status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Modification">Modification</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={confirmDelete ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleDelete}
                  className="gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {confirmDelete ? "Confirm Delete" : "Delete Order"}
                </Button>
                {confirmDelete && (
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                )}
              </div>

              {whatsappUrl && (
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Send same message on WhatsApp
                  </a>
                </Button>
              )}

              {order.status === "Modification" && order.customerPhone && !whatsappUrl && (
                <p className="text-xs text-muted-foreground">
                  Customer phone on file: {order.customerPhone}. Use &quot;Propose changes&quot; to generate a WhatsApp link after sending.
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
