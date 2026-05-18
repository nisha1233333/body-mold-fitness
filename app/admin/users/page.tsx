'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Users, Shield, ShieldCheck } from 'lucide-react';

interface UserWithOrders extends Profile {
  order_count: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithOrders[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithOrders[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState<string | null>(null);

  // Role change confirmation
  const [roleChangeTarget, setRoleChangeTarget] = useState<UserWithOrders | null>(null);
  const [newRole, setNewRole] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch order counts for each user
      const usersWithOrders: UserWithOrders[] = await Promise.all(
        (profiles ?? []).map(async (profile: Profile) => {
          const { count } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id);
          return { ...profile, order_count: count ?? 0 };
        })
      );

      setUsers(usersWithOrders);
      setFilteredUsers(usersWithOrders);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  function confirmRoleChange(user: UserWithOrders, role: string) {
    if (role === user.role) return;
    setRoleChangeTarget(user);
    setNewRole(role);
  }

  async function handleRoleChange() {
    if (!roleChangeTarget || !newRole) return;
    setRoleLoading(roleChangeTarget.id);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', roleChangeTarget.id);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === roleChangeTarget.id ? { ...u, role: newRole } : u
        )
      );
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.id === roleChangeTarget.id ? { ...u, role: newRole } : u
        )
      );
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setRoleLoading(null);
      setRoleChangeTarget(null);
      setNewRole('');
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage customer accounts and roles.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/[0.02] border-white/10"
        />
      </div>

      {/* Users Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-white/5 animate-pulse rounded" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No users found</h3>
              <p className="text-sm text-muted-foreground">
                {search ? 'Try a different search term.' : 'Users will appear here when they register.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-primary">
                              {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {user.full_name || 'Unnamed'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="min-w-[120px]"
                      >
                        <Select
                          value={user.role || 'customer'}
                          onValueChange={(value) => confirmRoleChange(user, value)}
                        >
                          <SelectTrigger
                            className={`h-8 text-xs border-0 ${
                              user.role === 'admin'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                            disabled={roleLoading === user.id}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">
                              <span className="flex items-center gap-2">
                                <Shield className="h-3 w-3" />
                                Customer
                              </span>
                            </SelectItem>
                            <SelectItem value="admin">
                              <span className="flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" />
                                Admin
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                      >
                        {user.order_count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Change Confirmation */}
      <AlertDialog
        open={!!roleChangeTarget}
        onOpenChange={(open) => !open && setRoleChangeTarget(null)}
      >
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change{' '}
              <span className="font-semibold text-foreground">
                {roleChangeTarget?.full_name || roleChangeTarget?.email}
              </span>
              &rsquo;s role from{' '}
              <span className="font-semibold text-foreground">
                {roleChangeTarget?.role || 'customer'}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-foreground">{newRole}</span>?
              {newRole === 'admin' && (
                <span className="block mt-2 text-amber-400">
                  Warning: This will grant the user full administrative access to the system.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChange}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
