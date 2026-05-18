export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price: number;
  category_id: string;
  image_url: string;
  images: string[];
  ingredients: string;
  nutrition_facts: Record<string, string>;
  benefits: string[];
  rating: number;
  review_count: number;
  stock: number;
  sku: string;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  is_verified: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  coupon_id: string | null;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  payment_method: string;
  payment_status: string;
  stripe_session_id: string;
  tracking_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  tags: string[];
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  role: string;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}
