import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_LANGUAGE, toLanguage, type Language } from "@/lib/i18n/translate";

import { mapTagTranslations } from "./mappers";
import { type AdminTag, type AdminTagUpdate, type DbTagTranslationRow } from "./types";

const ADMIN_TAG_SELECT = `
  id,
  slug,
  name,
  published,
  sort_order,
  image_url,
  tag_translations ( language, name, intro, seo_title, seo_description ),
  product_tags ( product_id )
`;

interface AdminTagRow {
  id: number;
  slug: string;
  name: string;
  published: boolean;
  sort_order: number | null;
  image_url: string | null;
  tag_translations?: DbTagTranslationRow[] | null;
  product_tags?: { product_id: number }[] | null;
}

export function slugifyTag(label: string): string {
  return (
    label
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "collection"
  );
}

function mapAdminTag(row: AdminTagRow): AdminTag {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    published: Boolean(row.published),
    sortOrder: Number(row.sort_order ?? 0),
    imageUrl: row.image_url ?? null,
    translations: mapTagTranslations(row.tag_translations),
    productCount: Array.isArray(row.product_tags) ? row.product_tags.length : 0,
  };
}

function getClient() {
  try {
    return createAdminClient();
  } catch (error) {
    console.error("Admin Supabase client unavailable:", error);
    return null;
  }
}

export async function fetchAdminTags(): Promise<AdminTag[]> {
  const supabase = getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tags")
    .select(ADMIN_TAG_SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch tags:", error.message);
    return [];
  }

  return ((data || []) as unknown as AdminTagRow[]).map(mapAdminTag);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uniqueSlug(supabase: any, base: string, excludeId?: number): Promise<string> {
  let slug = base;
  let n = 0;
  while (true) {
    let query = supabase.from("tags").select("id").eq("slug", slug);
    if (excludeId != null) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createAdminTag(
  name: string,
  language: Language = DEFAULT_LANGUAGE,
): Promise<AdminTag | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const trimmed = name.trim();
  if (!trimmed) return null;

  const slug = await uniqueSlug(supabase, slugifyTag(trimmed));
  const { data: created, error } = await supabase
    .from("tags")
    .insert({ name: trimmed, slug, published: false, sort_order: 0 })
    .select("id")
    .single();

  if (error || !created) {
    console.error("Failed to create tag:", error?.message);
    return null;
  }

  const lang = toLanguage(language);
  const now = new Date().toISOString();
  const rows = [{ tag_id: created.id, language: lang, name: trimmed, updated_at: now }];
  if (lang !== DEFAULT_LANGUAGE) {
    rows.push({ tag_id: created.id, language: DEFAULT_LANGUAGE, name: trimmed, updated_at: now });
  }
  await supabase.from("tag_translations").upsert(rows, { onConflict: "tag_id,language" });

  const all = await fetchAdminTags();
  return all.find((t) => t.id === created.id) ?? null;
}

/**
 * Upserts one language row and patches tags.* (slug/published/sort/image).
 * A slug change records the old slug in tag_slug_redirects.
 */
export async function saveAdminTag(tagId: number, update: AdminTagUpdate): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;

  const language = toLanguage(update.language);
  const name = update.name.trim();
  if (!name) return false;

  const now = new Date().toISOString();
  const { error: trError } = await supabase.from("tag_translations").upsert(
    {
      tag_id: tagId,
      language,
      name,
      intro: update.intro?.trim() || null,
      seo_title: update.seoTitle?.trim() || null,
      seo_description: update.seoDescription?.trim() || null,
      updated_at: now,
    },
    { onConflict: "tag_id,language" },
  );

  if (trError) {
    console.error("Failed to upsert tag translation:", trError.message);
    return false;
  }

  const { data: existing, error: loadError } = await supabase
    .from("tags")
    .select("slug")
    .eq("id", tagId)
    .single();

  if (loadError || !existing) {
    console.error("Failed to load tag:", loadError?.message);
    return false;
  }

  const patch: Record<string, unknown> = { updated_at: now };
  if (language === DEFAULT_LANGUAGE) patch.name = name;
  if (update.published != null) patch.published = update.published;
  if (update.sortOrder != null) patch.sort_order = update.sortOrder;
  if (update.imageUrl !== undefined) patch.image_url = update.imageUrl;

  const requestedSlug = update.slug?.trim();
  if (requestedSlug && requestedSlug !== existing.slug) {
    const nextSlug = await uniqueSlug(supabase, slugifyTag(requestedSlug), tagId);
    patch.slug = nextSlug;

    // Keep the old address alive; drop any stale redirect that now points at the new slug.
    await supabase.from("tag_slug_redirects").delete().eq("old_slug", nextSlug);
    await supabase
      .from("tag_slug_redirects")
      .upsert({ old_slug: existing.slug, tag_id: tagId }, { onConflict: "old_slug" });
  }

  const { error } = await supabase.from("tags").update(patch).eq("id", tagId);
  if (error) {
    console.error("Failed to update tag:", error.message);
    return false;
  }

  return true;
}

export async function deleteAdminTag(tagId: number): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;

  const { error } = await supabase.from("tags").delete().eq("id", tagId);
  if (error) {
    console.error("Failed to delete tag:", error.message);
    return false;
  }
  return true;
}

/** Replace a product's tag set. Sync never calls this; admin only. */
export async function setProductTags(productId: number, tagIds: number[]): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;

  const wanted = Array.from(new Set(tagIds.filter((id) => Number.isFinite(id))));

  const { data: current, error: loadError } = await supabase
    .from("product_tags")
    .select("tag_id")
    .eq("product_id", productId);

  if (loadError) {
    console.error("Failed to load product tags:", loadError.message);
    return false;
  }

  const have = new Set(((current || []) as { tag_id: number }[]).map((r) => r.tag_id));
  const toAdd = wanted.filter((id) => !have.has(id));
  const toRemove = Array.from(have).filter((id) => !wanted.includes(id));

  if (toRemove.length > 0) {
    const { error } = await supabase
      .from("product_tags")
      .delete()
      .eq("product_id", productId)
      .in("tag_id", toRemove);
    if (error) {
      console.error("Failed to remove product tags:", error.message);
      return false;
    }
  }

  if (toAdd.length > 0) {
    const { error } = await supabase
      .from("product_tags")
      .insert(toAdd.map((tag_id) => ({ product_id: productId, tag_id })));
    if (error) {
      console.error("Failed to add product tags:", error.message);
      return false;
    }
  }

  return true;
}
