'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import {
  Dumbbell, ShoppingCart, User, Search, Menu, X, Sun, Moon,
  Heart, LogOut, LayoutDashboard, Package
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <Dumbbell className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text">BODY MOLD</span>
                <span className="text-muted-foreground text-sm font-normal ml-1 hidden sm:inline">FITNESS</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link href="/wishlist" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors relative hidden sm:block" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>

              <Link href="/cart" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors relative" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card p-2 shadow-xl">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{isAdmin ? 'Admin' : 'Customer'}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5 transition-colors sm:hidden">
                        <Heart className="h-4 w-4" /> Wishlist
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5 transition-colors text-primary">
                          <Package className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5 transition-colors w-full text-destructive">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign In
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-white/10 bg-background/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form action="/shop" method="get" className="flex gap-2">
                <input
                  name="search"
                  type="text"
                  placeholder="Search gym belts, lever belts, prong belts..."
                  className="flex-1 h-10 rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <Button type="submit" size="sm">Search</Button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 w-72 h-full bg-background border-l border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold gradient-text">MENU</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 my-4" />
              {user ? (
                <>
                  <Link href="/dashboard" className="px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5">Dashboard</Link>
                  <Link href="/wishlist" className="px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5">Wishlist</Link>
                  {isAdmin && <Link href="/admin" className="px-4 py-3 rounded-lg text-sm text-primary hover:bg-primary/10">Admin Panel</Link>}
                  <button onClick={signOut} className="px-4 py-3 rounded-lg text-sm text-destructive hover:bg-destructive/10 text-left">Sign Out</button>
                </>
              ) : (
                <Link href="/auth/login" className="px-4 py-3 rounded-lg text-sm text-primary hover:bg-primary/10">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}