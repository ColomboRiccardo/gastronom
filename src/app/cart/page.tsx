import type { Metadata } from "next";

import CartPageClient from "./CartPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your Гастроном shopping cart before checkout.",
  robots: noIndexFollow,
};

export default function CartPage() {
  return <CartPageClient />;
}
