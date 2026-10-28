import type { Metadata } from "next";

import CollectionsPageClient from "./CollectionsPageClient";
import { fetchPublishedTags } from "@/lib/products/server-queries";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Curated collections of Eastern European food and drink from Гастроном in Sanremo: gift ideas, festive tables, pantry staples, and more.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const tags = await fetchPublishedTags();
  return <CollectionsPageClient tags={tags} />;
}
