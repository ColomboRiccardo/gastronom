import { type Product } from "@/components/ProductCard";
import { type Language } from "@/lib/i18n/translate";

import {
  type CategoryTranslationRow,
  type ProductTranslationRow,
  type TagTranslationRow,
} from "./resolve-copy";

export type { CategoryTranslationRow, ProductTranslationRow, TagTranslationRow };

export interface DbCategoryNest {
  id: number;
  name: string;
  slug: string;
  source_key: string | null;
  category_translations?: CategoryTranslationRow[] | null;
}

/** Raw tag_translations row shape (snake_case) from Supabase. */
export interface DbTagTranslationRow {
  language: string;
  name: string;
  intro?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface DbTagNest {
  id: number;
  slug: string;
  name: string;
  published: boolean;
  tag_translations?: DbTagTranslationRow[] | null;
}

/** Lightweight tag reference attached to a product for chips/links. */
export interface ProductTagRef {
  id: number;
  slug: string;
  name: string;
  translations: TagTranslationRow[];
}

/** Public tag with localized copy and published-product count. */
export interface TagSummary {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  count: number;
  translations: TagTranslationRow[];
}

export interface AdminTag {
  id: number;
  slug: string;
  name: string;
  published: boolean;
  sortOrder: number;
  imageUrl: string | null;
  translations: TagTranslationRow[];
  productCount: number;
}

export interface AdminTagUpdate {
  language: Language;
  name: string;
  intro?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  /** When changed, the previous slug is kept as a redirect. */
  slug?: string;
  published?: boolean;
  sortOrder?: number;
  imageUrl?: string | null;
}

export interface DbProductRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number | null;
  price: number;
  stock: number;
  status: string;
  image_url: string | null;
  badge: string | null;
  published: boolean;
  is_frozen?: boolean;
  created_at: string;
  lackmann_data: {
    maingroup?: string;
  } | null;
  editor_locked_fields?: string[];
  /** Nested select from product_translations; may be missing on older query paths. */
  product_translations?: ProductTranslationRow[] | null;
  /** Nested select via products.category_id → categories (object or 1-element array). */
  categories?: DbCategoryNest | DbCategoryNest[] | null;
  /** Nested select via product_tags → tags; missing on older query paths. */
  product_tags?: Array<{ tags: DbTagNest | DbTagNest[] | null }> | null;
}

export interface ProductTranslationInput {
  language: Language;
  name: string;
  description: string;
}

export interface UiProduct extends Product {
  slug: string;
  categorySlug: string | null;
  inStock: boolean;
  tags: ProductTagRef[];
  createdAt: string;
}

export interface CategorySummary {
  id: number;
  slug: string;
  name: string;
  count: number;
  translations: CategoryTranslationRow[];
}

/** Admin table row — extends UI fields with stock/status/publish metadata. */
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId: number | null;
  categorySlug: string | null;
  categoryTranslations: CategoryTranslationRow[];
  price: number;
  priceDisplay: string;
  stock: number;
  status: string;
  published: boolean;
  badge: string | null;
  image: string;
  isFrozen: boolean;
  editorLockedFields: string[];
  translations: ProductTranslationRow[];
  tags: ProductTagRef[];
}

export interface AdminProductUpdate {
  name: string;
  description: string;
  price: number;
  stock: number;
  badge: string | null;
  isFrozen: boolean;
  /** Locale being edited; save upserts this translation row. */
  language?: Language;
  /** When set, updates products.category_id and locks it from sync. */
  categoryId?: number | null;
  /** When set, replaces the product's tag assignments. */
  tagIds?: number[];
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  sourceKey: string | null;
  sortOrder: number;
  imageUrl: string | null;
  translations: CategoryTranslationRow[];
  productCount: number;
}

export interface AdminCategoryUpdate {
  language: Language;
  name: string;
  sortOrder?: number;
  imageUrl?: string | null;
}
