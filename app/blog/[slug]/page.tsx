'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Share2, Tag } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderContent(content: string) {
  // Split content by double newlines to create paragraphs
  // Handle basic formatting: headers (lines starting with #), bold (**text**), and paragraphs
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n');
      if (text.trim()) {
        elements.push(
          <p
            key={key++}
            className="text-muted-foreground leading-relaxed mb-4"
            dangerouslySetInnerHTML={{
              __html: text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>'),
            }}
          />
        );
      }
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      flushParagraph();
      elements.push(
        <h3 key={key++} className="text-xl font-semibold mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-2xl font-bold mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      flushParagraph();
      elements.push(
        <h1 key={key++} className="text-3xl font-bold mt-10 mb-4">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      elements.push(
        <li
          key={key++}
          className="text-muted-foreground leading-relaxed ml-6 list-disc mb-1"
          dangerouslySetInnerHTML={{
            __html: line
              .slice(2)
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>'),
          }}
        />
      );
    } else if (line.trim() === '') {
      flushParagraph();
    } else {
      currentParagraph.push(line);
    }
  }
  flushParagraph();

  return elements;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        if (data) {
          setPost(data);

          // Fetch related posts (same category, excluding current)
          const { data: related } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('is_published', true)
            .eq('category', data.category)
            .neq('id', data.id)
            .order('published_at', { ascending: false })
            .limit(3);

          if (related) setRelatedPosts(related);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchPost();
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch {
      // Fallback
      setShareMessage('Could not copy link');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-24 bg-white/5 rounded" />
            <div className="aspect-video bg-white/5 rounded-xl" />
            <div className="h-4 w-32 bg-white/5 rounded" />
            <div className="h-8 w-3/4 bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-2/3 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The blog post you are looking for does not exist or may have been removed.
          </p>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="glass-card overflow-hidden">
          {/* Featured Image */}
          {post.image_url && (
            <div className="aspect-video overflow-hidden bg-white/5">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-b border-white/10 pb-8">
              {post.excerpt}
            </p>

            {/* Content */}
            <div className="prose-invert max-w-none">
              {renderContent(post.content)}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Share this article</span>
              </div>
              <div className="flex items-center gap-3">
                {shareMessage && (
                  <span className="text-sm text-emerald-500">{shareMessage}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-white/10 hover:bg-white/5"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Related <span className="gradient-text">Articles</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`} className="group">
                  <article className="glass-card overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="aspect-video overflow-hidden bg-white/5">
                      {related.image_url ? (
                        <img
                          src={related.image_url}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-2xl font-bold text-primary/20">BM</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                        {related.category}
                      </span>
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(related.published_at)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
