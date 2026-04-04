"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from "lucide-react";
import DashboardChart from "./DashboardChart";

const stats = [
  { label: "Total Revenue", value: "€12,450", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Orders This Month", value: "156", change: "+8.2%", up: true, icon: ShoppingCart },
  { label: "Active Customers", value: "89", change: "+3.1%", up: true, icon: Users },
  { label: "Avg. Order Value", value: "€79.80", change: "-2.4%", up: false, icon: TrendingUp },
];

const recentActivity = [
  { time: "2 min ago", event: "New order #ORD-2025-0042 placed by Alexei Petrov", type: "order" },
  { time: "15 min ago", event: "Order #ORD-2025-0041 marked as Delivered", type: "status" },
  { time: "1 hr ago", event: "Product 'Beluga Vodka' stock updated to 24 units", type: "stock" },
  { time: "3 hrs ago", event: "New customer registration: Olga Kuznetsova", type: "customer" },
  { time: "5 hrs ago", event: "Order #ORD-2025-0040 shipped via DHL Express", type: "status" },
  { time: "6 hrs ago", event: "Product 'Red Caviar 100g' low stock alert (12 remaining)", type: "stock" },
  { time: "8 hrs ago", event: "Order #ORD-2025-0039 marked as Delivered", type: "status" },
  { time: "10 hrs ago", event: "New order #ORD-2025-0039 placed by Olga Kuznetsova", type: "order" },
  { time: "12 hrs ago", event: "Bulk price update applied to Vodka & Spirits category", type: "stock" },
  { time: "1 day ago", event: "Order #ORD-2025-0038 marked as Delivered", type: "status" },
  { time: "1 day ago", event: "New customer registration: Dmitri Volkov", type: "customer" },
  { time: "2 days ago", event: "Product 'Matrioshka Set' restocked (+30 units)", type: "stock" },
];

const topProducts = [
  { name: "Stolichnaya Vodka", sold: 42, revenue: "€1,260" },
  { name: "Red Caviar 100g", sold: 31, revenue: "€1,395" },
  { name: "Kolbasa Moskovskaya", sold: 28, revenue: "€392" },
  { name: "Matrioshka Set (5pc)", sold: 19, revenue: "€855" },
  { name: "Black Caviar 50g", sold: 15, revenue: "€1,275" },
  { name: "Beluga Vodka", sold: 14, revenue: "€770" },
  { name: "Pickled Cucumbers", sold: 52, revenue: "€338" },
  { name: "Dried Vobla", sold: 38, revenue: "€323" },
  { name: "Sprats in Oil", sold: 45, revenue: "€220" },
  { name: "Pelmeni (frozen)", sold: 33, revenue: "€396" },
];

const COLLAPSED_COUNT = 6;

const AdminDashboardTab = () => {
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);

  const visibleActivity = activityExpanded ? recentActivity : recentActivity.slice(0, COLLAPSED_COUNT);
  const visibleProducts = productsExpanded ? topProducts : topProducts.slice(0, COLLAPSED_COUNT);

  return (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <DashboardChart defaultMetric="revenue" />
        <DashboardChart defaultMetric="orders" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <div className={`flex items-center gap-1 text-xs mt-1 ${stat.up ? "text-green-600" : "text-red-500"}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visibleActivity.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {recentActivity.length > COLLAPSED_COUNT && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-primary hover:text-primary gap-1"
                onClick={() => setActivityExpanded(!activityExpanded)}
              >
                {activityExpanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All ({recentActivity.length})</>}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visibleProducts.map((product, i) => (
                <div key={product.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{product.revenue}</p>
                    <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
            {topProducts.length > COLLAPSED_COUNT && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-primary hover:text-primary gap-1"
                onClick={() => setProductsExpanded(!productsExpanded)}
              >
                {productsExpanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All ({topProducts.length})</>}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardTab;
