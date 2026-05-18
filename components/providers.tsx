'use client';

import React from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}