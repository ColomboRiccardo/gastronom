"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DashboardChart from "./DashboardChart";
import { formatDashboardCurrency } from "@/lib/orders/dashboard-metrics";
import { type AdminDashboardData } from "@/lib/orders/dashboard-types";

const COLLAPSED_COUNT = 6;

function formatChange(percent: number | null): { label: string; up: boolean; isNew: boolean } {
  if (percent === null) {
    return { label: "No prior data", up: true, isNew: true };
  }
  const up = percent >= 0;
  return {
    label: `${up ? "+" : ""}${percent.toFixed(1)}%`,
    up,
    isNew: false,
  };
}

interface AdminDashboardTabProps {
  data: AdminDashboardData;
}

const AdminDashboardTab = ({ data }: AdminDashboardTabProps) => {
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);

  const { stats, recentActivity, topProducts, orders } = data;

  const statCards = [
    {
      label: "Revenue This Month",
      value: formatDashboardCurrency(stats.revenueThisMonth),
      change: formatChange(stats.revenueChangePercent),
      icon: DollarSign,
      subtitle: "vs last month",
    },
    {
      label: "Orders This Month",
      value: String(stats.ordersThisMonth),
      change: formatChange(stats.ordersChangePercent),
      icon: ShoppingCart,
      subtitle: "vs last month",
    },
    {
      label: "Active Customers",
      value: String(stats.activeCustomers),
      change: formatChange(stats.customersChangePercent),
      icon: Users,
      subtitle: "last 30 days vs prior 30",
    },
    {
      label: "Avg. Order Value",
      value: formatDashboardCurrency(stats.avgOrderValue),
      change: formatChange(stats.avgOrderChangePercent),
      icon: TrendingUp,
      subtitle: "this month vs last",
    },
  ];

  const visibleActivity = activityExpanded
    ? recentActivity
    : recentActivity.slice(0, COLLAPSED_COUNT);
  const visibleProducts = productsExpanded
    ? topProducts
    : topProducts.slice(0, COLLAPSED_COUNT);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <DashboardChart orders={orders} defaultMetric="revenue" />
        <DashboardChart orders={orders} defaultMetric="orders" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {stat.label}
                </span>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <div
                className={`flex items-center gap-1 text-xs mt-1 ${
                  stat.change.isNew
                    ? "text-muted-foreground"
                    : stat.change.up
                      ? "text-green-600"
                      : "text-red-500"
                }`}
              >
                {!stat.change.isNew &&
                  (stat.change.up ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  ))}
                {stat.change.label} {stat.subtitle}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity yet.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {visibleActivity.map((item, i) => (
                    <div key={`${item.type}-${item.event}-${i}`} className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <p className="text-sm text-foreground">{item.event}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.timeLabel}</p>
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
                    {activityExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> Show All ({recentActivity.length})
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales data yet.</p>
            ) : (
              <>
                <div className="space-y-3">
                  {visibleProducts.map((product, i) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-foreground truncate">
                          {product.name}
                        </span>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-semibold">
                          {formatDashboardCurrency(product.revenue)}
                        </p>
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
                    {productsExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> Show All ({topProducts.length})
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardTab;
