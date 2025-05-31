
import "../styles/global.css";
import React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "Soft Built Company",
  description: "Welcome to SoftBuilt, founded by Ghulam Mujtaba, specializing in Desktop, Web, and Mobile applications, data science, and AI solutions. Partner with us to turn your project ideas into reality.",
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
