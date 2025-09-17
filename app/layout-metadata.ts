import { Metadata } from 'next';

export const faviconMetadata: Metadata['icons'] = {
  icon: [
    // Primary favicon (SVG - modern browsers)
    { url: "/favicon.svg", type: "image/svg+xml" },
    // Fallback PNG formats
    { url: "/meta/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/meta/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    // Legacy ICO format
    { url: "/meta/favicon.ico", sizes: "48x48" },
  ],
  apple: [
    { url: "/meta/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
  other: [
    // Android Chrome icons
    { url: "/meta/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    { url: "/meta/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    // Safari pinned tab
    { url: "/meta/safari-pinned-tab.svg", rel: "mask-icon", color: "#4573df" },
    // Microsoft tiles
    { url: "/meta/mstile-144x144.png", sizes: "144x144", type: "image/png" },
  ],
};

export const manifestMetadata = {
  name: "Megicode - Modern Software Solutions",
  short_name: "Megicode",
  description: "Expert software development services including web, mobile, desktop applications, AI solutions, and data science.",
  theme_color: "#4573df",
  background_color: "#1d2127",
  display: "standalone",
  orientation: "portrait",
  start_url: "/",
  icons: [
    {
      src: "/meta/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable"
    },
    {
      src: "/meta/android-chrome-512x512.png", 
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable"
    },
    {
      src: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any"
    }
  ]
};