
import "../styles/global.css";
import React from "react";
import { Providers } from "./providers";

export const metadata = {
  metadataBase: new URL('https://megicode.com'),
  title: {
    default: "Megicode | Innovative Software Solutions",
    template: "%s | Megicode"
  },
  description: "Welcome to Megicode, specializing in Desktop, Web, and Mobile applications, data science, and AI solutions. Partner with us to turn your project ideas into reality.",
  keywords: ["software development", "web development", "mobile apps", "desktop applications", "AI solutions", "data science"],
  authors: [{ name: "Ghulam Mujtaba" }],
  creator: "Ghulam Mujtaba",
  publisher: "Megicode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/meta/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/meta/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/meta/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/meta/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/meta/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/meta/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/meta/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://megicode.com",
    siteName: "Megicode",
    title: "Megicode - Modern Software Solutions",
    description: "Expert software development services including web, mobile, desktop applications, AI solutions, and data science.",
    images: [
      {
        url: "/meta/og-image.png",
        width: 1200,
        height: 630,
        alt: "Megicode - Modern Software Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Megicode - Modern Software Solutions",
    description: "Expert software development services including web, mobile, desktop applications, AI solutions, and data science.",
    images: ["/meta/twitter-card.png"],
    creator: "@megicode",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
