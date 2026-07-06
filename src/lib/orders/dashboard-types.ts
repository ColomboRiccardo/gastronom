export interface DashboardOrderRow {
  id: number;
  createdAt: string;
  total: number;
  status: string;
  userId: string;
  customerName: string;
  items: { name: string; qty: number; unitPrice: number }[];
}

export interface DashboardStats {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueChangePercent: number | null;
  ordersThisMonth: number;
  ordersChangePercent: number | null;
  activeCustomers: number;
  customersChangePercent: number | null;
  avgOrderValue: number;
  avgOrderChangePercent: number | null;
}

export interface DashboardActivityItem {
  at: string;
  timeLabel: string;
  event: string;
  type: "order" | "status" | "stock" | "customer";
}

export interface DashboardTopProduct {
  name: string;
  sold: number;
  revenue: number;
}

export interface AdminDashboardData {
  orders: DashboardOrderRow[];
  stats: DashboardStats;
  recentActivity: DashboardActivityItem[];
  topProducts: DashboardTopProduct[];
}

export type DashboardMetric = "revenue" | "orders" | "customers" | "average";
export type DashboardGranularity = "day" | "week" | "month" | "year";

export interface DashboardChartPoint {
  label: string;
  value: number;
}
