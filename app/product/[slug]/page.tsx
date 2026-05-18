'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product, Review } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Star, Heart, ShoppingCart, Minus, Plus, CircleCheck as CheckCircle2, ChevronRight, Shield, Truck, RotateCcw, BadgeCheck, Package, MessageSquarePlus, ThumbsUp, ImageOff } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-5 w-80 mb-8" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          {/* Info skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-10 w-140" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="space-y-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-2/3" />
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Skeleton className="h-12 w-48 rounded-lg" />
              <Skeleton className="h-12 w-36 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="mt-16 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <div className="mt-16 space-y-4">
          <Skeleton className="h-8 w-48" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Not Found                                                          */
/* ------------------------------------------------------------------ */
function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-12 text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ImageOff className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/shop">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Star Rating Component                                              */
/* ------------------------------------------------------------------ */
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : i < rating
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { user, profile } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Image gallery state
  const [selectedImage, setSelectedImage] = useState(0);

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Fetch product, reviews, and related products                    */
  /* ---------------------------------------------------------------- */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch product by slug with category
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', params.slug)
        .eq('is_active', true)
        .single();

      if (productError || !productData) {
        setNotFound(true);
        return;
      }

      setProduct(productData);

      // Fetch reviews for this product
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productData.id)
        .order('created_at', { ascending: false });

      if (reviewsData) setReviews(reviewsData);

      // Fetch related products (same category, exclude current)
      if (productData.category_id) {
        const { data: relatedData } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('category_id', productData.category_id)
          .eq('is_active', true)
          .neq('id', productData.id)
          .limit(4);

        if (relatedData) setRelatedProducts(relatedData);
      }

      // Check wishlist
      if (user) {
        const { data: wishData } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productData.id)
          .maybeSingle();
        setIsWishlisted(!!wishData);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [params.slug, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------------------------------------------------------- */
  /*  Derived values                                                  */
  /* ---------------------------------------------------------------- */
  const discount =
    product && product.compare_price > 0
      ? Math.round(
          ((product.compare_price - product.price) / product.compare_price) * 100
        )
      : 0;

  const stockStatus = product
    ? product.stock === 0
      ? 'out_of_stock'
      : product.stock <= 5
      ? 'low_stock'
      : 'in_stock'
    : 'in_stock';

  const stockLabel = {
    in_stock: 'In Stock',
    low_stock: `Low Stock (${product?.stock} left)`,
    out_of_stock: 'Out of Stock',
  }[stockStatus];

  const stockColor = {
    in_stock: 'text-emerald-400',
    low_stock: 'text-amber-400',
    out_of_stock: 'text-destructive',
  }[stockStatus];

  const stockDot = {
    in_stock: 'bg-emerald-400',
    low_stock: 'bg-amber-400',
    out_of_stock: 'bg-destructive',
  }[stockStatus];

  const allImages = product
    ? [product.image_url, ...(product.images || [])].filter(Boolean)
    : [];

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product?.rating ?? 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                        */
  /* ---------------------------------------------------------------- */
  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    addItem(product, quantity);
    router.push('/cart');
  };

  const handleToggleWishlist = async () => {
    if (!user || !product) return;
    try {
      if (isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        setIsWishlisted(false);
      } else {
        await supabase.from('wishlist').upsert({
          user_id: user.id,
          product_id: product.id,
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: product.id,
        user_id: user.id,
        user_name: profile?.full_name || user.email?.split('@')[0] || 'Anonymous',
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        images: [],
        is_verified: !!profile,
      });

      if (!error) {
        setReviewTitle('');
        setReviewComment('');
        setReviewRating(5);
        setReviewSubmitted(true);
        // Refresh reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', product.id)
          .order('created_at', { ascending: false });
        if (reviewsData) setReviews(reviewsData);
        setTimeout(() => setReviewSubmitted(false), 3000);
      }
    } catch (err) {
      console.error('Review submission error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /* ---------------------------------------------------------------- */
  /*  Loading & Not Found states                                      */
  /* ---------------------------------------------------------------- */
  if (loading) return <ProductDetailSkeleton />;
  if (notFound || !product) return <ProductNotFound />;

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {product.category && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/shop?category=${product.category.slug}`}>
                      {product.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ---------------------------------------------------------------- */}
        {/*  Product Main Section                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="glass-card overflow-hidden rounded-xl aspect-square relative group">
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                  <ImageOff className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-bold px-3 py-1.5 rounded-lg">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-white/10 hover:border-white/25 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Tag */}
            {product.category && (
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/15 transition-colors"
              >
                {product.category.name}
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* Rating + Review Count */}
            <div className="flex items-center gap-3 flex-wrap">
              <StarRating rating={avgRating} size="md" />
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_price > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    Save {discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${stockDot}`} />
              <span className={`text-sm font-medium ${stockColor}`}>{stockLabel}</span>
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.short_description}
            </p>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity + Add to Cart + Buy Now + Wishlist */}
            <div className="pt-4 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                <div className="flex items-center glass-card overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold border-x border-white/10">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="h-10 w-10 flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-40"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base font-semibold"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground h-14 text-base font-semibold border border-white/10"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-14 border-white/10 hover:bg-white/5 shrink-0"
                  onClick={handleToggleWishlist}
                  disabled={!user}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isWishlisted
                        ? 'text-red-500 fill-red-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </div>

              {!user && (
                <p className="text-xs text-muted-foreground">
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Sign in
                  </Link>{' '}
                  to add items to your wishlist.
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="glass-card p-3 text-center">
                <Truck className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-xs text-muted-foreground">Free Shipping $50+</p>
              </div>
              <div className="glass-card p-3 text-center">
                <Shield className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-xs text-muted-foreground">3rd Party Tested</p>
              </div>
              <div className="glass-card p-3 text-center">
                <RotateCcw className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-xs text-muted-foreground">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Ingredients Section                                             */}
        {/* ---------------------------------------------------------------- */}
        {product.ingredients && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
            <div className="glass-card p-6 sm:p-8">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.ingredients}
              </p>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*  Nutrition Facts Table                                           */}
        {/* ---------------------------------------------------------------- */}
        {product.nutrition_facts &&
          Object.keys(product.nutrition_facts).length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Nutrition Facts</h2>
              <div className="glass-card overflow-hidden max-w-md">
                <div className="bg-white/5 px-6 py-3 border-b border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Nutrition Facts
                  </h3>
                </div>
                <div className="border-b-2 border-white/20 px-6 py-2">
                  <p className="text-xs text-muted-foreground">Serving Size: As directed</p>
                </div>
                <div className="border-b border-white/10 px-6 py-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Amount Per Serving</span>
                  </div>
                </div>
                {Object.entries(product.nutrition_facts).map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex justify-between px-6 py-2.5 text-sm border-b border-white/5 ${
                      i % 2 === 0 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                <div className="px-6 py-3 bg-white/[0.02]">
                  <p className="text-xs text-muted-foreground italic">
                    * Percent Daily Values are based on a 2,000 calorie diet.
                  </p>
                </div>
              </div>
            </section>
          )}

        {/* ---------------------------------------------------------------- */}
        {/*  Description - Full                                              */}
        {/* ---------------------------------------------------------------- */}
        {product.description && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Product Description</h2>
            <div className="glass-card p-6 sm:p-8">
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*  Reviews Section                                                 */}
        {/* ---------------------------------------------------------------- */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5"
                onClick={() =>
                  document.getElementById('review-form')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            )}
          </div>

          {/* Rating Summary */}
          <div className="glass-card p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Overall Rating */}
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold mb-2">{avgRating.toFixed(1)}</div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <StarRating rating={avgRating} size="md" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-4 text-right">{star}</span>
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review List */}
          {reviews.length > 0 ? (
            <div className="space-y-4 mb-10">
              {reviews.map((review) => (
                <div key={review.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {review.user_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{review.user_name}</span>
                          {review.is_verified && (
                            <BadgeCheck className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-sm mb-1.5">{review.title}</h4>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                  {review.is_verified && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified Purchase
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center mb-10">
              <MessageSquarePlus className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}

          {/* Write a Review Form */}
          {user ? (
            <div id="review-form" className="glass-card p-6 sm:p-8">
              <h3 className="text-lg font-bold mb-6">Write a Review</h3>

              {reviewSubmitted && (
                <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-emerald-400 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Thank you! Your review has been submitted.
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Star Rating Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Rating</label>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            i < reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-muted-foreground/30 hover:text-amber-400/50'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {reviewRating} of 5
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Review Title</label>
                  <Input
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="bg-white/5 border-white/10 placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
                    required
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell others about your experience with this product..."
                    rows={4}
                    className="bg-white/5 border-white/10 placeholder:text-muted-foreground/50 focus-visible:ring-primary/50 resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={submittingReview || !reviewTitle.trim() || !reviewComment.trim()}
                >
                  {submittingReview ? (
                    'Submitting...'
                  ) : (
                    <>
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Please sign in to write a review.
              </p>
              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/*  Related Products                                                */}
        {/* ---------------------------------------------------------------- */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Related Products</h2>
                <p className="text-muted-foreground text-sm">
                  More from {product.category?.name || 'this category'}
                </p>
              </div>
              <Link href={`/shop?category=${product.category?.slug || ''}`}>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
