'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('bm-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
    const savedCoupon = localStorage.getItem('bm-coupon');
    if (savedCoupon) {
      try {
        const parsed = JSON.parse(savedCoupon);
        setCouponCode(parsed.code);
        setDiscount(parsed.discount);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bm-cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
    localStorage.removeItem('bm-coupon');
  }, []);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/coupons/validate?code=${code}`);
      if (!res.ok) return false;
      const coupon = await res.json();
      if (!coupon) return false;
      const sub = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      if (coupon.min_order_amount > sub) return false;
      let disc = 0;
      if (coupon.discount_type === 'percentage') {
        disc = sub * (coupon.discount_value / 100);
      } else {
        disc = coupon.discount_value;
      }
      setDiscount(disc);
      setCouponCode(code);
      localStorage.setItem('bm-coupon', JSON.stringify({ code, discount: disc }));
      return true;
    } catch {
      return false;
    }
  }, [items]);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setDiscount(0);
    localStorage.removeItem('bm-coupon');
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalPrice = subtotal - discount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice, subtotal, discount, couponCode, applyCoupon, removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
