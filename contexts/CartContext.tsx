'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;           // harvest id
  cropType: string;
  pricePerUnit: number;
  unit: string;
  quantity: number;     // how many units the buyer wants
  availableQty: number;
  farmerId: string;
  farmerName: string;
  quality?: string;
  location?: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  hasItem: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fl_cart');
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem('fl_cart', JSON.stringify(next));
  };

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      const next = existing
        ? prev.map(i => i.id === item.id ? { ...i, quantity: Math.min(i.quantity + 1, i.availableQty) } : i)
        : [...prev, { ...item, quantity: 1 }];
      localStorage.setItem('fl_cart', JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id: string) => persist(items.filter(i => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id);
    persist(items.map(i => i.id === id ? { ...i, quantity: Math.min(qty, i.availableQty) } : i));
  };

  const clearCart = () => persist([]);

  const total = items.reduce((s, i) => s + i.pricePerUnit * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const hasItem = (id: string) => items.some(i => i.id === id);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, removeItem, updateQty, clearCart, hasItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
