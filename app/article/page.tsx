import { listBlogPostsPayload } from '@/lib/blog/posts';

import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import CollectionPageSchema from '@/components/SEO/CollectionPageSchema';

import ArticleListClient from './ArticleListClient';

export const revalidate = 300;

const SITE = 'https://www.megicode.com';

const breadcrumbs = [
  { name: 'Home', url: SITE },
  { name: 'Insights', url: `${SITE}/article` },
];

export default async function ArticlePage() {
  const { docs: articles } = await listBlogPostsPayload().catch(() => ({ docs: [] }));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <CollectionPageSchema articles={articles} />
      <ArticleListClient initialArticles={articles} />
    </>
  );
}
