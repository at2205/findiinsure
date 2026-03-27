"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  premium: number;
  displayAmount?: string;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem, redirect?: boolean) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "cart";

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
const parsePrice = (price?: string, fallback?: number) => {
  if (!price) return fallback || 0;

  // remove ₹, spaces, commas
  const numeric = price.replace(/[₹,\s]/g, "");
  return Number(numeric) || fallback || 0;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    setItems(getStoredCart());
    setMounted(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        setItems(getStoredCart());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ✅ CLEAN addToCart (NO ALERTS)
  const addToCart = useCallback(
    (product: CartItem, redirect = false) => {
      setItems((prev) => {
        const exists = prev.find((item) => item.id === product.id);

        if (exists) {
          return prev; // prevent duplicate
        }

        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            premium: product.premium,
            displayAmount: product.displayAmount,
            slug: product.slug,
          },
        ];
      });

      if (redirect) {
        setTimeout(() => {
          window.location.href = "/cart";
        }, 100);
      }
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + parsePrice(item.displayAmount, item.premium),
    0
  );
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalAmount, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}