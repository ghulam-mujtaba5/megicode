"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { useTheme } from "../../../context/ThemeContext";

export default function ArticleLoading() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme === "dark" ? "linear-gradient(135deg, #181c22 0%, #232946 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%)",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <LoadingAnimation size="large" />
    </div>
  );
}
