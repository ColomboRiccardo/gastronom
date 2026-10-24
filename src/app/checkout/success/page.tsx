import type { Metadata } from "next";

import CheckoutSuccessPageClient from "./CheckoutSuccessPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: noIndexFollow,
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessPageClient />;
}
