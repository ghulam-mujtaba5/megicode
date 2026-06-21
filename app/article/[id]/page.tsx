import NavBarDesktop from "../../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../../components/Footer/Footer";
import { ThemeToggleClient } from "../../../components/Icon";
import ArticleSchema from "@/components/SEO/ArticleSchema";
import styles from './ArticleDetail.module.css';
import { Metadata } from "next";
import { getBlogPost } from "@/lib/blog/posts";
// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: "Article Not Found | Megicode",
      description: "This article could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = `https://www.megicode.com/article/${article.slug || id}`;
  const imageUrl = article.coverImage || "/meta/default-og.jpg";
  const description = article.seoDescription || article.excerpt || article.title || "Read this article on Megicode.";

  return {
    title: article.seoTitle || article.title || "Article | Megicode",
    description,
    openGraph: {
      title: article.title,

      description,
      url: pageUrl,
      type: "article",
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
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
  // Avoid pre-generating article pages during build to prevent long external
  // API fetches from blocking the build. Pages will be rendered on demand.
  return [];
}

async function getArticle(id: string) {
  if (!id) return null;

  try {
    return getBlogPost(id);
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

const ArticleDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
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
              let imageUrl = '';
              let alt = article.coverImageAlt || article.title || 'Article cover';
              if (article.coverImage) {
                imageUrl = article.coverImage;
              }
              if (!imageUrl) return null;
              const src = imageUrl;
              // Theme is handled by CSS class on <html> or <body>
              return (
                <img
                  src={src}
                  alt={alt}
                  className={styles.coverImage}
                  style={{ objectFit: article.coverImageFit || 'cover' }}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              );
            })()}
            <h1 className={`${styles.articleTitle} article-title`}>
              {article.title}
            </h1>
            <div className={`${styles.articleMeta} article-meta`}>
              {article.authorName || 'Megicode Team'} &middot; {article.publishedAt || article.createdAt ? new Date(article.publishedAt || article.createdAt).toLocaleDateString() : ''}
            </div>
            <div className={`${styles.articleContent} article-content`}>
              <div dangerouslySetInnerHTML={{ __html: article.contentHtml || '<p>No content available.</p>' }} />
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
