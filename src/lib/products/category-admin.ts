import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_LANGUAGE, toLanguage, type Language } from "@/lib/i18n/translate";

import { categoryTranslationsToList } from "@/lib/products/resolve-copy";
import { type AdminCategory, type AdminCategoryUpdate } from "@/lib/products/types";

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "category";
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Admin Supabase client unavailable:", error);
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      source_key,
      sort_order,
      image_url,
      category_translations ( language, name ),
      products ( id )
    `)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id as number,
    name: row.name as string,
    slug: row.slug as string,
    sourceKey: (row.source_key as string | null) ?? null,
    sortOrder: Number(row.sort_order ?? 0),
    imageUrl: (row.image_url as string | null) ?? null,
    translations: categoryTranslationsToList(row.category_translations),
    productCount: Array.isArray(row.products) ? row.products.length : 0,
  }));
}

export async function createAdminCategory(name: string, language: Language = DEFAULT_LANGUAGE): Promise<AdminCategory | null> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Admin Supabase client unavailable:", error);
    return null;
  }

  const trimmed = name.trim();
  if (!trimmed) return null;

  let base = slugify(trimmed);
  let slug = base;
  let n = 0;
  while (true) {
    const { data: existing } = await supabase.from("categories").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    n += 1;
    slug = `${base}-${n}`;
  }

  const { data: created, error } = await supabase
    .from("categories")
    .insert({
      name: trimmed,
      slug,
      source_key: null,
      sort_order: 0,
    })
    .select("id, name, slug, source_key, sort_order, image_url")
    .single();

  if (error || !created) {
    console.error("Failed to create category:", error?.message);
    return null;
  }

  const lang = toLanguage(language);
  await supabase.from("category_translations").upsert(
    {
      category_id: created.id,
      language: lang,
      name: trimmed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "category_id,language" },
  );

  if (lang !== "en") {
    await supabase.from("category_translations").upsert(
      {
        category_id: created.id,
        language: "en",
        name: trimmed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "category_id,language" },
    );
  }

  return {
    id: created.id,
    name: created.name,
    slug: created.slug,
    sourceKey: created.source_key,
    sortOrder: Number(created.sort_order ?? 0),
    imageUrl: created.image_url,
    translations: [{ language: lang, name: trimmed }],
    productCount: 0,
  };
}

export async function saveAdminCategoryTranslation(
  categoryId: number,
  update: AdminCategoryUpdate,
): Promise<boolean> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Admin Supabase client unavailable:", error);
    return false;
  }

  const language = toLanguage(update.language);
  const name = update.name.trim();
  if (!name) return false;

  const { error: trError } = await supabase.from("category_translations").upsert(
    {
      category_id: categoryId,
      language,
      name,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "category_id,language" },
  );

  if (trError) {
    console.error("Failed to upsert category translation:", trError.message);
    return false;
  }

  const patch: Record<string, unknown> = {};
  if (language === "en") {
    patch.name = name;
  }
  if (update.sortOrder != null) {
    patch.sort_order = update.sortOrder;
  }
  if (update.imageUrl !== undefined) {
    patch.image_url = update.imageUrl;
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase.from("categories").update(patch).eq("id", categoryId);
    if (error) {
      console.error("Failed to update category:", error.message);
      return false;
    }
  }

  return true;
}
