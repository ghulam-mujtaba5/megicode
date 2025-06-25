"use client";
import React, { useEffect, useState } from "react";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import { useTheme } from "../../context/ThemeContext";

const ArticlePage = () => {
  const { theme, toggleTheme } = useTheme();
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
    <div
      style={{
        background: theme === "dark" ? "linear-gradient(135deg, #181c22 0%, #232946 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%)",
        minHeight: "100vh",
        overflowX: "hidden",
        transition: "background 0.3s"
      }}
    >
      {/* Theme Toggle Icon */}
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
        <h1
          style={{
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 36,
            color: theme === "dark" ? "#e3e8ee" : "#1d2127",
            letterSpacing: "-1px"
          }}
        >
          Articles
        </h1>
        {loading ? (
          <div style={{ color: theme === "dark" ? "#b0b8c1" : "#232946", fontSize: 20, textAlign: "center", marginTop: 60 }}>Loading...</div>
        ) : articles.length === 0 ? (
          <div style={{ color: theme === "dark" ? "#b0b8c1" : "#232946", fontSize: 20, textAlign: "center", marginTop: 60 }}>No articles found.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 40,
              gridTemplateColumns: "1fr"
            }}
          >
            {articles.map((article) => (
              <article
                key={article.id}
                style={{
                  background: theme === "dark"
                    ? "rgba(36, 41, 54, 0.98)"
                    : "rgba(255,255,255,0.98)",
                  border: theme === "dark" ? "1.5px solid #2e3440" : "1.5px solid #e3e8ee",
                  borderRadius: 20,
                  boxShadow:
                    theme === "dark"
                      ? "0 4px 32px 0 rgba(0,0,0,0.25)"
                      : "0 4px 24px 0 rgba(60,60,120,0.07)",
                  padding: "2.5rem 2rem 2rem 2rem",
                  transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: theme === "dark" ? "#e3e8ee" : "#232946",
                    letterSpacing: "-0.5px"
                  }}
                >
                  {article.title}
                </h2>
                <div
                  style={{
                    color: theme === "dark" ? "#b0b8c1" : "#5a6270",
                    fontSize: 15,
                    marginBottom: 18,
                    fontWeight: 500
                  }}
                >
                  {article.populatedAuthors && article.populatedAuthors[0]?.name} &middot; {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <p
                  style={{
                    fontSize: 18,
                    lineHeight: 1.7,
                    color: theme === "dark" ? "#c7d0e0" : "#232946",
                    marginBottom: 0,
                    fontWeight: 400
                  }}
                >
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
