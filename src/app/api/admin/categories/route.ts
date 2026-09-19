import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import {
  createAdminCategory,
  fetchAdminCategories,
  saveAdminCategoryTranslation,
} from "@/lib/products/category-admin";
import { toLanguage } from "@/lib/i18n/translate";
import { type AdminCategoryUpdate } from "@/lib/products/types";

async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await fetchAdminCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; language?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const created = await createAdminCategory(body.name, toLanguage(body.language));
  if (!created) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }

  return NextResponse.json({ category: created });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { categoryId?: number; update?: AdminCategoryUpdate };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.categoryId == null || !body.update) {
    return NextResponse.json({ error: "categoryId and update required" }, { status: 400 });
  }

  const ok = await saveAdminCategoryTranslation(body.categoryId, {
    ...body.update,
    language: toLanguage(body.update.language),
  });

  if (!ok) {
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
