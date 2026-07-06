import { type OrderItem } from "@/components/account/OrderDetailModal";

export function formatOrderItemsSummary(items: OrderItem[], maxPreview = 2) {
  const productCount = items.length;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  if (productCount === 0) {
    return { countLabel: "0 items", preview: "" };
  }

  const previewNames = items.slice(0, maxPreview).map((item) => item.name);
  const remaining = productCount - previewNames.length;

  const countLabel = `${productCount} product${productCount === 1 ? "" : "s"} · ${totalQty} item${totalQty === 1 ? "" : "s"}`;
  const preview =
    remaining > 0
      ? `${previewNames.join(", ")} +${remaining} more`
      : previewNames.join(", ");

  return { countLabel, preview };
}
