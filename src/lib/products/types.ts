import { type Product } from "@/components/ProductCard";
import { type Language } from "@/lib/i18n/translate";

import {
  type CategoryTranslationRow,
  type ProductTranslationRow,
} from "./resolve-copy";

export type { CategoryTranslationRow, ProductTranslationRow };

export interface DbCategoryNest {
  id: number;
  name: string;
  slug: string;
  source_key: string | null;
  category_translations?: CategoryTranslationRow[] | null;
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
}

export interface ProductTranslationInput {
  language: Language;
  name: string;
  description: string;
}

export interface UiProduct extends Product {
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
