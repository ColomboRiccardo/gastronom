"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, ArrowUpDown, Search } from "lucide-react";
import OrderDetailModal, { type OrderDetail, type OrderItem } from "./OrderDetailModal";
import BulkActionBar from "./BulkActionBar";
import { toast } from "sonner";
import {
  deleteOrder,
  proposeOrderModification,
  resolveOrderModification,
  updateOrderStatus,
} from "@/lib/orders";
import { useLanguage } from "@/context/LanguageContext";
import { translateOrderStatus } from "@/lib/i18n/status";

interface AdminOrdersTabProps {
  initialOrders: OrderDetail[];
}

const statusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800 border-green-200";
    case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Modification": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-muted text-muted-foreground";
  }
};

type SortKey = "date-desc" | "date-asc" | "customer-asc" | "customer-desc" | "total-desc" | "total-asc" | "id-asc" | "id-desc";

const parseTotal = (t: string) => parseFloat(t.replace("€", ""));

/** Falls back to the order number when no timestamp came through. */
const sortableDate = (order: OrderDetail) =>
  order.createdAt ? new Date(order.createdAt).getTime() : 0;

const AdminOrdersTab = ({ initialOrders }: AdminOrdersTabProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<OrderDetail[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("date-desc");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const results = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "all") list = list.filter((o) => o.status.toLowerCase() === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || (o.customer?.toLowerCase().includes(q) ?? false));
    }
    const [key, dir] = sortBy.split("-") as [string, string];
    list.sort((a, b) => {
      let cmp = 0;
      switch (key) {
        case "date": cmp = sortableDate(a) - sortableDate(b); break;
        case "customer": cmp = (a.customer ?? "").localeCompare(b.customer ?? ""); break;
        case "total": cmp = parseTotal(a.total) - parseTotal(b.total); break;
        case "id": cmp = a.id.localeCompare(b.id); break;
      }
      return dir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [orders, statusFilter, sortBy, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openOrder = (order: OrderDetail) => { setSelectedOrder(order); setModalOpen(true); };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const ok = await updateOrderStatus(orderId, newStatus);
    if (ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      setSelectedOrder((prev) => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
      toast.success(
        t("orders.toast_status_set", {
          id: orderId,
          status: translateOrderStatus(newStatus, t),
        }),
      );
      router.refresh();
    } else {
      toast.error(t("orders.toast_status_failed", { id: orderId }));
    }
  };

  const handleDelete = async (orderId: string) => {
    const ok = await deleteOrder(orderId);
    if (ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success(t("orders.toast_deleted", { id: orderId }));
      router.refresh();
    } else {
      toast.error(t("orders.toast_delete_failed", { id: orderId }));
    }
  };

  const handleProposeModification = async (
    orderId: string,
    items: OrderItem[],
    message: string,
  ) => {
    const result = await proposeOrderModification(orderId, items, message);
    if (result.ok) {
      // The order keeps its paid items and total; only the pending proposal changes.
      const pending = {
        status: "Modification",
        modificationProposal: items,
        modificationMessage: message || undefined,
        modificationSentAt: new Date().toISOString(),
        modificationState: "pending" as const,
      };
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...pending } : o)));
      setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, ...pending } : prev));
      toast.success(t("orders.toast_proposal_sent", { id: orderId }));
      router.refresh();
      return { ok: true, whatsappUrl: result.whatsappUrl };
    }

    toast.error(result.error || t("orders.toast_proposal_failed", { id: orderId }));
    return { ok: false, error: result.error };
  };

  const handleResolveModification = async (orderId: string, action: "accept" | "decline") => {
    const ok = await resolveOrderModification(orderId, action);
    if (!ok) {
      toast.error(t("orders.toast_resolve_failed", { id: orderId }));
      return false;
    }

    toast.success(
      action === "accept"
        ? t("orders.toast_proposal_accepted", { id: orderId })
        : t("orders.toast_proposal_declined", { id: orderId }),
    );
    // The server rewrote items and total together, so re-read rather than guess.
    setModalOpen(false);
    setSelectedOrder(null);
    router.refresh();
    return true;
  };

  const bulkStatusChange = async (newStatus: string) => {
    const ids = Array.from(selectedIds);
    for (const id of ids) await updateOrderStatus(id, newStatus);
    setOrders((prev) => prev.map((o) => (selectedIds.has(o.id) ? { ...o, status: newStatus } : o)));
    toast.success(
      t("orders.toast_bulk_status", {
        count: selectedIds.size,
        status: translateOrderStatus(newStatus, t),
      }),
    );
    setSelectedIds(new Set());
    router.refresh();
  };

  const bulkDelete = async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) await deleteOrder(id);
    setOrders((prev) => prev.filter((o) => !selectedIds.has(o.id)));
    toast.success(t("orders.toast_bulk_deleted", { count: selectedIds.size }));
    setSelectedIds(new Set());
    router.refresh();
  };

  const allSelected = results.length > 0 && results.every((o) => selectedIds.has(o.id));

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              {t("account.all_orders")}
              <span className="text-sm font-body font-normal text-muted-foreground ml-2">
                ({t("products.results", { count: results.length })})
              </span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder={t("orders.search_placeholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder={t("orders.status_filter")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("orders.all_statuses")}</SelectItem>
                  <SelectItem value="received">{t("status.received")}</SelectItem>
                  <SelectItem value="processing">{t("status.processing")}</SelectItem>
                  <SelectItem value="modification">{t("status.modification")}</SelectItem>
                  <SelectItem value="shipped">{t("status.shipped")}</SelectItem>
                  <SelectItem value="delivered">{t("status.delivered")}</SelectItem>
                  <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger className="w-[200px]">
                  <div className="flex items-center gap-2"><ArrowUpDown className="w-3.5 h-3.5" /><SelectValue placeholder={t("orders.sort_by")} /></div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">{t("orders.sort_date_newest")}</SelectItem>
                  <SelectItem value="date-asc">{t("orders.sort_date_oldest")}</SelectItem>
                  <SelectItem value="customer-asc">{t("orders.sort_customer_asc")}</SelectItem>
                  <SelectItem value="customer-desc">{t("orders.sort_customer_desc")}</SelectItem>
                  <SelectItem value="total-desc">{t("orders.sort_amount_high")}</SelectItem>
                  <SelectItem value="total-asc">{t("orders.sort_amount_low")}</SelectItem>
                  <SelectItem value="id-asc">{t("orders.sort_id_asc")}</SelectItem>
                  <SelectItem value="id-desc">{t("orders.sort_id_desc")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BulkActionBar
              selectedCount={selectedIds.size}
              totalCount={results.length}
              onSelectAll={() => setSelectedIds(new Set(results.map((o) => o.id)))}
              onClearSelection={() => setSelectedIds(new Set())}
              statusAction={{
                label: t("orders.set_status"),
                options: ["Processing", "Modification", "Shipped", "Delivered", "Cancelled"].map(
                  (value) => ({ value, label: translateOrderStatus(value, t) }),
                ),
                onSelect: bulkStatusChange,
              }}
              onBulkDelete={bulkDelete}
            />

            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="font-medium">{t("orders.no_results")}</p>
                <p className="text-sm mt-1">{t("orders.no_results_hint")}</p>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="w-10">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => allSelected ? setSelectedIds(new Set()) : setSelectedIds(new Set(results.map((o) => o.id)))}
                          />
                        </TableHead>
                        {[
                          t("orders.order"),
                          t("orders.date"),
                          t("orders.customer"),
                          t("orders.items"),
                          t("orders.total"),
                          t("orders.status"),
                          "",
                        ].map((h, i) => (
                          <TableHead key={h || `col-${i}`} className="font-semibold text-xs uppercase tracking-wider">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((order) => (
                        <TableRow key={order.id} className="border-border cursor-pointer hover:bg-secondary/30" onClick={() => openOrder(order)}>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={selectedIds.has(order.id)} onCheckedChange={() => toggleSelect(order.id)} />
                          </TableCell>
                          <TableCell className="font-mono text-sm font-semibold text-primary">{order.id}</TableCell>
                          <TableCell className="text-muted-foreground">{order.date}</TableCell>
                          <TableCell className="font-medium">{order.customer}</TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell className="font-semibold">{order.total}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColor(order.status)}>{translateOrderStatus(order.status, t)}</Badge></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={(e) => { e.stopPropagation(); openOrder(order); }}>{t("orders.view")}</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="md:hidden space-y-4">
                  {results.map((order) => (
                    <div key={order.id} className="border border-border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <Checkbox checked={selectedIds.has(order.id)} onCheckedChange={() => toggleSelect(order.id)} className="mt-1" />
                        <div className="flex-1 cursor-pointer" onClick={() => openOrder(order)}>
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-sm font-semibold text-primary">{order.id}</span>
                            <Badge variant="outline" className={statusColor(order.status)}>{translateOrderStatus(order.status, t)}</Badge>
                          </div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{order.date}</span>
                            <span>{t("orders.items_count", { count: order.items.length })}</span>
                          </div>
                          <p className="font-semibold">{order.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
        </CardContent>
      </Card>

      <OrderDetailModal
        order={selectedOrder}
        open={modalOpen}
        onOpenChange={setModalOpen}
        isAdmin
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onProposeModification={handleProposeModification}
        onResolveModification={handleResolveModification}
      />
    </>
  );
};

export default AdminOrdersTab;
