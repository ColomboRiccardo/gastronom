import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailClient from "../ProductDetailClient";
import { getServerTranslator, localeAlternates, openGraphBase } from "@/lib/i18n/server";
import { type Language } from "@/lib/i18n/translate";
import { resolveCategoryName, resolveProductCopy } from "@/lib/products/resolve-copy";
import {
  fetchPublishedProductBySlug,
  fetchRelatedPublishedProducts,
} from "@/lib/products/server-queries";
import { type UiProduct } from "@/lib/products/types";
import { buildProductMetaDescription, buildProductTitleSegment, truncateTitleSegment } from "@/lib/seo/meta";
import { absoluteUrl, noIndexFollow } from "@/lib/seo/site";
import { merchantReturnPolicy, offerShippingDetails } from "@/lib/seo/structured-data";
import { SHOP } from "@/lib/shipping/config";

type Params = Promise<{ slug: string }>;

function localizedProduct(product: UiProduct, locale: Language) {
  const copy = resolveProductCopy(product, product.translations, locale);
  const category = resolveCategoryName(
    { name: product.category },
    product.categoryTranslations,
    locale,
  );
  return { name: copy.name, description: copy.description, category };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [product, { locale, t }] = await Promise.all([
    fetchPublishedProductBySlug(slug),
    getServerTranslator(),
  ]);

  if (!product) {
    return { title: t("meta.not_found"), robots: noIndexFollow };
  }

  const copy = localizedProduct(product, locale);
  const description = buildProductMetaDescription({
    name: copy.name,
    category: copy.category,
    body: copy.description,
    fallback: t("meta.product_description", { name: copy.name, category: copy.category }),
  });
  const title = buildProductTitleSegment({
    name: copy.name,
    category: copy.category,
    slug: product.slug,
  });
  const path = `/products/${encodeURIComponent(product.slug)}`;
  const imageUrl = product.image.startsWith("http") ? product.image : absoluteUrl(product.image);

  return {
    // Layout template appends " — Гастроном"; title segment is pre-truncated.
    title,
    description,
    alternates: localeAlternates(path, locale),
    openGraph: {
      ...openGraphBase(path, locale),
      title: truncateTitleSegment(`${copy.name} — Гастроном`, 70),
      description,
      images: [{ url: imageUrl, alt: copy.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [product, { locale, t }] = await Promise.all([
    fetchPublishedProductBySlug(slug),
    getServerTranslator(),
  ]);
  if (!product) notFound();

  const related = await fetchRelatedPublishedProducts(product.categoryId ?? null, product.id);
  const copy = localizedProduct(product, locale);
  const shopBlurb = t("meta.product_description", {
    name: copy.name,
    category: copy.category || t("meta.shop_title"),
  });

  const productUrl = absoluteUrl(`/products/${encodeURIComponent(product.slug)}`);
  const imageUrl = product.image.startsWith("http") ? product.image : absoluteUrl(product.image);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: copy.name,
    description: copy.description || undefined,
    image: [imageUrl],
    sku: String(product.id),
    category: copy.category,
    url: productUrl,
    brand: { "@type": "Brand", name: SHOP.name },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: product.priceNum.toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SHOP.name },
      shippingDetails: offerShippingDetails(Boolean(product.isFrozen)),
      hasMerchantReturnPolicy: merchantReturnPolicy(),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/products") },
      ...(product.categorySlug
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: copy.category,
              item: absoluteUrl(`/categories/${encodeURIComponent(product.categorySlug)}`),
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.categorySlug ? 4 : 3,
        name: copy.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetailClient product={product} related={related} shopBlurb={shopBlurb} />
    </>
  );
}
