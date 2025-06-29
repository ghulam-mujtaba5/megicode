// --- Next.js dynamic metadata for SEO and social sharing ---
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Reuse getArticle to fetch article data
  const article = await getArticle(params.id);
  const title = article?.title ? `${article.title} | Megicode` : 'Article | Megicode';
  // Try to get a short description from the article content
  let description = '';
  if (article?.content?.root?.children?.length) {
    description = article.content.root.children
      .map((block: any) => block.children?.map((c: any) => c.text).join(' ')).join(' ');
    description = description.slice(0, 160);
  } else if (article?.description) {
    description = article.description.slice(0, 160);
  } else {
    description = 'Read this article on Megicode.';
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://megicode.com'}/article/${params.id}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Megicode',
      images: article?.coverImage ? [article.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article?.coverImage ? [article.coverImage] : undefined,
    },
  };
}

import NavBarDesktop from "../../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../../components/Footer/Footer";
import ThemeToggleIcon from "../../../components/Icon/sbicon";
import { ThemeProvider, useTheme } from "../../../context/ThemeContext";
import React from "react";

// ThemeToggle and ThemedArticle are client components
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div id="theme-toggle" role="button" tabIndex={0} onClick={toggleTheme} style={{ margin: "0 0 0 1.5rem", paddingTop: 18, width: 40 }}>
      <ThemeToggleIcon />
    </div>
  );
};

const ThemedArticle = ({ article }: { article: any }) => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        background: theme === "dark"
          ? "linear-gradient(135deg, #181c22 0%, #232946 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%)",
        minHeight: "100vh",
        overflowX: "hidden",
        transition: "background 0.3s"
      }}
    >
      <ThemeToggle />
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NavBarDesktop />
      </nav>
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "3.5rem 1rem 2rem 1rem",
          minHeight: "80vh"
        }}
      >
        {!article ? (
          <div style={{ color: theme === "dark" ? "#b0b8c1" : "#232946", fontSize: 20, textAlign: "center", marginTop: 60 }}>Article not found.</div>
        ) : (
          <article>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 800,
                marginBottom: 24,
                color: theme === "dark" ? "#e3e8ee" : "#1d2127",
                letterSpacing: "-1px"
              }}
            >
              {article.title}
            </h1>
            {article.subtitle && (
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  marginBottom: 16,
                  color: theme === "dark" ? "#b0b8c1" : "#232946",
                  letterSpacing: "-0.5px"
                }}
              >
                {article.subtitle}
              </h2>
            )}
            <div
              style={{
                color: theme === "dark" ? "#b0b8c1" : "#5a6270",
                fontSize: 15,
                marginBottom: 18,
                fontWeight: 500
              }}
            >
              {article.populatedAuthors && article.populatedAuthors[0]?.name} &middot; {article.createdAt && new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: theme === "dark" ? "#c7d0e0" : "#232946",
                marginBottom: 0,
                fontWeight: 400
              }}
            >
              {article.content?.root?.children?.map((block: any, i: number) => (
                <p key={i}>{block.children?.map((c: any) => c.text).join(' ')}</p>
              )) || 'No content available.'}
            </div>
          </article>
        )}
      </main>
      <Footer
        linkedinUrl="https://www.linkedin.com/company/megicode"
        instagramUrl="https://www.instagram.com/megicode/"
        githubUrl="https://github.com/megicode"
        copyrightText="Copyright 2025 Megicode. All Rights Reserved."
      />
    </div>
  );
};

// Server component
interface ArticleDetailPageProps {
  params: { id: string };
}

const getArticle = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.doc || data;
  } catch {
    return null;
  }
};

const ArticleDetailPage = async ({ params }: ArticleDetailPageProps) => {
  const { id } = params;
  const article = await getArticle(id);
  // ThemeProvider and ThemedArticle are client components
  return (
    <ThemeProvider>
      <ThemedArticle article={article} />
    </ThemeProvider>
  );
};

export default ArticleDetailPage;
