'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

import Footer from '../../components/Footer/Footer';
import ThemeToggleIcon from '../../components/Icon/sbicon';
import NewNavBar from '../../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../../components/NavBar_Mobile/NavBar-mobile';
import { useTheme } from '../../context/ThemeContext';
import styles from './ArticleList.module.css';

interface Article {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  createdAt: string;
  publishedAt?: string;
  excerpt?: string;
  summary?: string;
  coverImage?: string;
  coverImageAlt?: string;
  coverImageFit?: React.CSSProperties['objectFit'];
  categories?: string[];
  readingMinutes?: number;
  funnelStage?: string;
  populatedAuthors?: { name: string }[];
  content?: { root?: { children?: { children?: { text: string }[] }[] } };
}

const ALL = 'All';

function articleUrl(article: Article) {
  return `/article/${article.slug || article._id || article.id}`;
}

function articlePreview(article: Article) {
  return (
    article.excerpt ||
    article.summary ||
    article.content?.root?.children?.[0]?.children
      ?.map((child) => child.text)
      .join(' ')
      ?.slice(0, 200) ||
    'No preview available.'
  );
}

function formatDate(article: Article) {
  const value = article.publishedAt || article.createdAt;
  return value
    ? new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
}

function articleKey(article: Article) {
  return article._id || article.id || article.slug || article.title;
}

const ArticlePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setArticles(data?.docs || []);
      })
      .catch(() => {
        setArticles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      const category = article.categories?.[0];
      if (category) counts.set(category, (counts.get(category) || 0) + 1);
    }
    return [ALL, ...Array.from(counts.keys()).sort()];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = activeCategory === ALL || article.categories?.[0] === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = `${article.title} ${articlePreview(article)} ${
        article.categories?.join(' ') || ''
      }`.toLowerCase();
      return haystack.includes(q);
    });
  }, [articles, query, activeCategory]);

  const showFeatured = activeCategory === ALL && !query.trim();
  const featured = showFeatured ? filtered[0] : undefined;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <div className={`${styles.pageShell} ${isDark ? styles.dark : ''}`}>
      <button
        id="theme-toggle"
        type="button"
        onClick={toggleTheme}
        className={styles.themeToggle}
        aria-label="Toggle theme"
      >
        <ThemeToggleIcon />
      </button>
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NewNavBar />
      </nav>
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>

      <main id="main-content" className={styles.mainContent}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Megicode Insights</span>
          <h1 className={styles.title}>Build smarter products, platforms, and automations.</h1>
          <p className={styles.subtitle}>
            Executive-level guides on AI product development, SaaS engineering, automation, cloud,
            and growth — written for founders and operators who want practical clarity before they
            build.
          </p>

          <div className={styles.controls}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, keywords…"
                className={styles.search}
                aria-label="Search articles"
              />
            </div>
            {!loading && (
              <span className={styles.countPill}>
                {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
              </span>
            )}
          </div>

          {!loading && categories.length > 1 && (
            <div className={styles.filters} role="tablist" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  className={`${styles.filterChip} ${
                    activeCategory === category ? styles.filterActive : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </section>

        {loading ? (
          <div className={styles.state}>
            <LoadingAnimation size="medium" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.state}>
            No articles match your search.
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => {
                setQuery('');
                setActiveCategory(ALL);
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {featured && (
              <Link href={articleUrl(featured)} className={styles.featuredLink}>
                <article className={styles.featured}>
                  <div className={styles.featuredImage}>
                    {featured.coverImage && !failedImages[articleKey(featured)] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.coverImage}
                        alt={featured.coverImageAlt || featured.title}
                        loading="eager"
                        onError={() =>
                          setFailedImages((c) => ({ ...c, [articleKey(featured)]: true }))
                        }
                      />
                    ) : (
                      <div className={styles.fallbackArt}>{featured.title.slice(0, 1)}</div>
                    )}
                  </div>
                  <div className={styles.featuredBody}>
                    <div className={styles.featuredBadges}>
                      <span className={styles.featuredTag}>Featured</span>
                      <span className={styles.featuredCategory}>
                        {featured.categories?.[0] || 'Megicode'}
                      </span>
                    </div>
                    <h2 className={styles.featuredTitle}>{featured.title}</h2>
                    <p className={styles.featuredExcerpt}>{articlePreview(featured)}</p>
                    <p className={styles.meta}>
                      {featured.populatedAuthors?.[0]?.name || 'Megicode Team'} ·{' '}
                      {formatDate(featured)}
                      {featured.readingMinutes ? ` · ${featured.readingMinutes} min read` : ''}
                    </p>
                    <span className={styles.readMore}>Read article</span>
                  </div>
                </article>
              </Link>
            )}

            <section className={styles.grid} aria-label="Articles">
              {rest.map((article) => {
                const key = articleKey(article);
                const category = article.categories?.[0] || 'Megicode';
                const imageFailed = failedImages[key];

                return (
                  <Link key={key} href={articleUrl(article)} className={styles.cardLink}>
                    <article className={styles.card}>
                      <div className={styles.imageWrap}>
                        {article.coverImage && !imageFailed ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={article.coverImage}
                            alt={article.coverImageAlt || article.title}
                            loading="lazy"
                            style={{ objectFit: article.coverImageFit || 'cover' }}
                            onError={() =>
                              setFailedImages((current) => ({ ...current, [key]: true }))
                            }
                          />
                        ) : (
                          <div className={styles.fallbackArt}>{article.title.slice(0, 1)}</div>
                        )}
                        <span className={styles.category}>{category}</span>
                      </div>
                      <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>{article.title}</h2>
                        <p className={styles.meta}>
                          {formatDate(article)}
                          {article.readingMinutes ? ` · ${article.readingMinutes} min read` : ''}
                        </p>
                        <p className={styles.excerpt}>{articlePreview(article)}</p>
                        <span className={styles.readMore}>Read article</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </section>
          </>
        )}
      </main>

      <Footer
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        githubUrl={githubUrl}
        copyrightText={copyrightText}
      />
    </div>
  );
};

export default ArticlePage;
