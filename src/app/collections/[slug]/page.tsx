import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import CollectionPageClient from "./CollectionPageClient";
import { getServerTranslator, localeAlternates, openGraphBase } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/locale-path";
import { resolveTagCopy } from "@/lib/products/resolve-copy";
import {
  fetchPublishedProductsByTag,
  fetchPublishedTags,
  lookupPublishedTagBySlug,
} from "@/lib/products/server-queries";
import { parsePage } from "@/lib/products/shop-params";
import { absoluteUrl, noIndexFollow } from "@/lib/seo/site";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ page?: string }>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const [{ slug }, { page: pageParam }, { locale, t }] = await Promise.all([
    params,
    searchParams,
    getServerTranslator(),
  ]);
  const page = parsePage(pageParam);
  const lookup = await lookupPublishedTagBySlug(slug);

  if (lookup.kind !== "found") {
    return { title: t("meta.not_found"), robots: noIndexFollow };
  }

  const copy = resolveTagCopy(lookup.tag, lookup.tag.translations, locale);
  const path = `/collections/${encodeURIComponent(lookup.tag.slug)}`;
  const pageLabel = t("meta.page_n", { page });
  const title = page > 1 ? `${copy.seoTitle} · ${pageLabel}` : copy.seoTitle;
  const description =
    copy.seoDescription || copy.intro || t("meta.collection_description", { name: copy.name });

  return {
    title,
    description: page > 1 ? `${description} ${pageLabel}.` : description,
    alternates: localeAlternates(path, locale),
    robots: page > 1 ? noIndexFollow : undefined,
    openGraph: {
      ...openGraphBase(path, locale),
      title: `${copy.seoTitle} — Гастроном`,
      description,
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
  const [{ slug }, { page: pageParam }, { locale }] = await Promise.all([
    params,
    searchParams,
    getServerTranslator(),
  ]);
  const page = parsePage(pageParam);

  const lookup = await lookupPublishedTagBySlug(slug);
  if (lookup.kind === "redirect") {
    permanentRedirect(localizePath(`/collections/${encodeURIComponent(lookup.slug)}`, locale));
  }
  if (lookup.kind !== "found") notFound();

  const [result, allTags] = await Promise.all([
    fetchPublishedProductsByTag(lookup.tag.id, { page }),
    fetchPublishedTags(),
  ]);

  const copy = resolveTagCopy(lookup.tag, lookup.tag.translations, locale);
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
