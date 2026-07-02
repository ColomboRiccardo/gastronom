import { type Product } from "@/components/ProductCard";

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
  created_at: string;
  lackmann_data: {
    maingroup?: string;
  } | null;
}

export interface UiProduct extends Product {
  createdAt: string;
}

/** Admin table row — extends UI fields with stock/status/publish metadata. */
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  priceDisplay: string;
  stock: number;
  status: string;
  published: boolean;
  image: string;
}
