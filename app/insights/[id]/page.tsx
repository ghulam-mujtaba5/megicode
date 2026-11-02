import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBlogPost, getRelatedPosts } from '@/lib/blog/posts';
import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import AuthorCard from '@/components/Article/AuthorCard';
import FaqAccordion from '@/components/Article/FaqAccordion';
import ReadingProgress from '@/components/Article/ReadingProgress';
import {
  ServiceLinkFunnel,
  getServiceForArticle,
  type ServiceFunnelTarget,
} from '@/components/Article/ServiceLinkFunnel';
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

function extractExecutiveTakeaway(html: string): { takeaway: string | null; cleanHtml: string } {
  if (!html) return { takeaway: null, cleanHtml: '' };
  const match = html.match(/<blockquote>([\s\S]*?)<\/blockquote>/i);
  if (match) {
    const takeaway = match[1];
    const cleanHtml = html.replace(match[0], '');
    return { takeaway, cleanHtml };
  }
  return { takeaway: null, cleanHtml: html };
}

/**
 * Injects a contextual reverse-silo callout banner after the 2nd <h2>
 * channeling PageRank link equity directly into the target money page.
 */
function injectMidArticleCallout(html: string, target: ServiceFunnelTarget): string {
  if (!html) return html;

  const calloutHtml = `
<aside class="mid-article-funnel-banner" style="margin: 2.25rem 0; padding: 1.5rem; border-radius: 12px; background: rgba(37, 99, 235, 0.06); border-left: 4px solid #2563eb; border-top: 1px solid rgba(37, 99, 235, 0.15); border-right: 1px solid rgba(37, 99, 235, 0.15); border-bottom: 1px solid rgba(37, 99, 235, 0.15);">
  <div style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #2563eb; margin-bottom: 0.35rem;">
    Enterprise Execution &amp; Consulting
  </div>
  <p style="margin: 0 0 0.75rem 0; font-size: 0.98rem; line-height: 1.55; color: inherit; font-weight: 500;">
    Looking to execute this in production? Explore Megicode's verified architecture in <strong><a href="${target.href}" style="color: #2563eb; text-decoration: underline; font-weight: 700;">${target.title}</a></strong>.
  </p>
  <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
    <a href="${target.href}" style="display: inline-flex; align-items: center; font-size: 0.85rem; font-weight: 700; color: #ffffff; background-color: #2563eb; padding: 6px 14px; border-radius: 6px; text-decoration: none;">
      ${target.cta}
    </a>
    <a href="/contact?service=${target.contactServiceParam}" style="display: inline-flex; align-items: center; font-size: 0.85rem; font-weight: 600; color: #2563eb; text-decoration: none;">
      Book Technical Strategy Call &rarr;
    </a>
  </div>
</aside>
`.trim();

  // Find closing tag of 2nd <h2>
  let count = 0;
  const regex = /<\/h2>/gi;
  let match: RegExpExecArray | null;
  let insertIndex = -1;

  while ((match = regex.exec(html)) !== null) {
    count++;
    if (count === 2) {
      insertIndex = match.index + match[0].length;
      break;
    }
  }

  // Fallback if only 1 <h2>
  if (insertIndex === -1 && count === 1) {
    const firstMatch = /<\/h2>/i.exec(html);
    if (firstMatch) {
      insertIndex = firstMatch.index + firstMatch[0].length;
    }
  }

  // Fallback if no <h2> found: insert after 2nd </p>
  if (insertIndex === -1) {
    let pCount = 0;
    const pRegex = /<\/p>/gi;
    let pMatch: RegExpExecArray | null;
    while ((pMatch = pRegex.exec(html)) !== null) {
      pCount++;
      if (pCount === 2) {
        insertIndex = pMatch.index + pMatch[0].length;
        break;
      }
    }
  }

  if (insertIndex !== -1) {
    return html.slice(0, insertIndex) + '\n\n' + calloutHtml + '\n\n' + html.slice(insertIndex);
  }

  return html + '\n\n' + calloutHtml;
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

  const pageUrl = `${SITE}/insights/${article.slug || id}`;
  const imageUrl = absoluteUrl(article.coverImage);
  const description =
    article.seoDescription || article.excerpt || article.title || 'Read this article on Megicode.';

  const baseTitle = (article.seoTitle || article.title || 'Article').trim();
  const title =
    baseTitle.length > 55
      ? `${baseTitle.slice(0, 55).trim()}... | Megicode`
      : `${baseTitle} | Megicode`;

  return {
    title,
    description,
    keywords: [article.primaryKeyword, ...(article.keywords || []), ...(article.tags || [])].filter(
      Boolean
    ) as string[],
    authors: [{ name: article.authorName || 'Megicode Team' }],
    openGraph: {
      title,
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
  const { takeaway, cleanHtml } = extractExecutiveTakeaway(article.contentHtml || '');
  const related = await getRelatedPosts(article.slug || id, category, 3).catch(() => []);
  const pageUrl = `${SITE}/insights/${article.slug || id}`;

  const serviceTarget = getServiceForArticle(article.slug || id, category, article.tags);
  const contentWithMidCallout = injectMidArticleCallout(
    cleanHtml || '<p>No content available.</p>',
    serviceTarget
  );

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  const breadcrumbs = [
    { name: 'Home', url: SITE },
    { name: 'Insights', url: `${SITE}/insights` },
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
            <Link href="/insights">Insights</Link>
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
              <div className={styles.stickySidebarContent}>
                <TableOfContents items={headings} />
                <div className={styles.sidebarCtaCard}>
                  <span className={styles.sidebarCtaEyebrow}>{serviceTarget.badge}</span>
                  <h3 className={styles.sidebarCtaTitle}>{serviceTarget.title}</h3>
                  <p className={styles.sidebarCtaText}>{serviceTarget.tagline}</p>
                  <Link href={serviceTarget.href} className={styles.sidebarCtaButton}>
                    {serviceTarget.cta}
                  </Link>
                  <Link
                    href={`/contact?service=${serviceTarget.contactServiceParam}`}
                    style={{
                      display: 'block',
                      marginTop: '0.75rem',
                      fontSize: '0.82rem',
                      textAlign: 'center',
                      color: '#64708a',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Schedule Consultation &rarr;
                  </Link>
                </div>
              </div>
            </aside>

            <article className={styles.contentCard}>
              {takeaway && (
                <div className={styles.aiSummaryContainer}>
                  <div className={styles.aiSummaryHeader}>
                    <svg
                      className={styles.aiSummaryIcon}
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>Key Takeaways / AI Summary</span>
                  </div>
                  <div
                    className={styles.aiSummaryContent}
                    dangerouslySetInnerHTML={{ __html: takeaway }}
                  />
                </div>
              )}

              <div
                className={styles.articleContent}
                dangerouslySetInnerHTML={{
                  __html: contentWithMidCallout,
                }}
              />

              <ServiceLinkFunnel
                slug={article.slug || id}
                title={article.title}
                category={article.categories?.[0]}
                tags={article.tags}
              />

              <AuthorCard authorName={article.authorName} />

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
                    href={`/insights/${post.slug || post.id}`}
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
