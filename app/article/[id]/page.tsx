import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Footer from '@/components/Footer/Footer';
import { ThemeToggleClient } from '@/components/Icon';
import NavBarDesktop from '@/components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '@/components/NavBar_Mobile/NavBar-mobile';
import ArticleSchema from '@/components/SEO/ArticleSchema';
import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';
import { getBlogPost } from '@/lib/blog/posts';

import styles from './ArticleDetail.module.css';

export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

async function getArticle(id: string) {
  if (!id) return null;

  try {
    return await getBlogPost(id);
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

function absoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return 'https://www.megicode.com/meta/default-og.jpg';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `https://www.megicode.com${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

function formatDate(value?: string | null) {
  return value
    ? new Date(value).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: 'Article Not Found | Megicode',
      description: 'This article could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = `https://www.megicode.com/article/${article.slug || id}`;
  const imageUrl = absoluteUrl(article.coverImage);
  const description =
    article.seoDescription || article.excerpt || article.title || 'Read this article on Megicode.';

  return {
    title: article.seoTitle || article.title || 'Article | Megicode',
    description,
    openGraph: {
      title: article.title,
      description,
      url: pageUrl,
      type: 'article',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: article.coverImageAlt || article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

const ArticleDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return notFound();

  const category = article.categories?.[0] || 'Megicode Insights';
  const publishedDate = formatDate(article.publishedAt || article.createdAt);
  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  return (
    <>
      <ArticleSchema article={article} />
      <div className={styles.articleDetailThemeBg}>
        <ThemeToggleClient className={styles.themeToggle} />
        <nav id="desktop-navbar" aria-label="Main Navigation">
          <NavBarDesktop />
        </nav>
        <nav id="mobile-navbar" aria-label="Mobile Navigation">
          <NavBarMobile />
        </nav>

        <main className={styles.mainContent}>
          <Link href="/article" className={styles.backLink}>
            Back to articles
          </Link>

          <article className={styles.articleShell}>
            <header className={styles.hero}>
              <div className={styles.heroCopy}>
                <span className={styles.category}>{category}</span>
                <h1 className={styles.articleTitle}>{article.title}</h1>
                <p className={styles.articleDescription}>
                  {article.seoDescription || article.excerpt || 'Read the latest Megicode insight.'}
                </p>
                <div className={styles.articleMeta}>
                  <span>{article.authorName || 'Megicode Team'}</span>
                  {publishedDate && <span>{publishedDate}</span>}
                </div>
              </div>

              <div className={styles.coverFrame}>
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.coverImageAlt || article.title}
                    className={styles.coverImage}
                    style={{ objectFit: article.coverImageFit || 'cover' }}
                  />
                ) : (
                  <div className={styles.coverFallback}>{article.title.slice(0, 1)}</div>
                )}
              </div>
            </header>

            <div className={styles.contentCard}>
              <div
                className={styles.articleContent}
                dangerouslySetInnerHTML={{ __html: article.contentHtml || '<p>No content available.</p>' }}
              />
            </div>
          </article>
        </main>

        <Footer
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          githubUrl={githubUrl}
          copyrightText={copyrightText}
        />
      </div>
    </>
  );
};

export default ArticleDetailPage;
