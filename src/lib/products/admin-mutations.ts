import { createAdminClient } from "@/lib/supabase/admin";

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

  const { data: existing, error } = await supabase
    .from("products")
    .select("name, description, price, stock, badge")
    .eq("id", productId)
    .single();

  if (error || !existing) {
    console.error("Failed to load product for save:", error?.message);
    return false;
  }

  const stock = Math.max(0, Math.floor(update.stock));
  const status = deriveStockStatus(stock);
  const name = update.name.trim();
  const description = update.description.trim();
  const price = update.price;
  const badge = update.badge?.trim() || null;

  const changedFields: string[] = [];
  if (name !== existing.name) changedFields.push("name");
  if (description !== (existing.description || "")) changedFields.push("description");
  if (price !== Number(existing.price)) changedFields.push("price");
  if (stock !== existing.stock) changedFields.push("stock", "status");
  if (badge !== (existing.badge || null)) changedFields.push("badge");

  if (changedFields.length === 0) return true;

  return updateProductsWithLocks(
    [productId],
    { name, description, price, stock, status, badge },
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
