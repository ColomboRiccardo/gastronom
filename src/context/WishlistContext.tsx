"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { type Product } from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

/* ------------------------------------------------------------------ */
/*  localStorage helpers (guest wishlist)                               */
/* ------------------------------------------------------------------ */

function loadGuestWishlist(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("guest-wishlist");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestWishlist(items: Product[]) {
  localStorage.setItem("guest-wishlist", JSON.stringify(items));
}

function clearGuestWishlist() {
  localStorage.removeItem("guest-wishlist");
}

/* ------------------------------------------------------------------ */
/*  Supabase helpers                                                    */
/* ------------------------------------------------------------------ */

async function fetchWishlistFromDb(userId: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select(`
      product_id,
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
      id: row.products.id,
      name: row.products.name,
      description: row.products.description || "",
      price: `€${Number(row.products.price).toFixed(2)}`,
      priceNum: Number(row.products.price),
      image: row.products.image_url || "",
      category: row.products.category_id?.toString() || "",
      badge: row.products.badge || undefined,
    } as Product));
}

async function addWishlistItemToDb(userId: string, productId: number) {
  const supabase = createClient();
  await supabase
    .from("wishlist_items")
    .upsert(
      { user_id: userId, product_id: productId },
      { onConflict: "user_id,product_id" }
    );
}

async function removeWishlistItemFromDb(userId: string, productId: number) {
  const supabase = createClient();
  await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}

async function clearWishlistInDb(userId: string) {
  const supabase = createClient();
  await supabase.from("wishlist_items").delete().eq("user_id", userId);
}

async function mergeGuestWishlistIntoDb(userId: string, guestItems: Product[]) {
  const supabase = createClient();
  for (const item of guestItems) {
    await supabase
      .from("wishlist_items")
      .upsert(
        { user_id: userId, product_id: item.id },
        { onConflict: "user_id,product_id" }
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const prevAuthRef = useRef(isAuthenticated);

  // Load wishlist on mount + handle auth changes
  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    const load = async () => {
      if (isAuthenticated && user) {
        if (!wasAuthenticated) {
          const guestItems = loadGuestWishlist();
          if (guestItems.length > 0) {
            await mergeGuestWishlistIntoDb(user.id, guestItems);
            clearGuestWishlist();
          }
        }
        const dbWishlist = await fetchWishlistFromDb(user.id);
        setItems(dbWishlist);
      } else {
        setItems(loadGuestWishlist());
      }
      setLoaded(true);
    };

    load();
  }, [isAuthenticated, user]);

  // Persist to localStorage for guests
  useEffect(() => {
    if (!loaded) return;
    if (!isAuthenticated) {
      saveGuestWishlist(items);
    }
  }, [items, isAuthenticated, loaded]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
    if (isAuthenticated && user) {
      addWishlistItemToDb(user.id, product.id);
    }
  }, [isAuthenticated, user]);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
    if (isAuthenticated && user) {
      removeWishlistItemFromDb(user.id, productId);
    }
  }, [isAuthenticated, user]);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        if (isAuthenticated && user) removeWishlistItemFromDb(user.id, product.id);
        return prev.filter((p) => p.id !== product.id);
      }
      if (isAuthenticated && user) addWishlistItemToDb(user.id, product.id);
      return [...prev, product];
    });
  }, [isAuthenticated, user]);

  const isInWishlist = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    if (isAuthenticated && user) {
      clearWishlistInDb(user.id);
    }
  }, [isAuthenticated, user]);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
