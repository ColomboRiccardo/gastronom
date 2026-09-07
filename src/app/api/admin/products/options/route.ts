import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toLanguage } from "@/lib/i18n/translate";
import { resolveProductCopy } from "@/lib/products/resolve-copy";
import type { ProductTranslationRow } from "@/lib/products/resolve-copy";

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
  const search = searchParams.get("search")?.trim() ?? "";
  const language = toLanguage(searchParams.get("lang"));

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin client error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  let query = supabase
    .from("products")
    .select("id, name, description, price, product_translations ( language, name, description )")
    .order("name", { ascending: true })
    .limit(500);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch product options:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data || []).map((row) => {
    const translations = (row.product_translations || []) as ProductTranslationRow[];
    const copy = resolveProductCopy(
      { name: row.name as string, description: row.description as string | null },
      translations,
      language,
    );
    return {
      id: row.id as number,
      name: copy.name,
      price: Number(row.price),
    };
  });

  return NextResponse.json({ products });
}
