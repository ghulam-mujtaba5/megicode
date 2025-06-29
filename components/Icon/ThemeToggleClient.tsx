"use client";

// TypeScript: declare the custom property on Window
declare global {
  interface Window {
    __megicodeTheme?: string;
  }
}
import React, { useEffect, useState } from "react";
import ThemeToggleIcon from "./sbicon";

// This client component manages theme switching and provides the theme to its children
const ThemeToggleClient = ({ style = {} }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Try to get theme from localStorage or system preference
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  // Provide theme to window for other components if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__megicodeTheme = theme;
    }
  }, [theme]);



  return (
    <div id="theme-toggle" role="button" tabIndex={0} onClick={toggleTheme} style={style}>
      <ThemeToggleIcon />
    </div>
  );
};

export default ThemeToggleClient;
