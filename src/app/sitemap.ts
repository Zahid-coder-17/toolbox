import { MetadataRoute } from 'next';
import { TOOLS, CATEGORIES } from '@/config/tools';
import { getSiteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  // Root
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Category pages (4)
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
  ['/privacy', '/terms', '/disclaimer', '/about', '/contact'].forEach((path) => {
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  return routes;
}
