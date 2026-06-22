'use client';

import React, { useEffect, useState } from 'react';
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
  populatedAuthors?: { name: string }[];
  content?: { root?: { children?: { children?: { text: string }[] }[] } };
}

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
    ? new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
}

const ArticlePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

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
          <div>
            <span className={styles.eyebrow}>Megicode Insights</span>
            <h1 className={styles.title}>Articles that help you build smarter systems.</h1>
            <p className={styles.subtitle}>
              Practical notes on AI automation, custom software, scalable platforms, analytics,
              security, and modern product delivery.
            </p>
          </div>
          {!loading && <div className={styles.countPill}>{articles.length} articles</div>}
        </section>

        {loading ? (
          <div className={styles.state}>
            <LoadingAnimation size="medium" />
          </div>
        ) : articles.length === 0 ? (
          <div className={styles.state}>No articles found.</div>
        ) : (
          <section className={styles.grid} aria-label="Articles">
            {articles.map((article) => {
              const key = article._id || article.id || article.slug || article.title;
              const category = article.categories?.[0] || 'Megicode';
              const imageFailed = failedImages[key];

              return (
                <Link key={key} href={articleUrl(article)} className={styles.cardLink}>
                  <article className={styles.card}>
                    <div className={styles.imageWrap}>
                      {article.coverImage && !imageFailed ? (
                        <img
                          src={article.coverImage}
                          alt={article.coverImageAlt || article.title}
                          style={{ objectFit: article.coverImageFit || 'cover' }}
                          onError={() => setFailedImages((current) => ({ ...current, [key]: true }))}
                        />
                      ) : (
                        <div className={styles.fallbackArt}>{article.title.slice(0, 1)}</div>
                      )}
                      <span className={styles.category}>{category}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <h2 className={styles.cardTitle}>{article.title}</h2>
                      <p className={styles.meta}>
                        {article.populatedAuthors?.[0]?.name || 'Megicode Team'} · {formatDate(article)}
                      </p>
                      <p className={styles.excerpt}>{articlePreview(article)}</p>
                      <span className={styles.readMore}>Read article</span>
                    </div>
                  </article>
                </Link>
              );
            })}
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
  );
};

export default ArticlePage;
