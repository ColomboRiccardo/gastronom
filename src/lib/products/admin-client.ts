import { type AdminProductUpdate } from "./types";

async function patchAdminProducts(body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (error) {
    console.error("Admin product mutation failed:", error);
    return false;
  }
}

export async function updateProductPublished(
  productId: number,
  published: boolean,
): Promise<boolean> {
  return patchAdminProducts({
    action: "publish",
    productId,
    published,
  });
}

export async function bulkUpdatePublished(
  productIds: number[],
  published: boolean,
): Promise<boolean> {
  return patchAdminProducts({
    action: "publish",
    productIds,
    published,
  });
}

export async function saveAdminProductEdits(
  productId: number,
  update: AdminProductUpdate,
): Promise<boolean> {
  return patchAdminProducts({
    action: "save",
    productId,
    update,
  });
}
