'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, ShoppingCart, ChevronDown, ChevronUp, Truck } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

interface OrderWithProfile extends Order {
  profiles: { full_name: string; email: string } | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithProfile[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles!orders_user_id_fkey(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as OrderWithProfile[]) ?? []);
      setFilteredOrders((data as OrderWithProfile[]) ?? []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = orders.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.profiles?.full_name?.toLowerCase().includes(q) ||
        o.profiles?.email?.toLowerCase().includes(q)
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  async function fetchOrderItems(orderId: string) {
    if (orderItems[orderId]) return;
    try {
      const { data } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      if (data) {
        setOrderItems((prev) => ({ ...prev, [orderId]: data }));
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  }

  function toggleExpand(orderId: string) {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      fetchOrderItems(orderId);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setStatusLoading(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setFilteredOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setStatusLoading(null);
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track customer orders.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order number, customer name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/[0.02] border-white/10"
        />
      </div>

      {/* Orders Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-white/5 animate-pulse rounded" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No orders found</h3>
              <p className="text-sm text-muted-foreground">
                {search ? 'Try a different search term.' : 'Orders will appear here when customers make purchases.'}
              </p>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => toggleExpand(order.id)}
                      >
                        <TableCell>
                          {expandedOrder === order.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          #{order.order_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{order.profiles?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{order.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="min-w-[140px]"
                          >
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger
                                className={`h-8 text-xs border-0 ${
                                  STATUS_COLORS[order.status] || ''
                                }`}
                                disabled={statusLoading === order.id}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${order.total.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Expanded Order Detail */}
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-white/[0.01] p-0">
                            <div className="p-6 space-y-4">
                              {/* Order Info Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Payment Method</p>
                                  <p className="text-sm font-medium">{order.payment_method || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Payment Status</p>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs mt-1 ${
                                      order.payment_status === 'paid'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}
                                  >
                                    {order.payment_status
                                      ? order.payment_status.charAt(0).toUpperCase() +
                                        order.payment_status.slice(1)
                                      : 'N/A'}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Tracking Number</p>
                                  <p className="text-sm font-medium">
                                    {order.tracking_number || (
                                      <span className="text-muted-foreground">Not set</span>
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Order Date</p>
                                  <p className="text-sm font-medium">{formatDateTime(order.created_at)}</p>
                                </div>
                              </div>

                              {/* Shipping Address */}
                              {order.shipping_address && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
                                  <p className="text-sm">
                                    {order.shipping_address.full_name}
                                    {order.shipping_address.address_line1 &&
                                      `, ${order.shipping_address.address_line1}`}
                                    {order.shipping_address.address_line2 &&
                                      `, ${order.shipping_address.address_line2}`}
                                    {order.shipping_address.city &&
                                      `, ${order.shipping_address.city}`}
                                    {order.shipping_address.state &&
                                      `, ${order.shipping_address.state}`}
                                    {order.shipping_address.postal_code &&
                                      ` ${order.shipping_address.postal_code}`}
                                  </p>
                                </div>
                              )}

                              {/* Order Items */}
                              <div>
                                <p className="text-xs text-muted-foreground mb-2">Items</p>
                                {orderItems[order.id] ? (
                                  <div className="space-y-2">
                                    {orderItems[order.id].map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
                                      >
                                        <div className="flex items-center gap-3">
                                          {item.product_image && (
                                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                              <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="h-10 w-10 object-cover"
                                              />
                                            </div>
                                          )}
                                          <div>
                                            <p className="text-sm font-medium">{item.product_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                              Qty: {item.quantity} x ${item.price.toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-sm font-medium">
                                          ${(item.quantity * item.price).toFixed(2)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="animate-spin rounded-full h-3 w-3 border border-primary border-t-transparent" />
                                    Loading items...
                                  </div>
                                )}
                              </div>

                              {/* Order Totals */}
                              <div className="border-t border-white/10 pt-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-sm mt-1">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-emerald-400">-${order.discount.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm mt-1">
                                  <span className="text-muted-foreground">Shipping</span>
                                  <span>${order.shipping_cost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                  <span className="text-muted-foreground">Tax</span>
                                  <span>${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-white/10">
                                  <span>Total</span>
                                  <span>${order.total.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Notes */}
                              {order.notes && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                                  <p className="text-sm">{order.notes}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
