"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import { useTheme } from "../../context/ThemeContext";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

const ArticlePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Navigation sections for consistent navigation
  const sections = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'article', label: 'Article', href: '/article' },
    { id: 'contact', label: 'Contact', href: '/contact' },
    { id: 'reviews', label: 'Reviews', href: '/reviews' },
    { id: 'careers', label: 'Careers', href: '/careers' },
  ];

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data?.docs || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const isMobile = isClient && window.innerWidth < 768;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: theme === "dark" ? "linear-gradient(135deg, #181c22 0%, #232946 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%)",
        overflowX: "hidden",
        transition: "background 0.3s"
      }}
    >
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0} onClick={toggleTheme} style={{ margin: "0 0 0 1.5rem", width: 40, zIndex: 50, position: 'fixed' }}>
        <ThemeToggleIcon />
      </div>
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NewNavBar />
      </nav>
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>
      <main
        style={{
          flex: '1 0 auto',
          maxWidth: 900,
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '4rem 1.5rem 3rem' : '5rem 1rem 4rem',
          boxSizing: 'border-box'
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            width: '100%'
          }}>
            <LoadingAnimation size="medium" />
          </div>
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
              <Link
                key={article._id || article.id}
                href={`/article/${article._id || article.id}`}
                style={{ textDecoration: "none" }}
              >
                <article
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
                    overflow: "hidden",
                    cursor: "pointer"
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
              </Link>
            ))}
          </div>
        )}
      </main>
      <div style={{ flexShrink: 0, width: '100%' }}>
        <Footer
          linkedinUrl="https://www.linkedin.com/company/megicode"
          instagramUrl="https://www.instagram.com/megicode/"
          githubUrl="https://github.com/megicodes"
          copyrightText="Copyright 2025 Megicode. All Rights Reserved."
        />
      </div>
    </div>
  );
};

export default ArticlePage;
