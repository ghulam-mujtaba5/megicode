"use client";
import React, { useEffect, useState } from "react";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import { useTheme } from "../../context/ThemeContext";

const ArticlePage = () => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://payloadw.onrender.com/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data?.docs || []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#1d2127" : "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <div id="theme-toggle" role="button" tabIndex={0}>
        <ThemeToggleIcon />
      </div>
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NavBarDesktop />
      </nav>
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>Articles</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ display: "grid", gap: 32 }}>
            {articles.map((article) => (
              <article
                key={article.id}
                style={{
                  background: theme === "dark" ? "#232946" : "#f5f5f5",
                  borderRadius: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  padding: 24,
                  transition: "box-shadow 0.2s",
                }}
              >
                <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{article.title}</h2>
                <div style={{ color: "#888", fontSize: 14, marginBottom: 12 }}>
                  {article.populatedAuthors && article.populatedAuthors[0]?.name} &middot; {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <p style={{ fontSize: 18, lineHeight: 1.6 }}>
                  {/* Render a short preview from the first paragraph of content if available */}
                  {article.content?.root?.children?.[0]?.children?.map((c) => c.text).join(' ')?.slice(0, 200) || 'No preview available.'}
                </p>
              </article>
            ))}
          </div>
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

export default ArticlePage;
