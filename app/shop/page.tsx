'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X, Grid3x3 as Grid3X3, LayoutGrid, Package } from 'lucide-react';

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $75', min: 50, max: 75 },
  { label: '$75+', min: 75, max: null },
];

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true);

      // Category filter
      if (categorySlug) {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (catData) {
          query = query.eq('category_id', catData.id);
        }
      }

      // Search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Price range filter
      if (selectedPriceRange !== null) {
        const range = PRICE_RANGES[selectedPriceRange];
        query = query.gte('price', range.min);
        if (range.max !== null) {
          query = query.lt('price', range.max);
        }
      }

      // Sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('is_featured', { ascending: false });
          break;
      }

      const { data } = await query;
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categorySlug, sortBy, selectedPriceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update local search when URL param changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch.trim()) {
      params.set('search', localSearch.trim());
    } else {
      params.delete('search');
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug && slug !== 'all') {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSortBy('featured');
    setSelectedPriceRange(null);
    setLocalSearch('');
    router.push('/shop');
  };

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  const hasActiveFilters = searchQuery || categorySlug || selectedPriceRange !== null || sortBy !== 'featured';

  const activePriceRange = selectedPriceRange !== null ? PRICE_RANGES[selectedPriceRange] : null;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              Shop <span className="gradient-text">Supplements</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Premium, science-backed formulas to fuel your performance and accelerate your transformation.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products, ingredients, categories..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/10 backdrop-blur-xl text-base placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('search');
                    router.push(`/shop?${params.toString()}`);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-white/10">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-white/10 hover:bg-white/5"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Product count */}
            {!loading && (
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{products.length}</span>{' '}
                {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}

            {/* Active filter pills */}
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                {activeCategory.name}
                <button onClick={() => handleCategoryChange('all')} className="hover:text-primary/80">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => {
                    setLocalSearch('');
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('search');
                    router.push(`/shop?${params.toString()}`);
                  }}
                  className="hover:text-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activePriceRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                {activePriceRange.label}
                <button
                  onClick={() => setSelectedPriceRange(null)}
                  className="hover:text-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Sort by</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-sm h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-white/10">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8 mt-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                      !categorySlug
                        ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        categorySlug === cat.slug
                          ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
                  Price Range
                </h3>
                <div className="space-y-1">
                  {PRICE_RANGES.map((range, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedPriceRange === i
                          ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick info */}
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4 text-primary" />
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4 text-primary" />
                  <span>3rd-party tested</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Panel */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-white/10 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mobile Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                      Categories
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          handleCategoryChange('all');
                          setMobileFiltersOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                          !categorySlug
                            ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            handleCategoryChange(cat.slug);
                            setMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                            categorySlug === cat.slug
                              ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Price Range */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                      Price Range
                    </h3>
                    <div className="space-y-1">
                      {PRICE_RANGES.map((range, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedPriceRange(selectedPriceRange === i ? null : i);
                            setMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                            selectedPriceRange === i
                              ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Clear All */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      className="w-full border-white/10 hover:bg-white/5"
                      onClick={() => {
                        clearAllFilters();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find what you are looking for.
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearAllFilters}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <div className="relative py-16 sm:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto mb-8" />
              <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
            <ProductGridSkeleton />
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
