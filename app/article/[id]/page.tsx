"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBarDesktop from "../../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../../components/Footer/Footer";
import ThemeToggleIcon from "../../../components/Icon/sbicon";
import { useTheme } from "../../../context/ThemeContext";

const ArticleDetailPage = () => {
  const { theme, toggleTheme } = useTheme();
  const params = useParams();
  const { id } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data?.doc || data); // fallback for different API shapes
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

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
      <div id="theme-toggle" role="button" tabIndex={0} onClick={toggleTheme} style={{ margin: "0 0 0 1.5rem", paddingTop: 18, width: 40 }}>
        <ThemeToggleIcon />
      </div>
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
        {loading ? (
          <div style={{ color: theme === "dark" ? "#b0b8c1" : "#232946", fontSize: 20, textAlign: "center", marginTop: 60 }}>Loading...</div>
        ) : !article ? (
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
              {article.content?.root?.children?.map((block, i) => (
                <p key={i}>{block.children?.map((c) => c.text).join(' ')}</p>
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

export default ArticleDetailPage;
