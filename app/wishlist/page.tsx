'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';
import { WishlistItem, Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, LogIn, ShoppingCart, Trash2, Loader as Loader2 } from 'lucide-react';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchWishlist() {
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('*, product:products(*)')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching wishlist:', error);
        } else {
          setWishlistItems(data ?? []);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [user, authLoading]);

  const handleRemove = async (wishlistItemId: string) => {
    if (!user) return;

    setRemoving(wishlistItemId);
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistItemId);

      if (error) {
        console.error('Error removing from wishlist:', error);
      } else {
        setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistItemId));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen">
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="h-10 w-64 mx-auto bg-white/5 rounded animate-pulse mb-4" />
            <div className="h-6 w-96 mx-auto bg-white/5 rounded animate-pulse" />
          </div>
        </section>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen">
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                Your <span className="gradient-text">Wishlist</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Save your favorite supplements and find them easily later.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign in to view your wishlist</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create an account or sign in to save products to your wishlist and access them from any device.
              </p>
              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up for free
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading wishlist items
  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                Your <span className="gradient-text">Wishlist</span>
              </h1>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="aspect-square bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-white/5 rounded" />
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-8 w-20 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              Your <span className="gradient-text">Wishlist</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {wishlistItems.length === 0
                ? 'Your wishlist is empty. Start saving products you love.'
                : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved to your wishlist.`}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Save products you love to your wishlist so you can easily find them later.
              </p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div key={item.id} className="relative group">
                  <ProductCard product={product} />
                  {/* Wishlist overlay actions */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                      onClick={() => handleRemove(item.id)}
                      disabled={removing === item.id}
                    >
                      {removing === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {/* Mobile always-visible remove button */}
                  <div className="sm:hidden absolute top-3 right-3 z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                      onClick={() => handleRemove(item.id)}
                      disabled={removing === item.id}
                    >
                      {removing === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
