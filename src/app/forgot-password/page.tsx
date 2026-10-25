import type { Metadata } from "next";

import ForgotPasswordPageClient from "./ForgotPasswordPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Гастроном account password by email.",
  robots: noIndexFollow,
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
