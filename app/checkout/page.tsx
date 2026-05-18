'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';

interface ShippingForm {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const { user, profile, loading: authLoading } = useAuth();

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [shipping, setShipping] = useState<ShippingForm>({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  const [billing, setBilling] = useState<ShippingForm>({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Pre-fill from user profile
  useEffect(() => {
    if (profile) {
      setShipping(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
      }));
    } else if (user) {
      setShipping(prev => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [profile, user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && cart.items.length === 0) {
      router.push('/cart');
    }
  }, [authLoading, cart.items.length, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  const shippingCost = cart.subtotal >= 50 ? 0 : 9.99;
  const taxRate = 0.08;
  const taxableAmount = cart.subtotal - cart.discount + shippingCost;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Shipping validation
    if (!shipping.full_name.trim()) newErrors.shipping_full_name = 'Full name is required';
    if (!shipping.email.trim()) {
      newErrors.shipping_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      newErrors.shipping_email = 'Invalid email address';
    }
    if (!shipping.phone.trim()) {
      newErrors.shipping_phone = 'Phone is required';
    } else if (!/^[\d\s\-+()]{7,}$/.test(shipping.phone)) {
      newErrors.shipping_phone = 'Invalid phone number';
    }
    if (!shipping.address_line1.trim()) newErrors.shipping_address_line1 = 'Address is required';
    if (!shipping.city.trim()) newErrors.shipping_city = 'City is required';
    if (!shipping.state.trim()) newErrors.shipping_state = 'State is required';
    if (!shipping.postal_code.trim()) newErrors.shipping_postal_code = 'Postal code is required';
    if (!shipping.country.trim()) newErrors.shipping_country = 'Country is required';

    // Billing validation (only if different from shipping)
    if (!billingSameAsShipping) {
      if (!billing.full_name.trim()) newErrors.billing_full_name = 'Full name is required';
      if (!billing.email.trim()) {
        newErrors.billing_email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) {
        newErrors.billing_email = 'Invalid email address';
      }
      if (!billing.phone.trim()) newErrors.billing_phone = 'Phone is required';
      if (!billing.address_line1.trim()) newErrors.billing_address_line1 = 'Address is required';
      if (!billing.city.trim()) newErrors.billing_city = 'City is required';
      if (!billing.state.trim()) newErrors.billing_state = 'State is required';
      if (!billing.postal_code.trim()) newErrors.billing_postal_code = 'Postal code is required';
      if (!billing.country.trim()) newErrors.billing_country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BM-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const shippingAddress = {
        full_name: shipping.full_name,
        email: shipping.email,
        phone: shipping.phone,
        address_line1: shipping.address_line1,
        address_line2: shipping.address_line2,
        city: shipping.city,
        state: shipping.state,
        postal_code: shipping.postal_code,
        country: shipping.country,
      };

      const billingAddress = billingSameAsShipping
        ? { ...shippingAddress }
        : {
            full_name: billing.full_name,
            email: billing.email,
            phone: billing.phone,
            address_line1: billing.address_line1,
            address_line2: billing.address_line2,
            city: billing.city,
            state: billing.state,
            postal_code: billing.postal_code,
            country: billing.country,
          };

      // Create order in supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          subtotal: cart.subtotal,
          discount: cart.discount,
          shipping_cost: shippingCost,
          tax: tax,
          total: total,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          payment_method: 'card',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        setSubmitError('Failed to create order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Insert order items
      const orderItems = cart.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        setSubmitError('Failed to save order items. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      // Clear cart and redirect to success
      cart.clearCart();
      router.push(`/checkout/success?order=${orderNumber}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleShippingChange = (field: keyof ShippingForm, value: string) => {
    setShipping(prev => ({ ...prev, [field]: value }));
    if (errors[`shipping_${field}`]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[`shipping_${field}`];
        return next;
      });
    }
  };

  const handleBillingChange = (field: keyof ShippingForm, value: string) => {
    setBilling(prev => ({ ...prev, [field]: value }));
    if (errors[`billing_${field}`]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[`billing_${field}`];
        return next;
      });
    }
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md mx-auto">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Don't render if cart is empty or user is not authenticated (redirects will fire)
  if (cart.items.length === 0 || !user) {
    return null;
  }

  return (
    <div className="min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Secure <span className="gradient-text">Checkout</span>
          </h1>
          <p className="text-muted-foreground">
            Complete your order below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="shipping_full_name" className="mb-1.5 block">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_full_name"
                      value={shipping.full_name}
                      onChange={(e) => handleShippingChange('full_name', e.target.value)}
                      placeholder="John Doe"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_full_name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_full_name && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_full_name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shipping_email" className="mb-1.5 block">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_email"
                      type="email"
                      value={shipping.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_email && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shipping_phone" className="mb-1.5 block">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_phone"
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_phone && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="shipping_address_line1" className="mb-1.5 block">
                      Address Line 1 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_address_line1"
                      value={shipping.address_line1}
                      onChange={(e) => handleShippingChange('address_line1', e.target.value)}
                      placeholder="123 Main St"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_address_line1 ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_address_line1 && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_address_line1}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="shipping_address_line2" className="mb-1.5 block">
                      Address Line 2
                    </Label>
                    <Input
                      id="shipping_address_line2"
                      value={shipping.address_line2}
                      onChange={(e) => handleShippingChange('address_line2', e.target.value)}
                      placeholder="Apt, Suite, Unit (optional)"
                      className="h-11 border-white/10 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_city" className="mb-1.5 block">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_city"
                      value={shipping.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      placeholder="New York"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_city ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_city && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shipping_state" className="mb-1.5 block">
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_state"
                      value={shipping.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      placeholder="NY"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_state ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_state && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_state}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shipping_postal_code" className="mb-1.5 block">
                      Postal Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_postal_code"
                      value={shipping.postal_code}
                      onChange={(e) => handleShippingChange('postal_code', e.target.value)}
                      placeholder="10001"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_postal_code ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_postal_code && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_postal_code}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shipping_country" className="mb-1.5 block">
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_country"
                      value={shipping.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      placeholder="US"
                      className={`h-11 border-white/10 bg-white/5 ${errors.shipping_country ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {errors.shipping_country && (
                      <p className="text-xs text-destructive mt-1">{errors.shipping_country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  Billing Information
                </h2>

                <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-white/5 border border-white/10">
                  <Checkbox
                    id="billing_same"
                    checked={billingSameAsShipping}
                    onCheckedChange={(checked) => setBillingSameAsShipping(checked === true)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="billing_same" className="cursor-pointer text-sm">
                    Billing address same as shipping
                  </Label>
                </div>

                {!billingSameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="billing_full_name" className="mb-1.5 block">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_full_name"
                        value={billing.full_name}
                        onChange={(e) => handleBillingChange('full_name', e.target.value)}
                        placeholder="John Doe"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_full_name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_full_name && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_full_name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_email" className="mb-1.5 block">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_email"
                        type="email"
                        value={billing.email}
                        onChange={(e) => handleBillingChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_email && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_phone" className="mb-1.5 block">
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_phone"
                        type="tel"
                        value={billing.phone}
                        onChange={(e) => handleBillingChange('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_phone && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_phone}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="billing_address_line1" className="mb-1.5 block">
                        Address Line 1 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_address_line1"
                        value={billing.address_line1}
                        onChange={(e) => handleBillingChange('address_line1', e.target.value)}
                        placeholder="123 Main St"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_address_line1 ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_address_line1 && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_address_line1}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="billing_address_line2" className="mb-1.5 block">
                        Address Line 2
                      </Label>
                      <Input
                        id="billing_address_line2"
                        value={billing.address_line2}
                        onChange={(e) => handleBillingChange('address_line2', e.target.value)}
                        placeholder="Apt, Suite, Unit (optional)"
                        className="h-11 border-white/10 bg-white/5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing_city" className="mb-1.5 block">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_city"
                        value={billing.city}
                        onChange={(e) => handleBillingChange('city', e.target.value)}
                        placeholder="New York"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_city ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_city && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_city}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_state" className="mb-1.5 block">
                        State <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_state"
                        value={billing.state}
                        onChange={(e) => handleBillingChange('state', e.target.value)}
                        placeholder="NY"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_state ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_state && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_state}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_postal_code" className="mb-1.5 block">
                        Postal Code <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_postal_code"
                        value={billing.postal_code}
                        onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                        placeholder="10001"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_postal_code ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_postal_code && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_postal_code}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="billing_country" className="mb-1.5 block">
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="billing_country"
                        value={billing.country}
                        onChange={(e) => handleBillingChange('country', e.target.value)}
                        placeholder="US"
                        className={`h-11 border-white/10 bg-white/5 ${errors.billing_country ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {errors.billing_country && (
                        <p className="text-xs text-destructive mt-1">{errors.billing_country}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  Payment Method
                </h2>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Credit / Debit Card</p>
                      <p className="text-xs text-muted-foreground">Secure payment via Stripe</p>
                    </div>
                  </div>
                </div>

                {/* Secure Indicators */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span>PCI DSS Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-secondary/50 shrink-0">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-white/10">
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
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold gradient-text">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {cart.subtotal < 50 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Add ${(50 - cart.subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                {/* Submit Error */}
                {submitError && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    {submitError}
                  </div>
                )}

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                {/* Secure Checkout Badges */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    Secure checkout with SSL encryption
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Your data is protected and never shared
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
