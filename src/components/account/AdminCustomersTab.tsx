"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, ArrowUpDown, Search } from "lucide-react";
import CustomerDetailModal, { type CustomerDetail, type CustomerOrder } from "./CustomerDetailModal";
import BulkActionBar from "./BulkActionBar";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Mock order history keyed by customer name                          */
/* ------------------------------------------------------------------ */

const orderHistoryByCustomer: Record<string, CustomerOrder[]> = {
  "Maria Ivanova": [
    { id: "ORD-2025-0041", date: "28 Mar 2025", total: "€78.50", status: "Delivered", items: [{ name: "Stolichnaya Vodka", qty: 1, price: "€28.50" }, { name: "Black Caviar 50g", qty: 1, price: "€50.00" }] },
    { id: "ORD-2025-0037", date: "15 Mar 2025", total: "€34.90", status: "Delivered", items: [{ name: "Kolbasa Moskovskaya", qty: 1, price: "€12.90" }, { name: "Pickled Cucumbers", qty: 2, price: "€7.00" }, { name: "Dried Vobla", qty: 1, price: "€8.00" }] },
    { id: "ORD-2025-0018", date: "02 Feb 2025", total: "€42.00", status: "Delivered", items: [{ name: "Red Caviar 100g", qty: 1, price: "€42.00" }] },
  ],
  "Alexei Petrov": [
    { id: "ORD-2025-0042", date: "04 Apr 2025", total: "€112.00", status: "Processing", items: [{ name: "Beluga Vodka", qty: 1, price: "€38.00" }, { name: "Black Caviar 50g", qty: 1, price: "€50.00" }, { name: "Pelmeni 500g", qty: 2, price: "€12.00" }] },
    { id: "ORD-2025-0034", date: "10 Mar 2025", total: "€55.00", status: "Delivered", items: [{ name: "Beluga Vodka", qty: 1, price: "€55.00" }] },
  ],
  "Igor Smirnov": [
    { id: "ORD-2025-0040", date: "25 Mar 2025", total: "€145.20", status: "Shipped", items: [{ name: "Red Caviar 100g", qty: 2, price: "€42.00" }, { name: "Kolbasa Moskovskaya", qty: 1, price: "€12.90" }, { name: "Pickled Cucumbers", qty: 3, price: "€10.50" }, { name: "Matrioshka Set (5pc)", qty: 1, price: "€45.00" }] },
    { id: "ORD-2025-0033", date: "08 Mar 2025", total: "€89.00", status: "Delivered", items: [{ name: "Black Caviar 50g", qty: 1, price: "€50.00" }, { name: "Dried Vobla", qty: 2, price: "€8.00" }, { name: "Sprats in Oil", qty: 3, price: "€4.90" }] },
  ],
  "Olga Kuznetsova": [
    { id: "ORD-2025-0039", date: "22 Mar 2025", total: "€45.00", status: "Delivered", items: [{ name: "Matrioshka Set (5pc)", qty: 1, price: "€45.00" }] },
  ],
  "Dmitri Volkov": [
    { id: "ORD-2025-0038", date: "20 Mar 2025", total: "€89.90", status: "Delivered", items: [{ name: "Beluga Vodka", qty: 1, price: "€38.00" }, { name: "Red Caviar 100g", qty: 1, price: "€42.00" }, { name: "Sprats in Oil", qty: 2, price: "€4.95" }] },
  ],
  "Natasha Romanova": [
    { id: "ORD-2025-0036", date: "12 Mar 2025", total: "€67.00", status: "Cancelled", items: [{ name: "Black Caviar 50g", qty: 1, price: "€50.00" }, { name: "Pelmeni 500g", qty: 1, price: "€12.00" }, { name: "Sprats in Oil", qty: 1, price: "€5.00" }] },
  ],
  "Pavel Morozov": [
    { id: "ORD-2025-0035", date: "08 Mar 2025", total: "€198.50", status: "Delivered", items: [{ name: "Beluga Vodka", qty: 2, price: "€76.00" }, { name: "Black Caviar 50g", qty: 1, price: "€50.00" }, { name: "Red Caviar 100g", qty: 1, price: "€42.00" }, { name: "Stolichnaya Vodka", qty: 1, price: "€28.50" }] },
    { id: "ORD-2025-0030", date: "22 Feb 2025", total: "€67.50", status: "Delivered", items: [{ name: "Matrioshka Set (5pc)", qty: 1, price: "€45.00" }, { name: "Pickled Cucumbers", qty: 3, price: "€7.50" }] },
  ],
};

/* ------------------------------------------------------------------ */
/*  Customers data                                                     */
/* ------------------------------------------------------------------ */

const initialCustomers: CustomerDetail[] = [
  { id: 1, name: "Maria Ivanova", email: "maria.ivanova@email.com", orders: 12, totalSpent: 854.30, totalSpentDisplay: "€854.30", lastOrder: "2025-03-28", lastOrderDisplay: "28 Mar 2025", status: "Active", phone: "+39 345 678 9012", address: "Via Roma 42, 17025 Loano (SV), Liguria, Italia", paymentMethod: "Visa •••• 4821", recentOrders: ["ORD-2025-0041", "ORD-2025-0037", "ORD-2025-0018"] },
  { id: 2, name: "Alexei Petrov", email: "alexei.petrov@email.com", orders: 8, totalSpent: 623.00, totalSpentDisplay: "€623.00", lastOrder: "2025-04-04", lastOrderDisplay: "04 Apr 2025", status: "Active", phone: "+39 331 234 5678", address: "Corso Italia 15, 16121 Genova (GE), Liguria, Italia", paymentMethod: "Mastercard •••• 7193", recentOrders: ["ORD-2025-0042", "ORD-2025-0034", "ORD-2025-0028"] },
  { id: 3, name: "Igor Smirnov", email: "igor.smirnov@email.com", orders: 15, totalSpent: 1240.50, totalSpentDisplay: "€1,240.50", lastOrder: "2025-03-25", lastOrderDisplay: "25 Mar 2025", status: "Active", phone: "+39 347 890 1234", address: "Via Garibaldi 8, 20121 Milano (MI), Lombardia, Italia", paymentMethod: "PayPal (igor.s@email.com)", recentOrders: ["ORD-2025-0040", "ORD-2025-0033", "ORD-2025-0025"] },
  { id: 4, name: "Olga Kuznetsova", email: "olga.k@email.com", orders: 3, totalSpent: 189.00, totalSpentDisplay: "€189.00", lastOrder: "2025-03-22", lastOrderDisplay: "22 Mar 2025", status: "Active", phone: "+39 320 567 8901", address: "Piazza Duomo 3, 50122 Firenze (FI), Toscana, Italia", paymentMethod: "Visa •••• 3056", recentOrders: ["ORD-2025-0039"] },
  { id: 5, name: "Dmitri Volkov", email: "d.volkov@email.com", orders: 6, totalSpent: 412.80, totalSpentDisplay: "€412.80", lastOrder: "2025-03-20", lastOrderDisplay: "20 Mar 2025", status: "Active", phone: "+39 338 012 3456", address: "Via Nazionale 120, 00184 Roma (RM), Lazio, Italia", paymentMethod: "Mastercard •••• 9284", recentOrders: ["ORD-2025-0038", "ORD-2025-0031"] },
  { id: 6, name: "Natasha Romanova", email: "n.romanova@email.com", orders: 2, totalSpent: 134.00, totalSpentDisplay: "€134.00", lastOrder: "2025-03-12", lastOrderDisplay: "12 Mar 2025", status: "Inactive", phone: "+39 349 345 6789", address: "Via Toledo 55, 80134 Napoli (NA), Campania, Italia", paymentMethod: "Visa •••• 6712", recentOrders: ["ORD-2025-0036"] },
  { id: 7, name: "Pavel Morozov", email: "p.morozov@email.com", orders: 9, totalSpent: 967.50, totalSpentDisplay: "€967.50", lastOrder: "2025-03-08", lastOrderDisplay: "08 Mar 2025", status: "Active", phone: "+39 342 678 9012", address: "Via Mazzini 22, 40124 Bologna (BO), Emilia-Romagna, Italia", paymentMethod: "PayPal (pavel.m@email.com)", recentOrders: ["ORD-2025-0035", "ORD-2025-0030", "ORD-2025-0022"] },
];

type SortKey = "name-asc" | "name-desc" | "orders-desc" | "orders-asc" | "spent-desc" | "spent-asc" | "last-order-desc" | "last-order-asc";

const AdminCustomersTab = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("name-asc");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const results = useMemo(() => {
    let list = [...customers];
    if (statusFilter !== "all") list = list.filter((c) => c.status.toLowerCase() === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    const [key, dir] = sortBy.split(/-(.+)/) as [string, string];
    list.sort((a, b) => {
      let cmp = 0;
      switch (key) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "orders": cmp = a.orders - b.orders; break;
        case "spent": cmp = a.totalSpent - b.totalSpent; break;
        case "last": cmp = a.lastOrder.localeCompare(b.lastOrder); break;
      }
      return dir?.endsWith("desc") ? -cmp : cmp;
    });
    return list;
  }, [customers, statusFilter, sortBy, search]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCustomer = (c: CustomerDetail) => {
    const withOrders: CustomerDetail = {
      ...c,
      orderHistory: orderHistoryByCustomer[c.name] || [],
    };
    setSelectedCustomer(withOrders);
    setModalOpen(true);
  };

  const bulkStatusChange = (newStatus: string) => {
    setCustomers((prev) => prev.map((c) => (selectedIds.has(c.id) ? { ...c, status: newStatus } : c)));
    toast.success(`${selectedIds.size} customers set to ${newStatus}`);
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    setCustomers((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    toast.success(`${selectedIds.size} customers removed`);
    setSelectedIds(new Set());
  };

  const allSelected = results.length > 0 && results.every((c) => selectedIds.has(c.id));

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Customers
              <span className="text-sm font-body font-normal text-muted-foreground ml-2">({results.length} customers)</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger className="w-[200px]">
                  <div className="flex items-center gap-2"><ArrowUpDown className="w-3.5 h-3.5" /><SelectValue placeholder="Sort by" /></div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="orders-desc">Orders (Most)</SelectItem>
                  <SelectItem value="orders-asc">Orders (Least)</SelectItem>
                  <SelectItem value="spent-desc">Spent (High-Low)</SelectItem>
                  <SelectItem value="spent-asc">Spent (Low-High)</SelectItem>
                  <SelectItem value="last-order-desc">Last Order (Recent)</SelectItem>
                  <SelectItem value="last-order-asc">Last Order (Oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BulkActionBar
            selectedCount={selectedIds.size}
            totalCount={results.length}
            onSelectAll={() => setSelectedIds(new Set(results.map((c) => c.id)))}
            onClearSelection={() => setSelectedIds(new Set())}
            statusAction={{
              label: "Set Status",
              options: [
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ],
              onSelect: bulkStatusChange,
            }}
            onBulkDelete={bulkDelete}
          />

          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-medium">No customers found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-10">
                        <Checkbox checked={allSelected} onCheckedChange={() => allSelected ? setSelectedIds(new Set()) : setSelectedIds(new Set(results.map((c) => c.id)))} />
                      </TableHead>
                      {["Customer", "Email", "Orders", "Total Spent", "Last Order", "Status", ""].map((h) => (
                        <TableHead key={h} className="font-semibold text-xs uppercase tracking-wider">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((c) => (
                      <TableRow key={c.id} className="border-border cursor-pointer hover:bg-secondary/30" onClick={() => openCustomer(c)}>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={selectedIds.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} />
                        </TableCell>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{c.email}</TableCell>
                        <TableCell>{c.orders}</TableCell>
                        <TableCell className="font-semibold">{c.totalSpentDisplay}</TableCell>
                        <TableCell className="text-muted-foreground">{c.lastOrderDisplay}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={c.status === "Active" ? "bg-green-100 text-green-800 border-green-200" : "bg-muted text-muted-foreground"}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={(e) => { e.stopPropagation(); openCustomer(c); }}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-4">
                {results.map((c) => (
                  <div key={c.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={selectedIds.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} className="mt-1" />
                      <div className="flex-1 cursor-pointer" onClick={() => openCustomer(c)}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.email}</p>
                          </div>
                          <Badge variant="outline" className={c.status === "Active" ? "bg-green-100 text-green-800 border-green-200" : "bg-muted text-muted-foreground"}>
                            {c.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-muted-foreground">{c.orders} orders</span>
                          <span className="font-semibold">{c.totalSpentDisplay}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <CustomerDetailModal
        customer={selectedCustomer}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onEditCustomer={(id) => toast.info(`Edit customer #${id}`)}
        onCloseAccount={(id) => {
          setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, status: "Inactive" } : c));
          toast.success("Account closed");
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default AdminCustomersTab;
