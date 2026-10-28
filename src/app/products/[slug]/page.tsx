import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailClient from "./ProductDetailClient";
import {
  fetchPublishedProductBySlug,
  fetchRelatedPublishedProducts,
} from "@/lib/products/server-queries";
import { absoluteUrl } from "@/lib/seo/site";
import { SHOP } from "@/lib/shipping/config";

type Params = Promise<{ slug: string }>;

const DESCRIPTION_MAX = 155;

function toMetaDescription(product: { name: string; description: string; category: string }): string {
  const base = product.description.trim();
  if (base) {
    const oneLine = base.replace(/\s+/g, " ");
    if (oneLine.length <= DESCRIPTION_MAX) return oneLine;
    return `${oneLine.slice(0, DESCRIPTION_MAX - 1).trimEnd()}…`;
  }
  return `Buy ${product.name} (${product.category}) at Гастроном, Eastern European delicatessen in Sanremo. Order online or visit the shop.`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchPublishedProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: true },
    };
  }

  const description = toMetaDescription(product);
  const path = `/products/${encodeURIComponent(product.slug)}`;
  const imageUrl = product.image.startsWith("http") ? product.image : absoluteUrl(product.image);

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${product.name} — Гастроном`,
      description,
      url: path,
      images: [{ url: imageUrl, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await fetchPublishedProductBySlug(slug);
  if (!product) notFound();

  const related = await fetchRelatedPublishedProducts(product.categoryId ?? null, product.id);

  const productUrl = absoluteUrl(`/products/${encodeURIComponent(product.slug)}`);
  const imageUrl = product.image.startsWith("http") ? product.image : absoluteUrl(product.image);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: [imageUrl],
    sku: String(product.id),
    category: product.category,
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
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/products") },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
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
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
