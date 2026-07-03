import { createClient } from "@/lib/supabase/client";

import {
  mapDbProductToAdminProduct,
  mapDbProductToUiProduct,
  resolveCategory,
} from "./mappers";
import {
  type AdminProduct,
  type CategorySummary,
  type DbProductRow,
  type UiProduct,
} from "./types";

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
  lackmann_data,
  editor_locked_fields
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("lackmann_data, category_id")
    .eq("published", true);

  if (error) {
    throw new Error(`Failed to fetch category summaries: ${error.message}`);
  }

  const counts = new Map<string, number>();
  for (const row of data || []) {
    const name = resolveCategory(
      row as Pick<DbProductRow, "lackmann_data" | "category_id">,
    );
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

export {
  bulkUpdatePublished,
  saveAdminProductEdits,
  updateProductPublished,
} from "./admin-client";
