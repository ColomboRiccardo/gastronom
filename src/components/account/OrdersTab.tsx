"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";
import OrderDetailModal, { type OrderDetail } from "./OrderDetailModal";
import { formatOrderItemsSummary } from "@/lib/orders/format-items-summary";

interface OrdersTabProps {
  initialOrders: OrderDetail[];
}

const statusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800 border-green-200";
    case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const OrdersTab = ({ initialOrders }: OrdersTabProps) => {
  const [orders, setOrders] = useState<OrderDetail[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const openOrder = (order: OrderDetail) => {
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
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm mt-1">
                Your order history will appear here after your first purchase.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      {["Order", "Date", "Items", "Total", "Status", ""].map((h) => (
                        <TableHead key={h} className="font-semibold text-xs uppercase tracking-wider">
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const itemsSummary = formatOrderItemsSummary(order.items);
                      return (
                      <TableRow
                        key={order.id}
                        className="border-border cursor-pointer hover:bg-secondary/30"
                        onClick={() => openOrder(order)}
                      >
                        <TableCell className="font-mono text-sm font-semibold text-primary">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="max-w-[280px]">
                          <p className="text-sm font-medium">{itemsSummary.countLabel}</p>
                          {itemsSummary.preview && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {itemsSummary.preview}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">{order.total}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrder(order);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden space-y-4">
                {orders.map((order) => {
                  const itemsSummary = formatOrderItemsSummary(order.items);
                  return (
                  <div
                    key={order.id}
                    className="border border-border rounded-lg p-4 space-y-2 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => openOrder(order)}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-sm font-semibold text-primary">{order.id}</span>
                      <Badge variant="outline" className={statusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                    <p className="text-sm font-medium">{itemsSummary.countLabel}</p>
                    {itemsSummary.preview && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{itemsSummary.preview}</p>
                    )}
                    <p className="font-semibold">{order.total}</p>
                  </div>
                );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <OrderDetailModal order={selectedOrder} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default OrdersTab;
