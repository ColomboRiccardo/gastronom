import type { Metadata } from "next";

import LoginPageClient from "./LoginPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Log in",
  robots: noIndexFollow,
};

export default function LoginPage() {
  return <LoginPageClient />;
}
