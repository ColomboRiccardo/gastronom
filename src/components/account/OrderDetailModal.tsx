"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared types                                                       */
/* ------------------------------------------------------------------ */

export interface OrderItem {
  name: string;
  qty: number;
  price: string;
}

export interface OrderDetail {
  id: string;
  date: string;
  customer?: string;
  items: OrderItem[];
  total: string;
  status: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

interface Props {
  order: OrderDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  onStatusChange?: (orderId: string, newStatus: string) => void;
  onDelete?: (orderId: string) => void;
  onItemsChange?: (orderId: string, items: OrderItem[], newTotal: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Available products for adding                                      */
/* ------------------------------------------------------------------ */

const AVAILABLE_PRODUCTS = [
  { name: "Beluga Noble Vodka", price: 38.9 },
  { name: "Stolichnaya Vodka", price: 18.9 },
  { name: "Zubrowka Bison Grass", price: 22.5 },
  { name: "Nemiroff Honey Pepper", price: 16.9 },
  { name: "Red Salmon Caviar", price: 24.5 },
  { name: "Black Sturgeon Caviar", price: 89.0 },
  { name: "Pike Roe Spread", price: 8.9 },
  { name: "Pickled Cucumbers", price: 4.9 },
  { name: "Sauerkraut", price: 3.9 },
  { name: "Pickled Tomatoes", price: 5.5 },
  { name: "Marinated Mushrooms", price: 7.9 },
  { name: "Doctor's Kolbasa", price: 7.5 },
  { name: "Salo with Garlic", price: 6.5 },
  { name: "Moskovskaya Kolbasa", price: 9.9 },
  { name: "Hunting Sausages", price: 5.9 },
  { name: "Vobla Dried Fish", price: 9.9 },
  { name: "Dried Squid Strips", price: 4.5 },
  { name: "Smoked Sprats", price: 3.9 },
  { name: "Matryoshka Set", price: 29.0 },
  { name: "Zhostovo Tray", price: 45.0 },
];

/* ------------------------------------------------------------------ */
/*  Status pipeline                                                    */
/* ------------------------------------------------------------------ */

const STATUSES = ["Received", "Processing", "Shipped", "Delivered"] as const;

const statusMeta: Record<string, { icon: React.ElementType; color: string }> = {
  Received: { icon: Clock, color: "text-muted-foreground" },
  Processing: { icon: Package, color: "text-yellow-600" },
  Shipped: { icon: Truck, color: "text-blue-600" },
  Delivered: { icon: CheckCircle2, color: "text-green-600" },
  Cancelled: { icon: X, color: "text-destructive" },
};

function StatusPipeline({ current }: { current: string }) {
  const isCancelled = current === "Cancelled";
  const activeIdx = STATUSES.indexOf(current as (typeof STATUSES)[number]);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-3 px-2 rounded-lg bg-destructive/5 border border-destructive/20">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-sm font-semibold text-destructive">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full gap-0">
      {STATUSES.map((s, i) => {
        const reached = i <= activeIdx;
        const meta = statusMeta[s];
        const Icon = meta.icon;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                  reached
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={cn("text-[10px] font-medium whitespace-nowrap", reached ? "text-foreground" : "text-muted-foreground")}>
                {s}
              </span>
            </div>
            {i < STATUSES.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-1 mt-[-18px]", i < activeIdx ? "bg-primary" : "bg-border")} />
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

function AddProductPopover({ onAdd }: { onAdd: (name: string, price: number) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return AVAILABLE_PRODUCTS;
    const q = search.toLowerCase();
    return AVAILABLE_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
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
                key={p.name}
                className="w-full flex justify-between items-center px-2 py-1.5 text-sm rounded-md hover:bg-secondary/60 transition-colors text-left"
                onClick={() => {
                  onAdd(p.name, p.price);
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
  onItemsChange,
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingItems, setEditingItems] = useState(false);
  const [localItems, setLocalItems] = useState<OrderItem[]>([]);

  if (!order) return null;

  const displayItems = editingItems ? localItems : order.items;
  const displayTotal = editingItems ? calcTotal(localItems) : order.total;

  const startEditing = () => {
    setLocalItems([...order.items]);
    setEditingItems(true);
  };

  const cancelEditing = () => {
    setEditingItems(false);
    setLocalItems([]);
  };

  const saveEditing = () => {
    const newTotal = calcTotal(localItems);
    onItemsChange?.(order.id, localItems, newTotal);
    setEditingItems(false);
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
  };

  const addProduct = (name: string, price: number) => {
    setLocalItems((prev) => {
      const existing = prev.findIndex((it) => it.name === name);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + 1 };
        return next;
      }
      return [...prev, { name, qty: 1, price: formatPrice(price) }];
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
        }
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-3">
            <span className="font-mono text-primary">{order.id}</span>
            <Badge variant="outline" className={statusColor(order.status)}>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Status pipeline */}
        <div className="py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Order Progress</p>
          <StatusPipeline current={order.status} />
        </div>

        <Separator />

        {/* Order info */}
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

        {/* Items list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Items {editingItems && <span className="text-primary ml-1">(Editing)</span>}
            </p>
            {isAdmin && !editingItems && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary" onClick={startEditing}>
                <Edit className="w-3 h-3" />
                Edit Items
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {displayItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No items in this order</p>
            ) : (
              displayItems.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="flex justify-between items-center py-2 px-3 rounded-md bg-secondary/40 border border-border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm shrink-0">
                    {editingItems ? (
                      <>
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

          {/* Add product button when editing */}
          {editingItems && (
            <div className="mt-2">
              <AddProductPopover onAdd={addProduct} />
            </div>
          )}

          {/* Edit actions */}
          {editingItems && (
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="ghost" size="sm" onClick={cancelEditing}>Cancel</Button>
              <Button size="sm" onClick={saveEditing} disabled={displayItems.length === 0}>
                Save Changes
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="font-display text-lg font-bold text-primary">{displayTotal}</span>
          </div>
        </div>

        {/* Admin actions */}
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
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
