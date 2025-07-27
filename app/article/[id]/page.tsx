import NavBarDesktop from "../../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../../components/Footer/Footer";
import { ThemeToggleClient } from "../../../components/Icon";
import ArticleSchema from "@/components/SEO/ArticleSchema";
import styles from './ArticleDetail.module.css';
import { Metadata } from "next";
// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: "Article Not Found | Megicode",
      description: "This article could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = `https://megicode.com/article/${id}`;
  const imageUrl = article.heroImage?.sizes?.medium?.url || 
                  article.heroImage?.url || 
                  article.coverImage || 
                  "/meta/default-og.jpg";

  return {
    title: article.title || "Article | Megicode",
    description: article.summary || article.title || "Read this article on Megicode.",
    openGraph: {
      title: article.title,

      description: article.summary || article.title,
      url: pageUrl,
      type: "article",
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary || article.title,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}
import { notFound } from "next/navigation";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

// Generate static params for all articles (optional: you can fetch all IDs from your API)
export async function generateStaticParams() {
  try {
    const res = await fetch("https://payloadw.onrender.com/api/posts?limit=100", { next: { revalidate: 3600 } });
    const data = await res.json();
    const articles = data?.docs || [];
    return articles.map((a) => ({ id: a.id?.toString() }));
  } catch {
    return [];
  }
}

async function getArticle(id: string) {
  if (!id) return null;

  try {
    const res = await fetch(`https://payloadw.onrender.com/api/posts/${id}`, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Failed to fetch article: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data?.doc || data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

const ArticleDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const article = await getArticle(id);
  // Theme is handled client-side; default to 'light' for SSR, but useEffect will update on client
  if (!article) return notFound();

  return (
    <>
      <ArticleSchema article={article} />
      <div className={`article-detail-theme-bg ${styles.articleDetailThemeBg}`}>
        {/* Remove role from ThemeToggleClient for better accessibility */}
        <ThemeToggleClient className={styles.themeToggle} />
        <nav id="desktop-navbar" aria-label="Main Navigation">
          {/* Ensure NavBarDesktop renders a <ul> with <li> for navigation links */}
          <NavBarDesktop />
        </nav>
        <nav id="mobile-navbar" aria-label="Mobile Navigation">
          {/* Ensure NavBarMobile renders a <ul> with <li> for navigation links */}
          <NavBarMobile />
        </nav>
        <main className={styles.mainContent}>
          <article>
            {(() => {
              // Prefer heroImage.sizes.medium.url, then heroImage.url, then coverImage
              let imageUrl = null;
              let alt = article.title || 'Article cover';
              if (article.heroImage) {
                if (article.heroImage.sizes && article.heroImage.sizes.medium && article.heroImage.sizes.medium.url) {
                  imageUrl = article.heroImage.sizes.medium.url;
                } else if (article.heroImage.url) {
                  imageUrl = article.heroImage.url;
                }
                if (article.heroImage.alt) alt = article.heroImage.alt;
              } else if (article.coverImage) {
                imageUrl = article.coverImage;
              }
              if (!imageUrl) return null;
              // If not absolute, prefix with API URL
              const isAbsolute = imageUrl.startsWith('http');
              // Ensure imageUrl starts with a single slash
              let normalizedPath = imageUrl;
              if (!isAbsolute) {
                if (!imageUrl.startsWith('/')) {
                  normalizedPath = '/' + imageUrl;
                }
              }
              const src = isAbsolute ? imageUrl : `https://payloadw.onrender.com${normalizedPath}`;
              // Theme is handled by CSS class on <html> or <body>
              return (
                <img
                  src={src}
                  alt={alt}
                  className={styles.coverImage}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              );
            })()}
            <h1 className={`${styles.articleTitle} article-title`}>
              {article.title}
            </h1>
            <div className={`${styles.articleMeta} article-meta`}>
              {article.populatedAuthors && article.populatedAuthors[0]?.name} &middot; {article.createdAt && new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div className={`${styles.articleContent} article-content`}>
              {article.content?.root?.children?.map((block, i) => (
                <p key={i}>{block.children?.map((c) => c.text).join(' ')}</p>
              )) || 'No content available.'}
            </div>
          </article>
        </main>
        <Footer
          linkedinUrl="https://www.linkedin.com/company/megicode"
          instagramUrl="https://www.instagram.com/megicode/"
          githubUrl="https://github.com/megicodes"
          copyrightText="Copyright 2025 Megicode. All Rights Reserved."
        />
      </div>
    </>
  );
};

export default ArticleDetailPage;