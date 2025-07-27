import { GetServerSideProps } from 'next';
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await fetch('https://payloadw.onrender.com/api/posts?limit=1000');
  const data = await response.json();
  const articles = data?.docs || [];

  const fields = articles.map((article: { id: string; updatedAt: string }) => ({
    loc: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://megicode.com'}/article/${article.id}`,
    lastmod: new Date(article.updatedAt).toISOString(),
    changefreq: 'weekly',
    priority: 0.8,
  }));

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent Next.js from throwing an error
export default function Sitemap() {}
