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
import { useLanguage } from "@/context/LanguageContext";
import { formatDateTime } from "@/lib/i18n/format";
import { translateOrderStatus } from "@/lib/i18n/status";

const COLLAPSED_COUNT = 6;

interface AdminDashboardTabProps {
  data: AdminDashboardData;
}

const AdminDashboardTab = ({ data }: AdminDashboardTabProps) => {
  const { t } = useLanguage();
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);

  const { stats, recentActivity, topProducts, orders } = data;

  const formatChange = (percent: number | null) => {
    if (percent === null) {
      return { label: t("dashboard.no_prior_data"), up: true, isNew: true };
    }
    const up = percent >= 0;
    return { label: `${up ? "+" : ""}${percent.toFixed(1)}%`, up, isNew: false };
  };

  const statCards = [
    {
      label: t("dashboard.revenue_this_month"),
      value: formatDashboardCurrency(stats.revenueThisMonth),
      change: formatChange(stats.revenueChangePercent),
      icon: DollarSign,
      subtitle: t("dashboard.vs_last_month"),
    },
    {
      label: t("dashboard.orders_this_month"),
      value: String(stats.ordersThisMonth),
      change: formatChange(stats.ordersChangePercent),
      icon: ShoppingCart,
      subtitle: t("dashboard.vs_last_month"),
    },
    {
      label: t("dashboard.active_customers"),
      value: String(stats.activeCustomers),
      change: formatChange(stats.customersChangePercent),
      icon: Users,
      subtitle: t("dashboard.last_30_days"),
    },
    {
      label: t("dashboard.avg_order_value"),
      value: formatDashboardCurrency(stats.avgOrderValue),
      change: formatChange(stats.avgOrderChangePercent),
      icon: TrendingUp,
      subtitle: t("dashboard.this_month_vs_last"),
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
            <CardTitle className="font-display text-xl">{t("dashboard.recent_activity")}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.no_recent_activity")}</p>
            ) : (
              <>
                <div className="space-y-4">
                  {visibleActivity.map((item, i) => {
                    const params =
                      item.type === "status"
                        ? { ...item.params, status: translateOrderStatus(String(item.params.status), t) }
                        : item.params;
                    return (
                      <div key={`${item.type}-${item.messageKey}-${i}`} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div>
                          <p className="text-sm text-foreground">{t(item.messageKey, params)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.at ? formatDateTime(item.at) : t("activity.current_inventory")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
                        <ChevronUp className="w-4 h-4" /> {t("dashboard.show_less")}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />{" "}
                        {t("dashboard.show_all", { count: recentActivity.length })}
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
            <CardTitle className="font-display text-xl">{t("dashboard.top_products")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.no_sales_data")}</p>
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
                        <p className="text-xs text-muted-foreground">
                          {t("dashboard.sold", { count: product.sold })}
                        </p>
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
                        <ChevronUp className="w-4 h-4" /> {t("dashboard.show_less")}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />{" "}
                        {t("dashboard.show_all", { count: topProducts.length })}
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
