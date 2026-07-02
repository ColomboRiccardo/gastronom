import { createClient } from "@/lib/supabase/client";

import {
  mapDbProductToAdminProduct,
  mapDbProductToUiProduct,
} from "./mappers";
import { type AdminProduct, type CategorySummary, type DbProductRow, type UiProduct } from "./types";

const PRODUCTS_SELECT = `
  id,
  name,
  slug,
  description,
  category_id,
  price,
  stock,
  status,
  image_url,
  badge,
  published,
  created_at,
  lackmann_data
`;

export async function fetchPublishedProducts(): Promise<UiProduct[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCTS_SELECT)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch published products: ${error.message}`);
  }

  return ((data || []) as DbProductRow[]).map(mapDbProductToUiProduct);
}

function shuffleProducts<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function fetchRandomPublishedProducts(
  count: number,
  sampleSize: number = 120,
): Promise<UiProduct[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCTS_SELECT)
    .eq("published", true)
    .limit(sampleSize);

  if (error) {
    throw new Error(`Failed to fetch random published products: ${error.message}`);
  }

  const mapped = ((data || []) as DbProductRow[]).map(mapDbProductToUiProduct);
  return shuffleProducts(mapped).slice(0, Math.max(0, count));
}

export async function fetchPublishedCategorySummaries(): Promise<CategorySummary[]> {
  // Reuse the same query path already used by /products to avoid
  // drift between pages and reduce RLS/select mismatch issues.
  const published = await fetchPublishedProducts();
  const counts = new Map<string, number>();
  for (const row of published) {
    const name = row.category;
    counts.set(name, (counts.get(name) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchAllProductsForAdmin(): Promise<AdminProduct[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCTS_SELECT)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch admin products:", error);
    return null;
  }

  return ((data || []) as DbProductRow[]).map(mapDbProductToAdminProduct);
}

export async function updateProductPublished(
  productId: number,
  published: boolean,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .update({ published })
    .eq("id", productId);

  if (error) {
    console.error("Failed to update product published state:", error);
    return false;
  }
  return true;
}

export async function bulkUpdatePublished(
  productIds: number[],
  published: boolean,
): Promise<boolean> {
  if (productIds.length === 0) return true;

  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .update({ published })
    .in("id", productIds);

  if (error) {
    console.error("Failed to bulk update product published state:", error);
    return false;
  }
  return true;
}
