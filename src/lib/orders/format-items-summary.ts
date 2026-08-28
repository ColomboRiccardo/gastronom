import { type OrderItem } from "@/components/account/OrderDetailModal";

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function formatOrderItemsSummary(items: OrderItem[], t: Translate, maxPreview = 2) {
  const productCount = items.length;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  if (productCount === 0) {
    return { countLabel: t("orders.items_count", { count: 0 }), preview: "" };
  }

  const previewNames = items.slice(0, maxPreview).map((item) => item.name);
  const remaining = productCount - previewNames.length;

  const countLabel = `${t("admin_products.count", { count: productCount })} · ${t("orders.items_count", { count: totalQty })}`;
  const preview =
    remaining > 0
      ? `${previewNames.join(", ")} ${t("orders.preview_more", { count: remaining })}`
      : previewNames.join(", ");

  return { countLabel, preview };
}
