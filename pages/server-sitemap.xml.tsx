import { GetServerSideProps } from 'next';
import { getServerSideSitemap, ISitemapField } from 'next-sitemap';

interface Article {
  id: string;
  updatedAt: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await fetch('https://payloadw.onrender.com/api/posts?limit=1000');
  const data = await response.json();
  const articles: Article[] = data?.docs || [];

  const fields: ISitemapField[] = articles.map((article) => ({
    loc: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://megicode.com'}/article/${article.id}`,
    lastmod: new Date(article.updatedAt).toISOString(),
    changefreq: 'weekly',
    priority: 0.8,
  }));

  getServerSideSitemap(fields, ctx);
  return { props: {} };
};

export default function ServerSitemap() {}
