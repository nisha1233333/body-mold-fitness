import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/checkout/', '/cart/'],
    },
    sitemap: 'https://bodymoldfitness.com/sitemap.xml',
  };
}
