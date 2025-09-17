"use client";

import { useTheme } from "../../../context/ThemeContext";
import Link from "next/link";
import Image from "next/image";

export default function ArticleError() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme === "dark" ? "linear-gradient(135deg, #181c22 0%, #232946 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%)",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem"
      }}
    >
      <Image
        src="/megicode-logo-without-border.svg"
        alt="Megicode Logo"
        width={80}
        height={80}
        style={{ marginBottom: "2rem" }}
      />
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1rem",
          color: theme === "dark" ? "#e3e8ee" : "#1d2127"
        }}
      >
        Oops! Something went wrong
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          marginBottom: "2rem",
          color: theme === "dark" ? "#b0b8c1" : "#5a6270",
          textAlign: "center"
        }}
      >
        We encountered an error while loading the article.
        <br />
        Please try again later.
      </p>
      <Link
        href="/article"
        style={{
          background: theme === "dark" ? "#4573df" : "#4573df",
          color: "#ffffff",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontWeight: 600,
          transition: "background 0.2s",
          border: "none",
          cursor: "pointer"
        }}
      >
        Back to Articles
      </Link>
    </div>
  );
}
