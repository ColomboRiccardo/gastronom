import { createClient } from "@/lib/supabase/client";

import {
  mapDbProductToAdminProduct,
  mapDbProductToUiProduct,
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
  is_frozen,
  created_at,
  lackmann_data,
  editor_locked_fields,
  product_translations ( language, name, description ),
  categories (
    id,
    name,
    slug,
    source_key,
    category_translations ( language, name )
  )
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

  return ((data || []) as DbProductRow[]).map((row) => mapDbProductToUiProduct(row));
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

  const mapped = ((data || []) as DbProductRow[]).map((row) => mapDbProductToUiProduct(row));
  return shuffleProducts(mapped).slice(0, Math.max(0, count));
}

export async function fetchPublishedCategorySummaries(): Promise<CategorySummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      category_id,
      categories (
        id,
        name,
        slug,
        category_translations ( language, name )
      )
    `)
    .eq("published", true)
    .not("category_id", "is", null);

  if (error) {
    throw new Error(`Failed to fetch category summaries: ${error.message}`);
  }

  const counts = new Map<number, CategorySummary>();
  for (const row of data || []) {
    const nest = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    if (!nest?.id) continue;
    const existing = counts.get(nest.id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(nest.id, {
        id: nest.id,
        slug: nest.slug,
        name: nest.name,
        count: 1,
        translations: nest.category_translations ?? [],
      });
    }
  }

  return Array.from(counts.values()).sort((a, b) => a.name.localeCompare(b.name));
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

  return ((data || []) as DbProductRow[]).map((row) => mapDbProductToAdminProduct(row));
}

export {
  bulkUpdatePublished,
  saveAdminProductEdits,
  updateProductPublished,
} from "./admin-client";
