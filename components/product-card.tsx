'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = product.compare_price > 0
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div className="group glass-card overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md">
            Sold Out
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full"
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Link href={`/product/${product.slug}`}>
            <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/wishlist`}>
            <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.short_description}</p>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.review_count})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.compare_price > 0 && (
              <span className="text-sm text-muted-foreground line-through">${product.compare_price.toFixed(2)}</span>
            )}
          </div>
          <Button
            size="sm"
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}