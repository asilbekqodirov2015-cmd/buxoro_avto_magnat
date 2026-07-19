import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://buxoroavtomagnat.uz';
  
  const staticPages = [
    '',
    '/catalog',
    '/credit',
    '/trade-in',
    '/promotions',
    '/blog',
    '/locations',
    '/about',
    '/login',
    '/register'
  ];

  const entries = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  return entries;
}
