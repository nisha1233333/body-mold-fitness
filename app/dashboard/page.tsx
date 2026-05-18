'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Heart,
  Award,
  Settings,
  MapPin,
  ShoppingBag,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchDashboardData() {
      try {
        const [ordersRes, wishlistRes, recentOrdersRes] = await Promise.all([
          supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user!.id),
          supabase
            .from('wishlist')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user!.id),
          supabase
            .from('orders')
            .select('*')
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false })
            .limit(3),
        ]);

        setOrderCount(ordersRes.count ?? 0);
        setWishlistCount(wishlistRes.count ?? 0);
        setRecentOrders(recentOrdersRes.data ?? []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const quickStats = [
    {
      label: 'Total Orders',
      value: orderCount,
      icon: Package,
      href: '/dashboard/orders',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Wishlist Items',
      value: wishlistCount,
      icon: Heart,
      href: '/dashboard/wishlist',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
    {
      label: 'Loyalty Points',
      value: profile?.loyalty_points ?? 0,
      icon: Award,
      href: '/dashboard/profile',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  const quickActions = [
    {
      label: 'Order History',
      description: 'View all your orders',
      icon: ShoppingBag,
      href: '/dashboard/orders',
    },
    {
      label: 'Wishlist',
      description: 'Saved products',
      icon: Heart,
      href: '/dashboard/wishlist',
    },
    {
      label: 'Addresses',
      description: 'Manage shipping addresses',
      icon: MapPin,
      href: '/dashboard/addresses',
    },
    {
      label: 'Profile Settings',
      description: 'Update your info',
      icon: Settings,
      href: '/dashboard/profile',
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, <span className="gradient-text">{profile?.full_name || 'Athlete'}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is an overview of your account activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="glass-card hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">
                        {loading ? (
                          <span className="inline-block w-12 h-8 bg-white/5 animate-pulse rounded" />
                        ) : (
                          stat.value.toLocaleString()
                        )}
                      </p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/5 rounded" />
                    <div className="h-3 w-24 bg-white/5 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-white/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No orders yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start shopping to see your orders here.
              </p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} href="/dashboard/orders">
                <Card className="glass-card hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          #{order.order_number}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(order.created_at)} &middot; {order.order_items?.length ?? 0} item(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">
                          ${order.total.toFixed(2)}
                        </span>
                        <Badge
                          className={`text-xs ${
                            STATUS_COLORS[order.status] ?? 'bg-secondary text-secondary-foreground'
                          }`}
                          variant="outline"
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Card className="glass-card hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{action.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
