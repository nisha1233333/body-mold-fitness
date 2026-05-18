'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Address } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Plus, Pencil, Trash2, Star, Loader as Loader2 } from 'lucide-react';

const EMPTY_ADDRESS = {
  label: '',
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'US',
  is_default: false,
};

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchAddresses() {
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user!.id)
          .order('is_default', { ascending: false });

        if (error) {
          console.error('Error fetching addresses:', error);
        } else {
          setAddresses(data ?? []);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, [user]);

  const openAddDialog = () => {
    setEditingAddress(null);
    setFormData(EMPTY_ADDRESS);
    setError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setError(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user) return;

    const requiredFields = ['full_name', 'address_line1', 'city', 'state', 'postal_code'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in the ${field.replace('_', ' ')} field.`);
        return;
      }
    }

    setSaving(true);
    setError(null);

    try {
      // If this is set as default, unset other defaults
      if (formData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('is_default', true);
      }

      if (editingAddress) {
        // Update existing address
        const { error: updateError } = await supabase
          .from('addresses')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAddress.id);

        if (updateError) {
          setError(updateError.message);
        } else {
          setAddresses((prev) =>
            prev.map((a) =>
              a.id === editingAddress.id
                ? { ...a, ...formData }
                : formData.is_default
                ? { ...a, is_default: false }
                : a
            )
          );
          setDialogOpen(false);
        }
      } else {
        // Create new address
        const { data, error: insertError } = await supabase
          .from('addresses')
          .insert({
            ...formData,
            user_id: user.id,
          })
          .select()
          .single();

        if (insertError) {
          setError(insertError.message);
        } else if (data) {
          setAddresses((prev) => {
            const updated = formData.is_default
              ? prev.map((a) => ({ ...a, is_default: false }))
              : prev;
            return [...updated, data as Address];
          });
          setDialogOpen(false);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (deleteError) {
        console.error('Error deleting address:', deleteError);
      } else {
        setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      }
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    try {
      // Unset all defaults
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);

      // Set new default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (!error) {
        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            is_default: a.id === addressId,
          }))
        );
      }
    } catch (err) {
      console.error('Error setting default address:', err);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse space-y-3">
              <div className="h-4 w-24 bg-white/5 rounded" />
              <div className="h-3 w-40 bg-white/5 rounded" />
              <div className="h-3 w-32 bg-white/5 rounded" />
              <div className="h-3 w-20 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
          <p className="text-muted-foreground mt-1">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved addresses</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add a shipping address to speed up your checkout process.
            </p>
            <Button
              onClick={openAddDialog}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`glass-card transition-all duration-300 ${
                address.is_default
                  ? 'border-primary/30 ring-1 ring-primary/20'
                  : 'hover:border-white/20'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {address.label || 'Address'}
                    </span>
                    {address.is_default && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        <Star className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
                      onClick={() => openEditDialog(address)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="text-foreground font-medium">{address.full_name}</p>
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  {address.phone && <p>{address.phone}</p>}
                </div>

                {!address.is_default && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <Star className="h-3 w-3 mr-1.5" />
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? 'Update the address details below.'
                : 'Enter the details for your new shipping address.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="Home, Office, etc."
                  value={formData.label}
                  onChange={(e) => updateField('label', e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line1">Address Line 1 *</Label>
              <Input
                id="address_line1"
                placeholder="123 Main St"
                value={formData.address_line1}
                onChange={(e) => updateField('address_line1', e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line2">Address Line 2</Label>
              <Input
                id="address_line2"
                placeholder="Apt, Suite, Unit, etc."
                value={formData.address_line2}
                onChange={(e) => updateField('address_line2', e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">ZIP Code *</Label>
                <Input
                  id="postal_code"
                  placeholder="10001"
                  value={formData.postal_code}
                  onChange={(e) => updateField('postal_code', e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="US"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => updateField('is_default', e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm">Set as default address</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
