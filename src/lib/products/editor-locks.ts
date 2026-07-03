/** Fields that lackmann-fu sync respects when listed in `editor_locked_fields`. */
export const EDITOR_LOCKABLE_FIELDS = [
  "name",
  "description",
  "price",
  "stock",
  "status",
  "badge",
  "slug",
  "image_url",
  "published",
  "category_id",
] as const;

export type EditorLockableField = (typeof EDITOR_LOCKABLE_FIELDS)[number];

export const EDITOR_FIELD_LABELS: Record<string, string> = {
  name: "Name",
  description: "Description",
  price: "Price",
  stock: "Stock",
  status: "Status",
  badge: "Badge",
  slug: "Slug",
  image_url: "Image",
  published: "Published",
  category_id: "Category",
};

export function formatLockedFields(fields: string[] | null | undefined): string {
  if (!fields?.length) return "No sync-protected fields";
  return fields
    .map((field) => EDITOR_FIELD_LABELS[field] ?? field)
    .join(", ");
}

export function hasEditorLocks(fields: string[] | null | undefined): boolean {
  return Boolean(fields?.length);
}
