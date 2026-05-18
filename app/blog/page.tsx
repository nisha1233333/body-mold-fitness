'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User } from 'lucide-react';

const CATEGORIES = ['All', 'Fitness', 'Nutrition', 'Supplements', 'Recovery'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        if (data) setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            The Body Mold <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Expert insights on fitness, nutrition, supplements, and recovery to help
            you train smarter and live better.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/5 border-white/10 backdrop-blur-xl text-base placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card overflow-hidden animate-pulse">
                  <div className="aspect-video bg-white/5" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-20 bg-white/5 rounded" />
                    <div className="h-6 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Try adjusting your search or category filter to find what you are
                looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="border-white/10 hover:bg-white/5"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-8">
                Showing <span className="text-foreground font-semibold">{filteredPosts.length}</span>{' '}
                {filteredPosts.length === 1 ? 'article' : 'articles'}
                {activeCategory !== 'All' && (
                  <span> in <span className="text-primary font-medium">{activeCategory}</span></span>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="glass-card overflow-hidden hover:border-primary/30 transition-colors h-full flex flex-col">
                      {/* Image */}
                      <div className="aspect-video overflow-hidden bg-white/5">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <span className="text-4xl font-bold text-primary/20">BM</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Category */}
                        <span className="inline-block self-start px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
                          {post.category}
                        </span>

                        <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-white/10">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
