'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag, Tag, ArrowRight, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const cart = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const success = await cart.applyCoupon(couponInput.trim().toUpperCase());
    setCouponLoading(false);
    if (!success) {
      setCouponError('Invalid coupon code or minimum order not met');
    } else {
      setCouponInput('');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added any supplements yet. Start shopping to fuel your transformation!
          </p>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8">
              Browse Shop <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Shopping <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-muted-foreground">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="glass-card p-4 sm:p-6 flex gap-4 sm:gap-6"
              >
                {/* Product Image */}
                <Link href={`/product/${item.product.slug}`} className="shrink-0">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden bg-secondary/50">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {item.product.short_description}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => cart.removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-end justify-between mt-4 gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-white/10 hover:bg-white/5"
                        onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-white/10 hover:bg-white/5"
                        onClick={() => {
                          if (item.quantity < item.product.stock) {
                            cart.updateQuantity(item.product.id, item.quantity + 1);
                          }
                        }}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      {item.product.compare_price > item.product.price && (
                        <p className="text-xs text-muted-foreground line-through">
                          ${(item.product.compare_price * item.quantity).toFixed(2)}
                        </p>
                      )}
                      <p className="font-bold text-primary">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {item.quantity >= item.product.stock && item.product.stock > 0 && (
                    <p className="text-xs text-amber-400 mt-2">Max stock reached</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                {cart.couponCode ? (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{cart.couponCode}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-auto p-0 text-xs"
                      onClick={() => cart.removeCoupon()}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon code"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        className="h-10 border-white/10 bg-white/5 text-sm uppercase"
                      />
                      <Button
                        variant="outline"
                        className="h-10 px-4 border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-destructive mt-2">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-primary">-${cart.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-primary">
                    {cart.subtotal >= 50 ? 'Free' : '$9.99'}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold gradient-text">
                      ${(cart.totalPrice + (cart.subtotal < 50 ? 9.99 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {cart.subtotal < 50 && (
                <p className="text-xs text-muted-foreground mb-4">
                  Add ${(50 - cart.subtotal).toFixed(2)} more for free shipping
                </p>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base">
                    Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/shop" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-white/10 hover:bg-white/5 text-base"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Free shipping on orders over $50
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> 30-day money-back guarantee
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
