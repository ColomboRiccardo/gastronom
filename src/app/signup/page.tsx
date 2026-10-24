import type { Metadata } from "next";

import SignupPageClient from "./SignupPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Sign up",
  robots: noIndexFollow,
};

export default function SignupPage() {
  return <SignupPageClient />;
}
