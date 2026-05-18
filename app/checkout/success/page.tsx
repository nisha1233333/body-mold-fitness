'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleCheck as CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 w-full">
        <div className="glass-card p-8 sm:p-12 text-center">
          {/* Success Animation */}
          <div
            className={`transition-all duration-700 ease-out ${
              animated
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-50'
            }`}
          >
            <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6 animate-float">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Confirmation Message */}
          <div
            className={`transition-all duration-700 ease-out delay-200 ${
              animated
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              Order <span className="gradient-text">Confirmed!</span>
            </h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Thank you for your purchase! Your order has been received and is being processed. You will receive a confirmation email shortly.
            </p>
          </div>

          {/* Order Number */}
          <div
            className={`transition-all duration-700 ease-out delay-300 ${
              animated
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {orderNumber && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Order Number
                </p>
                <p className="text-lg font-bold text-primary tracking-wide">
                  {orderNumber}
                </p>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div
            className={`transition-all duration-700 ease-out delay-400 ${
              animated
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3 mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium">What&apos;s Next?</p>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll prepare your order and send shipping updates to your email. Most orders ship within 1-2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div
            className={`transition-all duration-700 ease-out delay-500 ${
              animated
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
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
          </div>
        </div>
      </div>
    </div>
  );
}
