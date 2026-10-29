import type { Metadata } from "next";

import CollectionsPageClient from "./CollectionsPageClient";
import { localizedPageMetadata } from "@/lib/i18n/server";
import { fetchPublishedTags } from "@/lib/products/server-queries";

export function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata({
    path: "/collections",
    titleKey: "meta.collections_title",
    descriptionKey: "meta.collections_description",
  });
}

export default async function CollectionsPage() {
  const tags = await fetchPublishedTags();
  return <CollectionsPageClient tags={tags} />;
}
