export interface OrderItemPayload {
  product_id?: number | null;
  product_name: string;
  qty: number;
  unit_price: number;
}

export interface ProposeModificationPayload {
  items: OrderItemPayload[];
  message?: string;
}
