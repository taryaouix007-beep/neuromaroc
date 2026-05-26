import { NextResponse } from "next/server";

async function getBlogPosts(locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/blog?locale=${locale}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (err) {
    console.error("Error fetching posts for RSS:", err);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "fr";
  const posts = await getBlogPosts(locale);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NeuroMaroc Blog</title>
    <link>${baseUrl}/${locale}/blog</link>
    <description>Actualités et conseils sur la neurologie et la santé nerveuse au Maroc</description>
    <language>${locale === "ar" ? "ar" : "fr"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:logo>${baseUrl}/logo.png</atom:logo>
    ${posts.map((post: any) => `
    <item>
      <title>${post.title}</title>
      <link>${baseUrl}/${locale}/blog/${post.slug}</link>
      <guid isPermaLink="false">${post.id}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <description>${post.description}</description>
      <category>${post.category}</category>
    </item>
    `).join("")}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
