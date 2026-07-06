import { createAdminClient } from "@/lib/supabase/admin";

import { buildAdminDashboardData } from "./dashboard-metrics";
import { type AdminDashboardData, type DashboardOrderRow } from "./dashboard-types";

const EMPTY_DASHBOARD: AdminDashboardData = {
  orders: [],
  stats: {
    totalRevenue: 0,
    revenueThisMonth: 0,
    revenueChangePercent: null,
    ordersThisMonth: 0,
    ordersChangePercent: null,
    activeCustomers: 0,
    customersChangePercent: null,
    avgOrderValue: 0,
    avgOrderChangePercent: null,
  },
  recentActivity: [],
  topProducts: [],
};

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Failed to create admin client for dashboard:", error);
    return EMPTY_DASHBOARD;
  }

  const [ordersResult, lowStockResult, customersResult] = await Promise.all([
    supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total,
        status,
        user_id,
        order_items ( product_name, qty, unit_price ),
        profiles ( name, email )
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("name, stock, status")
      .in("status", ["Low Stock", "Out of Stock"])
      .order("stock", { ascending: true })
      .limit(8),
    supabase
      .from("profiles")
      .select("name, email, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (ordersResult.error) {
    console.error("Failed to fetch dashboard orders:", ordersResult.error.message);
    return EMPTY_DASHBOARD;
  }

  const orders: DashboardOrderRow[] = (ordersResult.data || []).map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = (row as any).profiles;
    const customerName =
      profile?.name || profile?.email?.split("@")[0] || "Customer";

    return {
      id: row.id,
      createdAt: row.created_at,
      total: Number(row.total),
      status: row.status,
      userId: row.user_id,
      customerName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: ((row as any).order_items || []).map((item: any) => ({
        name: item.product_name,
        qty: item.qty,
        unitPrice: Number(item.unit_price),
      })),
    };
  });

  return buildAdminDashboardData({
    orders,
    lowStockProducts: lowStockResult.data || [],
    recentCustomers: (customersResult.data || []).map((profile) => ({
      name: profile.name || profile.email?.split("@")[0] || "Customer",
      createdAt: profile.created_at,
    })),
  });
}
