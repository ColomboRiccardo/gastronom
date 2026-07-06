"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Package,
  Settings,
  LayoutDashboard,
  ClipboardList,
  ShoppingBag,
  Users,
  Shield,
  Heart,
  FileText,
  DatabaseBackup,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { type AppUser } from "@/lib/auth/types";
import { type OrderDetail } from "@/components/account/OrderDetailModal";
import { type AdminDashboardData } from "@/lib/orders/dashboard-types";
import ProfileTab from "@/components/account/ProfileTab";
import OrdersTab from "@/components/account/OrdersTab";
import SettingsTab from "@/components/account/SettingsTab";
import AdminDashboardTab from "@/components/account/AdminDashboardTab";
import AdminOrdersTab from "@/components/account/AdminOrdersTab";
import AdminProductsTab from "@/components/account/AdminProductsTab";
import AdminCustomersTab from "@/components/account/AdminCustomersTab";
import WishlistTab from "@/components/account/WishlistTab";
import AdminArticlesTab from "@/components/account/AdminArticlesTab";
import AdminManagementTab from "@/components/account/AdminManagementTab";

interface AccountPageClientProps {
  user: AppUser;
  userOrders: OrderDetail[];
  adminOrders: OrderDetail[] | null;
  dashboardData: AdminDashboardData | null;
}

const AccountPageClient = ({
  user,
  userOrders,
  adminOrders,
  dashboardData,
}: AccountPageClientProps) => {
  const isAdmin = user.role === "admin" || user.role === "manager";

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      <section className="pt-24 pb-12 bg-[hsl(var(--navy))] text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {user.name || "User"}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[hsl(var(--gold-light))] text-sm">
                  {user.role === "admin"
                    ? "Administrator"
                    : user.role === "manager"
                      ? "Manager"
                      : "Customer"}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold-light))] px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="profile" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="w-auto bg-secondary/50 border border-border mb-8 flex-wrap h-auto gap-1 p-1">
              <TabsTrigger
                value="profile"
                className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 text-sm"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 text-sm"
              >
                <Package className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 text-sm"
              >
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 text-sm"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </TabsTrigger>

              {isAdmin && (
                <>
                  <Separator orientation="vertical" className="h-6 mx-1 bg-border" />
                  <TabsTrigger
                    value="admin-dashboard"
                    className="font-body data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-primary-foreground gap-2 text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin-orders"
                    className="font-body data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-primary-foreground gap-2 text-sm"
                  >
                    <ClipboardList className="w-4 h-4" />
                    All Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin-products"
                    className="font-body data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-primary-foreground gap-2 text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Products
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin-customers"
                    className="font-body data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-primary-foreground gap-2 text-sm"
                  >
                    <Users className="w-4 h-4" />
                    Customers
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin-articles"
                    className="font-body data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-primary-foreground gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Articles
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin-management"
                    className="font-body data-[state=active]:bg-[hsl(var(--navy))] data-[state=active]:text-primary-foreground gap-2 text-sm"
                  >
                    <DatabaseBackup className="w-4 h-4" />
                    Management
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <TabsContent value="profile">
            <ProfileTab user={user} />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab initialOrders={userOrders} />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          <TabsContent value="wishlist">
            <WishlistTab />
          </TabsContent>

          {isAdmin && adminOrders && dashboardData && (
            <>
              <TabsContent value="admin-dashboard">
                <AdminDashboardTab data={dashboardData} />
              </TabsContent>
              <TabsContent value="admin-orders">
                <AdminOrdersTab initialOrders={adminOrders} />
              </TabsContent>
              <TabsContent value="admin-products">
                <AdminProductsTab />
              </TabsContent>
              <TabsContent value="admin-customers">
                <AdminCustomersTab />
              </TabsContent>
              <TabsContent value="admin-articles">
                <AdminArticlesTab />
              </TabsContent>
              <TabsContent value="admin-management">
                <AdminManagementTab />
              </TabsContent>
            </>
          )}
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default AccountPageClient;
