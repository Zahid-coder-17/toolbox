import { MetadataRoute } from 'next';
import { TOOLS, CATEGORIES } from '@/config/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox.dev';
  const lastModified = new Date();

  // Root
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Category pages
  Object.values(CATEGORIES).forEach((cat) => {
    routes.push({
      url: `${baseUrl}${cat.href}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // All 24 Tool pages
  TOOLS.forEach((tool) => {
    routes.push({
      url: `${baseUrl}${tool.href}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Informational pages
  ['/privacy', '/terms', '/about', '/contact'].forEach((path) => {
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  return routes;
}
