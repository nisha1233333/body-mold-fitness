'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/cart-context';
import { WishlistItem, Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Trash2, ShoppingCart, Loader as Loader2 } from 'lucide-react';

export default function WishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchWishlist() {
      try {
        const { data, error } = await supabase
          .from('wishlist')
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
  }, [user]);

  const handleRemove = async (wishlistItemId: string) => {
    if (!user) return;

    setRemoving(wishlistItemId);
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistItemId);

      if (error) {
        console.error('Error removing from wishlist:', error);
      } else {
        setWishlistItems((prev) =>
          prev.filter((item) => item.id !== wishlistItemId)
        );
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Wishlist</h1>
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
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="text-muted-foreground mt-1">
          {wishlistItems.length === 0
            ? 'Your wishlist is empty.'
            : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved to your wishlist.`}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
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
  );
}
