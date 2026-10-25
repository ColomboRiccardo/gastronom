import type { Metadata } from "next";

import SignupPageClient from "./SignupPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Гастроном account to order Eastern European products online from Sanremo.",
  robots: noIndexFollow,
};

export default function SignupPage() {
  return <SignupPageClient />;
}
