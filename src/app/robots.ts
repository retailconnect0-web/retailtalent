import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/candidate/', '/api/'],
    },
    sitemap: 'https://retailtalent.in/sitemap.xml',
  };
}
