import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_LANGUAGE, toLanguage } from "@/lib/i18n/translate";

import { deriveStockStatus } from "./mappers";
import { type AdminProductUpdate } from "./types";

const UPDATE_BATCH_SIZE = 25;
const SELECT_BATCH_SIZE = 200;

function mergeEditorLocks(
  current: string[] | null | undefined,
  fields: string[],
): string[] {
  return [...new Set([...(current ?? []), ...fields])];
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function updateProductsWithLocks(
  productIds: number[],
  values: Record<string, unknown>,
  lockFields: string[],
): Promise<boolean> {
  if (productIds.length === 0) return true;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Admin Supabase client unavailable:", error);
    return false;
  }

  const rows: { id: number; editor_locked_fields: string[] | null }[] = [];

  for (const idBatch of chunk(productIds, SELECT_BATCH_SIZE)) {
    const { data, error } = await supabase
      .from("products")
      .select("id, editor_locked_fields")
      .in("id", idBatch);

    if (error || !data) {
      console.error("Failed to load editor locks:", error?.message);
      return false;
    }

    rows.push(
      ...(data as { id: number; editor_locked_fields: string[] | null }[]),
    );
  }

  for (const updateBatch of chunk(rows, UPDATE_BATCH_SIZE)) {
    const results = await Promise.all(
      updateBatch.map((row) =>
        supabase
          .from("products")
          .update({
            ...values,
            editor_locked_fields: mergeEditorLocks(
              row.editor_locked_fields,
              lockFields,
            ),
          })
          .eq("id", row.id),
      ),
    );

    if (!results.every(({ error: updateError }) => !updateError)) {
      console.error("Failed to update products batch");
      return false;
    }
  }

  return true;
}

export async function updateProductPublished(
  productId: number,
  published: boolean,
): Promise<boolean> {
  return updateProductsWithLocks([productId], { published }, ["published"]);
}

export async function bulkUpdatePublished(
  productIds: number[],
  published: boolean,
): Promise<boolean> {
  return updateProductsWithLocks(productIds, { published }, ["published"]);
}

/**
 * Name/description live only in product_translations (including en).
 * products.* keeps price/stock/badge/frozen for sync; Lackmann never writes translations.
 */
export async function saveAdminProductEdits(
  productId: number,
  update: AdminProductUpdate,
): Promise<boolean> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Admin Supabase client unavailable:", error);
    return false;
  }

  const language = toLanguage(update.language ?? DEFAULT_LANGUAGE);
  const name = update.name.trim();
  const description = update.description.trim();

  if (!name) {
    console.error("Product name is required for translation save");
    return false;
  }

  const { error: translationError } = await supabase
    .from("product_translations")
    .upsert(
      {
        product_id: productId,
        language,
        name,
        description: description || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "product_id,language" },
    );

  if (translationError) {
    console.error("Failed to upsert product translation:", translationError.message);
    return false;
  }

  const { data: existing, error } = await supabase
    .from("products")
    .select("price, stock, badge, is_frozen")
    .eq("id", productId)
    .single();

  if (error || !existing) {
    console.error("Failed to load product for save:", error?.message);
    return false;
  }

  const stock = Math.max(0, Math.floor(update.stock));
  const status = deriveStockStatus(stock);
  const price = update.price;
  const badge = update.badge?.trim() || null;
  const isFrozen = Boolean(update.isFrozen);

  const changedFields: string[] = [];
  if (price !== Number(existing.price)) changedFields.push("price");
  if (stock !== existing.stock) changedFields.push("stock", "status");
  if (badge !== (existing.badge || null)) changedFields.push("badge");
  if (isFrozen !== Boolean(existing.is_frozen)) changedFields.push("is_frozen");

  if (changedFields.length === 0) return true;

  return updateProductsWithLocks(
    [productId],
    { price, stock, status, badge, is_frozen: isFrozen },
    changedFields,
  );
}

export async function clearEditorLocks(productId: number): Promise<boolean> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Admin Supabase client unavailable:", error);
    return false;
  }

  const { error } = await supabase
    .from("products")
    .update({ editor_locked_fields: [] })
    .eq("id", productId);

  if (error) {
    console.error("Failed to clear editor locks:", error.message);
    return false;
  }

  return true;
}
