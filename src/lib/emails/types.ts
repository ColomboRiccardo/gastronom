export interface OrderEmailItem {
  product_name: string;
  qty: number;
  unit_price: number;
}

export type OrderStatusEmailType =
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";
