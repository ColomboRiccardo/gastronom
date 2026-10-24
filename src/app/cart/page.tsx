import type { Metadata } from "next";

import CartPageClient from "./CartPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Cart",
  robots: noIndexFollow,
};

export default function CartPage() {
  return <CartPageClient />;
}
