import { createClient } from "@/lib/supabase/server";

import { deriveStockStatus } from "./mappers";
import { type AdminProductUpdate } from "./types";

function mergeEditorLocks(
  current: string[] | null | undefined,
  fields: string[],
): string[] {
  return [...new Set([...(current ?? []), ...fields])];
}

async function updateProductsWithLocks(
  productIds: number[],
  values: Record<string, unknown>,
  lockFields: string[],
): Promise<boolean> {
  if (productIds.length === 0) return true;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, editor_locked_fields")
    .in("id", productIds);

  if (error || !data) {
    console.error("Failed to load editor locks:", error?.message);
    return false;
  }

  const results = await Promise.all(
    data.map((row) =>
      supabase
        .from("products")
        .update({
          ...values,
          editor_locked_fields: mergeEditorLocks(
            row.editor_locked_fields as string[] | undefined,
            lockFields,
          ),
        })
        .eq("id", row.id),
    ),
  );

  return results.every(({ error: updateError }) => !updateError);
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
  const stock = Math.max(0, Math.floor(update.stock));
  const status = deriveStockStatus(stock);

  return updateProductsWithLocks(
    [productId],
    {
      name: update.name.trim(),
      description: update.description.trim(),
      price: update.price,
      stock,
      status,
      badge: update.badge?.trim() || null,
    },
    ["name", "description", "price", "stock", "status", "badge"],
  );
}
