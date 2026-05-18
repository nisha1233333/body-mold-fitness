'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Search, Plus, Pencil, Trash2, Package } from 'lucide-react';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  compare_price: string;
  category_id: string;
  image_url: string;
  ingredients: string;
  benefits: string;
  stock: string;
  sku: string;
  is_featured: boolean;
  is_active: boolean;
}

const emptyForm: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  short_description: '',
  price: '',
  compare_price: '',
  category_id: '',
  image_url: '',
  ingredients: '',
  benefits: '',
  stock: '',
  sku: '',
  is_featured: false,
  is_active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data ?? []);
      setFilteredProducts(data ?? []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      setCategories(data ?? []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function openAddDialog() {
    setEditingProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price.toString(),
      compare_price: product.compare_price?.toString() || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      ingredients: product.ingredients || '',
      benefits: (product.benefits || []).join('\n'),
      stock: product.stock?.toString() || '0',
      sku: product.sku || '',
      is_featured: product.is_featured ?? false,
      is_active: product.is_active ?? true,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || generateSlug(form.name),
        description: form.description,
        short_description: form.short_description,
        price: parseFloat(form.price) || 0,
        compare_price: parseFloat(form.compare_price) || 0,
        category_id: form.category_id || null,
        image_url: form.image_url,
        ingredients: form.ingredients,
        benefits: form.benefits
          .split('\n')
          .map((b) => b.trim())
          .filter(Boolean),
        stock: parseInt(form.stock) || 0,
        sku: form.sku,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };

      let error;
      if (editingProduct) {
        ({ error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id));
      } else {
        ({ error } = await supabase.from('products').insert([payload]));
      }

      if (error) throw error;
      setDialogOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteTarget.id);
      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleteTarget(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog.
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/[0.02] border-white/10"
        />
      </div>

      {/* Products Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-white/5 animate-pulse rounded" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground">
                {search ? 'Try a different search term.' : 'Add your first product to get started.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm font-medium">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compare_price > product.price && (
                          <span className="text-xs text-muted-foreground line-through ml-1">
                            ${product.compare_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          product.stock === 0
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : product.stock < 10
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.is_active ? (
                          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-gray-500/10 text-gray-400 border-gray-500/20">
                            Inactive
                          </Badge>
                        )}
                        {product.is_featured && (
                          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/5"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update the product details below.'
                : 'Fill in the details to create a new product.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) });
                  }}
                  placeholder="Product name"
                  className="bg-white/[0.02] border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="product-slug"
                  className="bg-white/[0.02] border-white/10"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                placeholder="Brief product description"
                className="bg-white/[0.02] border-white/10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Full product description"
                rows={3}
                className="bg-white/[0.02] border-white/10"
              />
            </div>

            {/* Price & Compare Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="bg-white/[0.02] border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compare_price">Compare Price ($)</Label>
                <Input
                  id="compare_price"
                  type="number"
                  step="0.01"
                  value={form.compare_price}
                  onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
                  placeholder="0.00"
                  className="bg-white/[0.02] border-white/10"
                />
              </div>
            </div>

            {/* Category & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(value) => setForm({ ...form, category_id: value })}
                >
                  <SelectTrigger className="bg-white/[0.02] border-white/10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="SKU-001"
                  className="bg-white/[0.02] border-white/10"
                />
              </div>
            </div>

            {/* Stock & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className="bg-white/[0.02] border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/[0.02] border-white/10"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                placeholder="List of ingredients"
                rows={2}
                className="bg-white/[0.02] border-white/10"
              />
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea
                id="benefits"
                value={form.benefits}
                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                rows={3}
                className="bg-white/[0.02] border-white/10"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                />
                <Label>Featured</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="hover:bg-white/5">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name || !form.price}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

