"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { type Product } from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

/* ------------------------------------------------------------------ */
/*  localStorage helpers (guest cart)                                 */
/* ------------------------------------------------------------------ */

function loadGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("guest-cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  localStorage.setItem("guest-cart", JSON.stringify(items));
}

function clearGuestCart() {
  localStorage.removeItem("guest-cart");
}

/* ------------------------------------------------------------------ */
/*  Supabase helpers                                                  */
/* ------------------------------------------------------------------ */

async function fetchCartFromDb(userId: string): Promise<CartItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      qty,
      products (
        id, name, slug, description, category_id, price, stock, status, image_url, badge
      )
    `)
    .eq("user_id", userId);

  if (error || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[])
    .filter((row) => row.products)
    .map((row) => ({
      product: {
        id: row.products.id,
        name: row.products.name,
        description: row.products.description || "",
        price: `€${Number(row.products.price).toFixed(2)}`,
        priceNum: Number(row.products.price),
        image: row.products.image_url || "",
        category: row.products.category_id?.toString() || "",
        badge: row.products.badge || undefined,
      } as Product,
      quantity: row.qty,
    }));
}

async function syncItemToDb(userId: string, productId: number, qty: number) {
  const supabase = createClient();
  if (qty <= 0) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
  } else {
    await supabase
      .from("cart_items")
      .upsert(
        { user_id: userId, product_id: productId, qty },
        { onConflict: "user_id,product_id" }
      );
  }
}

async function clearCartInDb(userId: string) {
  const supabase = createClient();
  await supabase.from("cart_items").delete().eq("user_id", userId);
}

async function mergeGuestCartIntoDb(userId: string, guestItems: CartItem[]) {
  const supabase = createClient();
  for (const item of guestItems) {
    await supabase
      .from("cart_items")
      .upsert(
        { user_id: userId, product_id: item.product.id, qty: item.quantity },
        { onConflict: "user_id,product_id" }
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const prevAuthRef = useRef(isAuthenticated);

  // Load cart on mount + handle auth changes (login / logout)
  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    const load = async () => {
      if (isAuthenticated && user) {
        // Just logged in: merge guest cart into DB, then load from DB
        if (!wasAuthenticated) {
          const guestItems = loadGuestCart();
          if (guestItems.length > 0) {
            await mergeGuestCartIntoDb(user.id, guestItems);
            clearGuestCart();
          }
        }
        const dbCart = await fetchCartFromDb(user.id);
        setItems(dbCart);
      } else {
        // Guest or just logged out
        setItems(loadGuestCart());
      }
      setLoaded(true);
    };

    load();
  }, [isAuthenticated, user]);

  // Persist to localStorage for guests whenever items change
  useEffect(() => {
    if (!loaded) return;
    if (!isAuthenticated) {
      saveGuestCart(items);
    }
  }, [items, isAuthenticated, loaded]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const newQty = existing ? existing.quantity + 1 : 1;

      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Sync to DB in background
    if (isAuthenticated && user) {
      // We need to read current qty — simplest: just upsert with a subquery approach
      // Instead, read items after state update via a microtask
      setTimeout(async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("cart_items")
          .select("qty")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .single();
        const currentQty = data?.qty || 0;
        await syncItemToDb(user.id, product.id, currentQty + 1);
      }, 0);
    }
  }, [isAuthenticated, user]);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (isAuthenticated && user) {
      syncItemToDb(user.id, productId, 0);
    }
  }, [isAuthenticated, user]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
    }
    if (isAuthenticated && user) {
      syncItemToDb(user.id, productId, quantity);
    }
  }, [isAuthenticated, user]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (isAuthenticated && user) {
      clearCartInDb(user.id);
    }
  }, [isAuthenticated, user]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.priceNum * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
