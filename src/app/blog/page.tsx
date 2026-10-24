import type { Metadata } from "next";

import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, guides, and Slavic food culture from Гастроном in Sanremo.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
