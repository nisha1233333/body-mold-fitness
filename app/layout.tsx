import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://bodymoldfitness.com'),
  title: {
    default: 'Body Mold Fitness | Premium Gym Belts for Powerlifting & Strength Training',
    template: '%s | Body Mold Fitness',
  },
  description: 'Premium gym belts engineered for maximum support and durability. IPF-approved lever, prong, and velcro belts trusted by powerlifters and athletes worldwide.',
  keywords: ['gym belts', 'lifting belt', 'powerlifting belt', 'lever belt', 'prong belt', 'velcro belt', 'leather belt', 'crossfit belt', 'weightlifting belt', 'bodybuilding belt'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bodymoldfitness.com',
    siteName: 'Body Mold Fitness',
    title: 'Body Mold Fitness | Premium Gym Belts for Powerlifting & Strength Training',
    description: 'Premium gym belts engineered for maximum support and durability.',
    images: [{ url: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1200', width: 1200, height: 630, alt: 'Body Mold Fitness Gym Belts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Body Mold Fitness | Premium Gym Belts',
    description: 'Premium gym belts for powerlifting, CrossFit, and strength training.',
    images: ['https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
