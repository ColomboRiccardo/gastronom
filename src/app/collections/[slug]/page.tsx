import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import CollectionPageClient from "./CollectionPageClient";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/translate";
import { resolveTagCopy } from "@/lib/products/resolve-copy";
import {
  fetchPublishedProductsByTag,
  fetchPublishedTags,
  lookupPublishedTagBySlug,
} from "@/lib/products/server-queries";
import { absoluteUrl, noIndexFollow } from "@/lib/seo/site";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ page?: string }>;

function parsePage(value: string | undefined): number {
  const n = Number.parseInt(value || "1", 10);
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);
  const lookup = await lookupPublishedTagBySlug(slug);

  if (lookup.kind !== "found") {
    return { title: "Collection not found", robots: noIndexFollow };
  }

  const copy = resolveTagCopy(lookup.tag, lookup.tag.translations, DEFAULT_LANGUAGE);
  const path = `/collections/${encodeURIComponent(lookup.tag.slug)}`;
  const title = page > 1 ? `${copy.seoTitle} · Page ${page}` : copy.seoTitle;
  const description =
    copy.seoDescription ||
    copy.intro ||
    `Shop ${copy.name} at Гастроном in Sanremo — curated Eastern European products.`;

  return {
    title,
    description: page > 1 ? `${description} Page ${page}.` : description,
    alternates: { canonical: path },
    robots: page > 1 ? noIndexFollow : undefined,
    openGraph: {
      type: "website",
      title: `${copy.seoTitle} — Гастроном`,
      description,
      url: path,
      images: lookup.tag.imageUrl
        ? [{ url: lookup.tag.imageUrl.startsWith("http") ? lookup.tag.imageUrl : absoluteUrl(lookup.tag.imageUrl) }]
        : undefined,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const lookup = await lookupPublishedTagBySlug(slug);
  if (lookup.kind === "redirect") {
    permanentRedirect(`/collections/${encodeURIComponent(lookup.slug)}`);
  }
  if (lookup.kind !== "found") notFound();

  const [result, allTags] = await Promise.all([
    fetchPublishedProductsByTag(lookup.tag.id, { page }),
    fetchPublishedTags(),
  ]);

  const copy = resolveTagCopy(lookup.tag, lookup.tag.translations, DEFAULT_LANGUAGE);
  const collectionUrl = absoluteUrl(`/collections/${encodeURIComponent(lookup.tag.slug)}`);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Collections", item: absoluteUrl("/collections") },
      { "@type": "ListItem", position: 3, name: copy.name, item: collectionUrl },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.name,
    description: copy.seoDescription || copy.intro || undefined,
    url: collectionUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: result.totalCount,
      itemListElement: result.items.map((p, i) => ({
        "@type": "ListItem",
        position: (result.page - 1) * result.pageSize + i + 1,
        url: absoluteUrl(`/products/${encodeURIComponent(p.slug)}`),
        name: p.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <CollectionPageClient
        tag={lookup.tag}
        products={result.items}
        totalCount={result.totalCount}
        page={result.page}
        totalPages={result.totalPages}
        otherTags={allTags.filter((t) => t.id !== lookup.tag.id)}
      />
    </>
  );
}
