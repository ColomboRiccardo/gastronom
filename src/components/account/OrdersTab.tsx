"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";
import OrderDetailModal, { type OrderDetail } from "./OrderDetailModal";

const mockOrders = [
  {
    id: "ORD-2025-0041",
    date: "28 Mar 2025",
    items: [
      { name: "Stolichnaya Vodka", qty: 1, price: "€28.50" },
      { name: "Black Caviar 50g", qty: 1, price: "€50.00" },
    ],
    total: "€78.50",
    status: "Delivered",
    paymentMethod: "Visa •••• 4821",
    shippingAddress: "ul. Tverskaya 12, Moscow",
  },
  {
    id: "ORD-2025-0037",
    date: "15 Mar 2025",
    items: [
      { name: "Kolbasa Moskovskaya", qty: 1, price: "€12.90" },
      { name: "Pickled Cucumbers", qty: 2, price: "€7.00" },
      { name: "Dried Vobla", qty: 1, price: "€8.00" },
    ],
    total: "€34.90",
    status: "Delivered",
    paymentMethod: "PayPal",
    shippingAddress: "ul. Tverskaya 12, Moscow",
  },
  {
    id: "ORD-2025-0029",
    date: "02 Mar 2025",
    items: [{ name: "Matrioshka Set (5pc)", qty: 1, price: "€45.00" }],
    total: "€45.00",
    status: "Shipped",
    paymentMethod: "Visa •••• 4821",
    shippingAddress: "ul. Tverskaya 12, Moscow",
  },
  {
    id: "ORD-2025-0018",
    date: "14 Feb 2025",
    items: [
      { name: "Red Caviar 100g", qty: 1, price: "€42.00" },
      { name: "Beluga Vodka", qty: 1, price: "€38.00" },
      { name: "Sprats in Oil", qty: 2, price: "€6.00" },
    ],
    total: "€92.00",
    status: "Delivered",
    paymentMethod: "Mastercard •••• 9102",
    shippingAddress: "ul. Tverskaya 12, Moscow",
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800 border-green-200";
    case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const OrdersTab = () => {
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openOrder = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  {["Order", "Date", "Items", "Total", "Status", ""].map((h) => (
                    <TableHead key={h} className="font-semibold text-xs uppercase tracking-wider">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id} className="border-border cursor-pointer hover:bg-secondary/30" onClick={() => openOrder(order)}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell className="max-w-[200px]"><span className="text-sm">{order.items.map(i => i.name).join(", ")}</span></TableCell>
                    <TableCell className="font-semibold">{order.total}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(order.status)}>{order.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={(e) => { e.stopPropagation(); openOrder(order); }}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="border border-border rounded-lg p-4 space-y-2 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => openOrder(order)}>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-sm font-semibold text-primary">{order.id}</span>
                  <Badge variant="outline" className={statusColor(order.status)}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.date}</p>
                <p className="text-sm">{order.items.map(i => i.name).join(", ")}</p>
                <p className="font-semibold">{order.total}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <OrderDetailModal
        order={selectedOrder}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default OrdersTab;
