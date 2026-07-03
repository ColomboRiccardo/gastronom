import { redirect } from "next/navigation";

import AccountPageClient from "./AccountPageClient";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { fetchAllOrdersForAdmin, fetchUserOrdersForAccount } from "@/lib/orders/server-queries";

export default async function AccountPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const isAdmin = user.role === "admin" || user.role === "manager";

  const [userOrders, adminOrders] = await Promise.all([
    fetchUserOrdersForAccount(user.id),
    isAdmin ? fetchAllOrdersForAdmin() : Promise.resolve(null),
  ]);

  return (
    <AccountPageClient
      user={user}
      userOrders={userOrders}
      adminOrders={adminOrders}
    />
  );
}
