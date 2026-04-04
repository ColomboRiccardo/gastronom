"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  CreditCard,
  Mail,
  Phone,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  X,
  Pencil,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CustomerOrder {
  id: string;
  date: string;
  total: string;
  status: string;
  items: { name: string; qty: number; price: string }[];
}

export interface CustomerDetail {
  id: number;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  totalSpentDisplay: string;
  lastOrder: string;
  lastOrderDisplay: string;
  status: string;
  phone: string;
  address: string;
  paymentMethod: string;
  recentOrders: string[];
  orderHistory?: CustomerOrder[];
}

interface Props {
  customer: CustomerDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditCustomer?: (id: number) => void;
  onCloseAccount?: (id: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Mini Status Pipeline for order rows                                */
/* ------------------------------------------------------------------ */

const STATUSES = ["Received", "Processing", "Shipped", "Delivered"] as const;

const statusMeta: Record<string, { icon: React.ElementType; color: string }> = {
  Received: { icon: Clock, color: "text-muted-foreground" },
  Processing: { icon: Package, color: "text-yellow-600" },
  Shipped: { icon: Truck, color: "text-blue-600" },
  Delivered: { icon: CheckCircle2, color: "text-green-600" },
  Cancelled: { icon: X, color: "text-destructive" },
};

function MiniStatusPipeline({ current }: { current: string }) {
  if (current === "Cancelled") {
    return (
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="w-3 h-3 text-destructive" />
        <span className="text-xs font-medium text-destructive">Cancelled</span>
      </div>
    );
  }

  const activeIdx = STATUSES.indexOf(current as (typeof STATUSES)[number]);

  return (
    <div className="flex items-center gap-0.5">
      {STATUSES.map((s, i) => {
        const reached = i <= activeIdx;
        const meta = statusMeta[s];
        const Icon = meta.icon;
        return (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center",
                reached ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}
              title={s}
            >
              <Icon className="w-2.5 h-2.5" />
            </div>
            {i < STATUSES.length - 1 && (
              <div className={cn("w-3 h-0.5", i < activeIdx ? "bg-primary" : "bg-border")} />
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
    case "Active": return "bg-green-100 text-green-800 border-green-200";
    case "Inactive": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground";
  }
};

const orderStatusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800 border-green-200";
    case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-muted text-muted-foreground";
  }
};

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

const CustomerDetailModal = ({ customer, open, onOpenChange, onEditCustomer, onCloseAccount }: Props) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  if (!customer) return null;

  const toggleOrder = (id: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const orders = customer.orderHistory || [];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setExpandedOrders(new Set());
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-3">
            {customer.name}
            <Badge variant="outline" className={statusColor(customer.status)}>
              {customer.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">{customer.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="font-medium">{customer.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Payment</p>
              <p className="font-medium">{customer.paymentMethod}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShoppingBag className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Lifetime</p>
              <p className="font-medium">{customer.orders} orders · {customer.totalSpentDisplay}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order History */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Order History ({orders.length})
          </p>

          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No order data available</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                return (
                  <div key={order.id} className="border border-border rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary/30 transition-colors text-left"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-primary font-semibold">{order.id}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{order.date}</span>
                        <MiniStatusPipeline current={order.status} />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-semibold">{order.total}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border bg-secondary/20 px-3 py-2 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{order.date}</span>
                          <Badge variant="outline" className={cn("text-[10px] py-0", orderStatusColor(order.status))}>
                            {order.status}
                          </Badge>
                        </div>
                        {order.items.map((item, j) => (
                          <div key={j} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Package className="w-3 h-3 text-muted-foreground shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-xs">
                              <span className="text-muted-foreground">x{item.qty}</span>
                              <span className="font-semibold">{item.price}</span>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-1 border-t border-border text-sm">
                          <span className="font-medium">Total</span>
                          <span className="font-semibold text-primary">{order.total}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => onEditCustomer?.(customer.id)}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Customer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onCloseAccount?.(customer.id)}
          >
            <Ban className="w-3.5 h-3.5" />
            Close Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
