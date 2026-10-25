"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { MenuItem } from "@/data/menu";

export interface TrayItem {
  item: MenuItem;
  quantity: number;
}

interface OrderTrayContextType {
  items: TrayItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearTray: () => void;
  totalCount: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openTray: () => void;
  closeTray: () => void;
}

const OrderTrayContext = createContext<OrderTrayContextType | null>(null);

export function OrderTrayProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TrayItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Load from session storage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cafe_tray");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem("cafe_tray", JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.item.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as TrayItem[]
    );
  };

  const clearTray = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);

  return (
    <OrderTrayContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearTray,
        totalCount,
        totalPrice,
        isOpen,
        setIsOpen,
        openTray: () => setIsOpen(true),
        closeTray: () => setIsOpen(false),
      }}
    >
      {children}
    </OrderTrayContext.Provider>
  );
}

export function useOrderTray() {
  const context = useContext(OrderTrayContext);
  if (!context) {
    throw new Error("useOrderTray must be used within OrderTrayProvider");
  }
  return context;
}
