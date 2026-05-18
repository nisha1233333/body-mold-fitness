'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: Package },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* User Info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-white/5"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 bg-white/[0.02] min-h-screen sticky top-0">
          <SidebarContent />
        </aside>

        {/* Mobile Header + Sheet */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-background/80 backdrop-blur-xl border-b border-white/10 flex items-center px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/5">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-background">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <Link
            href="/dashboard"
            className="ml-3 text-sm font-semibold gradient-text"
          >
            Dashboard
          </Link>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:ml-0 mt-14 lg:mt-0">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
