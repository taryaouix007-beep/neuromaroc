import { MetadataRoute } from 'next'

async function getBlogPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const locales = ['fr', 'ar'];
  const allEntries: any[] = [];

  for (const locale of locales) {
    try {
      const response = await fetch(`${baseUrl}/api/blog?locale=${locale}`, {
        next: { revalidate: 3600 },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          result.data.forEach((post: any) => {
            allEntries.push({
              url: `${baseUrl}/${locale}/blog/${post.slug}`,
              lastModified: new Date(post.published_at),
              changeFrequency: 'weekly' as any,
              priority: 0.7,
            });
          });
        }
      }
    } catch (e) {
      console.error(`Error fetching sitemap posts for ${locale}:`, e);
    }
  }
  return allEntries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const locales = ['fr', 'ar'];
  
  // Static pages
  const staticPages = locales.map(locale => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: 'daily' as any, priority: 1.0 },
    { url: `${baseUrl}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as any, priority: 0.8 },
    { url: `${baseUrl}/${locale}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as any, priority: 0.5 },
  ]).flat();

  const dynamicPosts = await getBlogPosts();

  return [...staticPages, ...dynamicPosts];
}
