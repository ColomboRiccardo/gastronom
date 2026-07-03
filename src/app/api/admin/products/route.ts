import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import {
  bulkUpdatePublished,
  saveAdminProductEdits,
  updateProductPublished,
} from "@/lib/products/admin-mutations";
import {
  ADMIN_PRODUCTS_PAGE_SIZE,
  type AdminProductsSortKey,
} from "@/lib/products/constants";
import {
  fetchAdminProductCategories,
  fetchAdminProductsPage,
} from "@/lib/products/server-queries";
import { type AdminProductUpdate } from "@/lib/products/types";

async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }
  return user;
}

export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const categoriesOnly = searchParams.get("categoriesOnly") === "true";

  if (categoriesOnly) {
    const categories = await fetchAdminProductCategories();
    return NextResponse.json({ categories });
  }

  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const pageSize = Number.parseInt(
    searchParams.get("pageSize") || String(ADMIN_PRODUCTS_PAGE_SIZE),
    10,
  );

  const result = await fetchAdminProductsPage({
    page: Number.isNaN(page) ? 1 : page,
    pageSize: Number.isNaN(pageSize) ? ADMIN_PRODUCTS_PAGE_SIZE : pageSize,
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || "all",
    published: (searchParams.get("published") as "all" | "published" | "draft") || "all",
    status:
      (searchParams.get("status") as "all" | "in-stock" | "low-stock" | "out-of-stock") || "all",
    sort: (searchParams.get("sort") as AdminProductsSortKey) || "name-asc",
  });

  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    action?: string;
    productId?: number;
    productIds?: number[];
    published?: boolean;
    update?: AdminProductUpdate;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "publish") {
    const published = Boolean(body.published);
    const ids =
      body.productIds ??
      (body.productId != null ? [body.productId] : []);

    if (ids.length === 0) {
      return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
    }

    const ok =
      ids.length === 1
        ? await updateProductPublished(ids[0], published)
        : await bulkUpdatePublished(ids, published);

    if (!ok) {
      return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  if (body.action === "save" && body.productId != null && body.update) {
    const ok = await saveAdminProductEdits(body.productId, body.update);
    if (!ok) {
      return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
