import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import {
  type AdminDashboardData,
  type DashboardActivityItem,
  type DashboardChartPoint,
  type DashboardGranularity,
  type DashboardMetric,
  type DashboardOrderRow,
  type DashboardStats,
  type DashboardTopProduct,
} from "./dashboard-types";

const EUR = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function formatDashboardCurrency(value: number): string {
  return EUR.format(value);
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function ordersInRange(orders: DashboardOrderRow[], start: Date, end: Date) {
  return orders.filter((order) =>
    isWithinInterval(new Date(order.createdAt), { start, end }),
  );
}

function distinctCustomers(orders: DashboardOrderRow[]): number {
  return new Set(orders.map((order) => order.userId)).size;
}

export function computeDashboardStats(orders: DashboardOrderRow[]): DashboardStats {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const last30Start = subDays(now, 30);
  const prev30Start = subDays(now, 60);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const thisMonthOrders = ordersInRange(orders, thisMonthStart, thisMonthEnd);
  const lastMonthOrders = ordersInRange(orders, lastMonthStart, lastMonthEnd);

  const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total, 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);

  const recentOrders = ordersInRange(orders, last30Start, now);
  const previousOrders = ordersInRange(orders, prev30Start, last30Start);

  const avgOrderValue =
    thisMonthOrders.length > 0 ? thisMonthRevenue / thisMonthOrders.length : 0;
  const lastAvgOrderValue =
    lastMonthOrders.length > 0 ? lastMonthRevenue / lastMonthOrders.length : 0;

  return {
    totalRevenue,
    revenueThisMonth: thisMonthRevenue,
    revenueChangePercent: percentChange(thisMonthRevenue, lastMonthRevenue),
    ordersThisMonth: thisMonthOrders.length,
    ordersChangePercent: percentChange(thisMonthOrders.length, lastMonthOrders.length),
    activeCustomers: distinctCustomers(recentOrders),
    customersChangePercent: percentChange(
      distinctCustomers(recentOrders),
      distinctCustomers(previousOrders),
    ),
    avgOrderValue,
    avgOrderChangePercent: percentChange(avgOrderValue, lastAvgOrderValue),
  };
}

export function computeTopProducts(orders: DashboardOrderRow[]): DashboardTopProduct[] {
  const totals = new Map<string, { sold: number; revenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const current = totals.get(item.name) ?? { sold: 0, revenue: 0 };
      current.sold += item.qty;
      current.revenue += item.qty * item.unitPrice;
      totals.set(item.name, current);
    }
  }

  return Array.from(totals.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue || b.sold - a.sold);
}

/**
 * Activity rows carry a dictionary key and its values rather than a finished
 * sentence, so the browser can render them in the reader's language.
 */
export function buildRecentActivity(
  orders: DashboardOrderRow[],
  lowStockProducts: { name: string; stock: number; status: string }[],
  recentCustomers: { name: string; createdAt: string }[],
): DashboardActivityItem[] {
  const items: DashboardActivityItem[] = [];

  for (const order of orders.slice(0, 20)) {
    items.push({
      at: order.createdAt,
      messageKey: "activity.new_order",
      params: { id: `ORD-${order.id}`, customer: order.customerName },
      type: "order",
    });

    if (order.status !== "Received") {
      items.push({
        at: order.createdAt,
        messageKey: "activity.order_status",
        params: { id: `ORD-${order.id}`, status: order.status },
        type: "status",
      });
    }
  }

  for (const customer of recentCustomers) {
    items.push({
      at: customer.createdAt,
      messageKey: "activity.new_customer",
      params: { name: customer.name },
      type: "customer",
    });
  }

  const sorted = items
    .sort((a, b) => new Date(b.at ?? 0).getTime() - new Date(a.at ?? 0).getTime())
    .slice(0, 16);

  const stockItems: DashboardActivityItem[] = lowStockProducts.slice(0, 4).map((product) => ({
    at: null,
    messageKey:
      product.status === "Out of Stock" ? "activity.out_of_stock" : "activity.low_stock",
    params: { name: product.name, stock: product.stock },
    type: "stock" as const,
  }));

  return [...sorted, ...stockItems].slice(0, 20);
}

/** Numeric labels so the axis reads the same in every language. */
function bucketLabel(date: Date, granularity: DashboardGranularity): string {
  switch (granularity) {
    case "day":
      return format(date, "dd/MM");
    case "week":
      return format(date, "dd/MM");
    case "month":
      return format(date, "MM/yyyy");
    case "year":
      return format(date, "yyyy");
  }
}

function createBuckets(granularity: DashboardGranularity): { start: Date; end: Date; label: string }[] {
  const now = new Date();
  const buckets: { start: Date; end: Date; label: string }[] = [];

  if (granularity === "day") {
    for (let i = 11; i >= 0; i -= 1) {
      const day = subDays(now, i);
      buckets.push({
        start: startOfDay(day),
        end: endOfDay(day),
        label: bucketLabel(day, granularity),
      });
    }
    return buckets;
  }

  if (granularity === "week") {
    for (let i = 11; i >= 0; i -= 1) {
      const week = subWeeks(now, i);
      buckets.push({
        start: startOfWeek(week, { weekStartsOn: 1 }),
        end: endOfWeek(week, { weekStartsOn: 1 }),
        label: bucketLabel(week, granularity),
      });
    }
    return buckets;
  }

  if (granularity === "month") {
    for (let i = 11; i >= 0; i -= 1) {
      const month = subMonths(now, i);
      buckets.push({
        start: startOfMonth(month),
        end: endOfMonth(month),
        label: bucketLabel(month, granularity),
      });
    }
    return buckets;
  }

  for (let i = 5; i >= 0; i -= 1) {
    const year = subYears(now, i);
    buckets.push({
      start: startOfYear(year),
      end: endOfYear(year),
      label: bucketLabel(year, granularity),
    });
  }

  return buckets;
}

export function buildChartSeries(
  orders: DashboardOrderRow[],
  metric: DashboardMetric,
  granularity: DashboardGranularity,
): DashboardChartPoint[] {
  const buckets = createBuckets(granularity);

  return buckets.map((bucket) => {
    const bucketOrders = ordersInRange(orders, bucket.start, bucket.end);
    let value = 0;

    switch (metric) {
      case "revenue":
        value = bucketOrders.reduce((sum, order) => sum + order.total, 0);
        break;
      case "orders":
        value = bucketOrders.length;
        break;
      case "customers":
        value = distinctCustomers(bucketOrders);
        break;
      case "average":
        value =
          bucketOrders.length > 0
            ? bucketOrders.reduce((sum, order) => sum + order.total, 0) / bucketOrders.length
            : 0;
        break;
    }

    return { label: bucket.label, value: Math.round(value * 100) / 100 };
  });
}

export function buildAdminDashboardData(input: {
  orders: DashboardOrderRow[];
  lowStockProducts: { name: string; stock: number; status: string }[];
  recentCustomers: { name: string; createdAt: string }[];
}): AdminDashboardData {
  return {
    orders: input.orders,
    stats: computeDashboardStats(input.orders),
    topProducts: computeTopProducts(input.orders),
    recentActivity: buildRecentActivity(
      input.orders,
      input.lowStockProducts,
      input.recentCustomers,
    ),
  };
}
