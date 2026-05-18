'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          setOrders(data ?? []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Order History</h1>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-white/5 rounded" />
                <div className="h-3 w-28 bg-white/5 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-5 w-20 bg-white/5 rounded-full" />
                <div className="h-4 w-16 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order History</h1>
        <p className="text-muted-foreground mt-1">
          View and track all your orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You have not placed any orders yet. Start shopping to see your order history here.
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const items = order.order_items ?? [];
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <Card key={order.id} className="glass-card overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Header */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-sm font-semibold">
                          #{order.order_number}
                        </p>
                        <Badge
                          className={`text-xs ${
                            STATUS_COLORS[order.status] ??
                            'bg-secondary text-secondary-foreground'
                          }`}
                          variant="outline"
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span>{formatDate(order.created_at)}</span>
                        <span>&middot;</span>
                        <span>{itemCount} item(s)</span>
                        {order.tracking_number && (
                          <>
                            <span>&middot;</span>
                            <span className="text-primary">
                              Tracking: {order.tracking_number}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm font-bold">
                        ${order.total.toFixed(2)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Order Detail (Expandable) */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-5 bg-white/[0.02]">
                      <div className="grid gap-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="h-14 w-14 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm font-semibold">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount</span>
                            <span className="text-emerald-400">-${order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>
                            {order.shipping_cost === 0
                              ? 'Free'
                              : `$${order.shipping_cost.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-muted-foreground mb-1">
                            Shipping Address
                          </p>
                          <p className="text-sm">
                            {order.shipping_address.full_name}
                            {order.shipping_address.address_line1 &&
                              `, ${order.shipping_address.address_line1}`}
                            {order.shipping_address.city &&
                              `, ${order.shipping_address.city}`}
                            {order.shipping_address.state &&
                              `, ${order.shipping_address.state}`}
                            {order.shipping_address.postal_code &&
                              ` ${order.shipping_address.postal_code}`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
