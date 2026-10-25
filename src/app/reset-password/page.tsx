import type { Metadata } from "next";

import ResetPasswordPageClient from "./ResetPasswordPageClient";
import { noIndexFollow } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your Гастроном account.",
  robots: noIndexFollow,
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
