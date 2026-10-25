import type { Metadata } from "next";

import LoginPageClient from "./LoginPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Гастроном account to track orders and manage your profile.",
  robots: noIndexFollow,
};

export default function LoginPage() {
  return <LoginPageClient />;
}
