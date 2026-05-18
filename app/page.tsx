'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category, BlogPost } from '@/lib/types';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import {
  Dumbbell, Flame, Zap, Shield, Truck, RotateCcw,
  Star, ChevronRight, ArrowRight, Mail, CircleCheck as CheckCircle2,
  ChevronDown, Award, Users, TrendingUp
} from 'lucide-react';

const faqs = [
  { q: 'What thickness belt do I need?', a: 'For powerlifting, 10-13mm is ideal. For CrossFit and functional training, 5-7.5mm is best. For general gym training, 6.5-10mm provides a good balance of support and comfort.' },
  { q: 'How do I know my belt size?', a: 'Measure around your natural waist (between bottom rib and hip bone) with a soft tape measure over your lifting clothes. Do not use your pants size. Check our sizing guide for details.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day satisfaction guarantee. If your belt does not fit or you are not happy, return it within 30 days for a full refund or exchange.' },
  { q: 'Lever or prong - which is better?', a: 'Lever belts are fastest to put on and take off. Prong belts offer more precise adjustment and are nearly indestructible. Both are IPF-approved. It comes down to personal preference.' },
  { q: 'Do you offer belt customization?', a: 'Yes! We offer custom embossing, color choices, and even custom sizing for an additional fee. Contact us for a custom belt quote.' },
];

const testimonials = [
  { name: 'Marcus Thompson', role: 'Elite Powerlifter', text: 'The Titan Pro Lever Belt is the best belt I have ever worn. The lever action is smooth and the leather is incredibly rigid. My squat went up 20lbs the first week.', rating: 5, avatar: 'MT' },
  { name: 'Sarah Kim', role: 'CrossFit Competitor', text: 'The FlexCore Velcro Belt is perfect for WODs. Quick on and off between movements and it holds tight through heavy deadlifts. Game changer.', rating: 5, avatar: 'SK' },
  { name: 'David Rodriguez', role: 'Strength Coach', text: 'I recommend Body Mold belts to all my athletes. The quality is consistent, the prices are fair, and the customer service is exceptional. A brand you can trust.', rating: 5, avatar: 'DR' },
  { name: 'Amanda Chen', role: 'Olympic Weightlifter', text: 'The Stealth Tapered Belt lets me hit full depth cleans without the belt digging in. The tapered design is perfect for snatches too. Outstanding quality.', rating: 5, avatar: 'AC' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const [prodRes, catRes, blogRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(*)').eq('is_featured', true).eq('is_active', true).limit(8),
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
      ]);
      if (prodRes.data) setFeaturedProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (blogRes.data) setBlogPosts(blogRes.data);
    }
    loadData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await supabase.from('newsletter_subscribers').upsert({ email });
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Gym Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Flame className="h-4 w-4" /> New Arrival - Heritage Full Grain Belt
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Lift Heavier. <span className="gradient-text">Train Harder.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Premium gym belts engineered for maximum support and durability. IPF-approved, competition-ready, and built to last a lifetime.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base">
                  Shop Belts <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tools/ai-recommender">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/20 hover:bg-white/5">
                  Find Your Belt
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Free Shipping $50+</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 30-Day Guarantee</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> IPF Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-primary/10 border-y border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-3 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium">SUMMER SALE: Use code <span className="text-primary font-bold">LIFT15</span> for 15% off all belts</span>
            <Link href="/shop" className="text-primary hover:underline font-medium ml-2">Shop Now <ChevronRight className="h-3 w-3 inline" /></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '50K+', label: 'Athletes Equipped' },
              { icon: Award, value: '4.8', label: 'Average Rating' },
              { icon: Star, value: '100+', label: 'Competition Wins' },
              { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
            <p className="text-muted-foreground">Find the perfect belt for your training style</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group glass-card p-6 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Belts</h2>
              <p className="text-muted-foreground">Our most popular belts chosen by athletes</p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="border-white/20 hover:bg-white/5">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Strongest Lifts Start Here</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 50,000+ athletes who trust Body Mold Fitness belts for maximum support. Every rep counts, every belt matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8">Shop Belts <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </Link>
            <Link href="/tools/bmi-calculator">
              <Button size="lg" variant="outline" className="h-12 px-8 border-white/20 hover:bg-white/5">BMI Calculator</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What Athletes Say</h2>
            <p className="text-muted-foreground">Real reviews from real lifters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'Free standard shipping on all orders over $50. Express options available.' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Every belt is hand-inspected and comes with a warranty against defects.' },
              { icon: RotateCcw, title: '30-Day Returns', desc: 'Not the right fit? Return within 30 days for a full refund or exchange.' },
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 text-center hover:border-primary/30 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">From the Blog</h2>
                <p className="text-muted-foreground">Expert insights on training, belts, and technique</p>
              </div>
              <Link href="/blog">
                <Button variant="outline" className="border-white/20 hover:bg-white/5">All Posts <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group glass-card overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-primary font-medium">{post.category}</span>
                    <h3 className="font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-secondary/30" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our gym belts</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="relative">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join the Body Mold Community</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Get exclusive deals, training tips, and new product alerts delivered to your inbox.</p>
              {subscribed ? (
                <div className="flex items-center justify-center gap-2 text-primary font-medium">
                  <CheckCircle2 className="h-5 w-5" /> You are subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 h-12 rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6">Subscribe</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
