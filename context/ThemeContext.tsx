"use client";
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Define the type for the context value
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const defaultContextValue: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default theme

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to determine if user prefers dark mode
  const prefersDarkMode = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light mode if matchMedia or window is not available
  };

  // Effect to set initial theme based on user preference or stored theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDarkMode() ? 'dark' : 'light');
    }
  }, []);

  // Effect to update theme in localStorage and on document.documentElement
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    // Update CSS variables for theme colors
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--card-bg', '#23272f');
      document.documentElement.style.setProperty('--text-color', '#e1e5f2');
      document.documentElement.style.setProperty('--quote-color', '#b4b9c5');
      document.documentElement.style.setProperty('--role-color', '#4573df');
      document.documentElement.style.setProperty('--role-bg', '#2a2f38');
      document.documentElement.style.setProperty('--role-border', 'rgba(69,115,223,0.2)');
      document.documentElement.style.setProperty('--border-color', '#2a2f38');
      document.documentElement.style.setProperty('--section-bg', '#23272f');
    } else {
      document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.8)');
      document.documentElement.style.setProperty('--text-color', '#4a5568');
      document.documentElement.style.setProperty('--quote-color', '#4a5568');
      document.documentElement.style.setProperty('--role-color', '#4573df');
      document.documentElement.style.setProperty('--role-bg', 'rgba(69,115,223,0.08)');
      document.documentElement.style.setProperty('--role-border', 'rgba(69,115,223,0.15)');
      document.documentElement.style.setProperty('--border-color', 'white');
    }
  }, [theme]);

  // Effect to listen to changes in system color scheme preference
  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = e => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    darkThemeMq.addListener(handleChange);
    return () => darkThemeMq.removeListener(handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
