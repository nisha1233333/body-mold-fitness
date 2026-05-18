import React from 'react';
import Link from 'next/link';
import { Dumbbell, Mail, Phone, MapPin, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Lever Belts', href: '/shop?category=lever-belts' },
    { label: 'Prong Belts', href: '/shop?category=prong-belts' },
    { label: 'Velcro Belts', href: '/shop?category=velcro-belts' },
    { label: 'Leather Belts', href: '/shop?category=leather-belts' },
    { label: 'Accessories', href: '/shop?category=accessories' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/about' },
    { label: 'Affiliate Program', href: '/about' },
  ],
  support: [
    { label: 'FAQ', href: '/#faq' },
    { label: 'Shipping', href: '/about' },
    { label: 'Returns', href: '/about' },
    { label: 'Track Order', href: '/dashboard' },
    { label: 'Privacy Policy', href: '/about' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">BODY MOLD</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Premium gym belts engineered for maximum support and durability. IPF-approved, competition-ready, and built to last a lifetime. Trusted by powerlifters and athletes worldwide.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> support@bodymoldfitness.com</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> 1-800-MOLD-FIT</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Los Angeles, CA</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Body Mold Fitness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}