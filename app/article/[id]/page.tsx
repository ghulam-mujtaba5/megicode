import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBlogPost, getRelatedPosts } from '@/lib/blog/posts';
import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import FaqAccordion from '@/components/Article/FaqAccordion';
import ReadingProgress from '@/components/Article/ReadingProgress';
import ShareButtons from '@/components/Article/ShareButtons';
import TableOfContents, { type TocItem } from '@/components/Article/TableOfContents';
import Footer from '@/components/Footer/Footer';
import { ThemeToggleClient } from '@/components/Icon';
import NavBarDesktop from '@/components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '@/components/NavBar_Mobile/NavBar-mobile';
import ArticleSchema from '@/components/SEO/ArticleSchema';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import FaqSchema from '@/components/SEO/FaqSchema';

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

const SITE = 'https://www.megicode.com';

function absoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return `${SITE}/meta/default-og.jpg`;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

function formatDate(value?: string | null) {
  return value
    ? new Date(value).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
}

function extractHeadings(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])\s+id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    items.push({
      level: Number(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, '').trim(),
    });
  }
  return items;
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

  const pageUrl = `${SITE}/article/${article.slug || id}`;
  const imageUrl = absoluteUrl(article.coverImage);
  const description =
    article.seoDescription || article.excerpt || article.title || 'Read this article on Megicode.';

  return {
    title: article.seoTitle || article.title || 'Article | Megicode',
    description,
    keywords: [article.primaryKeyword, ...(article.keywords || []), ...(article.tags || [])].filter(
      Boolean
    ) as string[],
    authors: [{ name: article.authorName || 'Megicode Team' }],
    openGraph: {
      title: article.title,
      description,
      url: pageUrl,
      type: 'article',
      siteName: 'Megicode',
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt,
      authors: ['Megicode'],
      tags: article.tags,
      images: [
        { url: imageUrl, width: 1200, height: 630, alt: article.coverImageAlt || article.title },
      ],
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
  const updatedDate = formatDate(article.updatedAt);
  const headings = extractHeadings(article.contentHtml || '');
  const related = await getRelatedPosts(article.slug || id, category, 3).catch(() => []);
  const pageUrl = `${SITE}/article/${article.slug || id}`;

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  const breadcrumbs = [
    { name: 'Home', url: SITE },
    { name: 'Articles', url: `${SITE}/article` },
    { name: article.title, url: pageUrl },
  ];

  return (
    <>
      <ArticleSchema article={article} />
      <FaqSchema faqs={article.faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ReadingProgress />

      <div className={styles.articleDetailThemeBg}>
        <ThemeToggleClient className={styles.themeToggle} />
        <nav id="desktop-navbar" aria-label="Main Navigation">
          <NavBarDesktop />
        </nav>
        <nav id="mobile-navbar" aria-label="Mobile Navigation">
          <NavBarMobile />
        </nav>

        <main className={styles.mainContent}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/article">Articles</Link>
            <span aria-hidden="true">/</span>
            <span className={styles.breadcrumbCurrent}>{category}</span>
          </nav>

          <header className={styles.hero}>
            <div className={styles.heroBadges}>
              <span className={styles.category}>{category}</span>
              {article.funnelStage && (
                <span className={styles.funnelChip}>{article.funnelStage}</span>
              )}
            </div>
            <h1 className={styles.articleTitle}>{article.title}</h1>
            <p className={styles.articleDescription}>
              {article.seoDescription || article.excerpt || 'Read the latest Megicode insight.'}
            </p>
            <div className={styles.articleMeta}>
              <span className={styles.author}>
                <span className={styles.authorAvatar} aria-hidden="true">
                  M
                </span>
                {article.authorName || 'Megicode Team'}
              </span>
              {publishedDate && (
                <span>
                  <time dateTime={article.publishedAt || article.createdAt}>{publishedDate}</time>
                </span>
              )}
              {article.readingMinutes ? <span>{article.readingMinutes} min read</span> : null}
            </div>
          </header>

          <figure className={styles.coverFrame}>
            {article.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.coverImage}
                alt={article.coverImageAlt || article.title}
                className={styles.coverImage}
                width={1200}
                height={675}
                // @ts-expect-error fetchpriority is a valid attribute
                fetchpriority="high"
                style={{ objectFit: article.coverImageFit || 'cover' }}
              />
            ) : (
              <div className={styles.coverFallback}>{article.title.slice(0, 1)}</div>
            )}
          </figure>

          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <TableOfContents items={headings} />
            </aside>

            <article className={styles.contentCard}>
              <div
                className={styles.articleContent}
                dangerouslySetInnerHTML={{
                  __html: article.contentHtml || '<p>No content available.</p>',
                }}
              />

              {(article.ctaLabel || article.ctaText) && (
                <aside className={styles.ctaBox}>
                  <span className={styles.ctaEyebrow}>Work with Megicode</span>
                  <h2 className={styles.ctaTitle}>{article.ctaLabel}</h2>
                  {article.ctaText && <p className={styles.ctaText}>{article.ctaText}</p>}
                  <div className={styles.ctaActions}>
                    <Link href="/contact" className={styles.ctaPrimary}>
                      Book a discovery call
                    </Link>
                    <Link href="/services" className={styles.ctaSecondary}>
                      Explore services
                    </Link>
                  </div>
                </aside>
              )}

              <FaqAccordion faqs={article.faqs || []} />

              {article.relatedLinks && article.relatedLinks.length > 0 && (
                <section className={styles.relatedLinks} aria-label="Related Megicode resources">
                  <h2 className={styles.relatedLinksTitle}>Related Megicode resources</h2>
                  <ul>
                    {article.relatedLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <footer className={styles.articleFooter}>
                <ShareButtons url={pageUrl} title={article.title} />
                {updatedDate && <p className={styles.updatedNote}>Last updated {updatedDate}</p>}
              </footer>
            </article>
          </div>

          {related.length > 0 && (
            <section className={styles.relatedSection} aria-label="Related articles">
              <h2 className={styles.relatedHeading}>Keep reading</h2>
              <div className={styles.relatedGrid}>
                {related.map((post) => (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug || post.id}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedImage}>
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage}
                          alt={post.coverImageAlt || post.title}
                          loading="lazy"
                        />
                      ) : (
                        <span>{post.title.slice(0, 1)}</span>
                      )}
                    </div>
                    <div className={styles.relatedBody}>
                      <span className={styles.relatedCategory}>
                        {post.categories?.[0] || 'Megicode'}
                      </span>
                      <h3>{post.title}</h3>
                      <span className={styles.relatedMore}>Read article</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
