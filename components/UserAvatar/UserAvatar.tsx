"use client";

import React from "react";
import Image from "next/image";

interface UserAvatarProps {
  user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  } | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showStatus?: boolean;
  status?: "online" | "offline" | "busy" | "away";
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const fontSizeMap = {
  xs: "0.625rem",
  sm: "0.75rem",
  md: "0.875rem",
  lg: "1rem",
  xl: "1.25rem",
};

export default function UserAvatar({
  user,
  size = "md",
  className = "",
  showStatus = false,
  status = "offline",
}: UserAvatarProps) {
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(user?.name || user?.email);
  const backgroundColor = stringToColor(user?.name || user?.email || "default");

  return (
    <div
      className={`user-avatar ${className}`}
      style={{
        position: "relative",
        width: dimension,
        height: dimension,
        flexShrink: 0,
      }}
      title={user?.name || user?.email || "User"}
    >
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name || "User avatar"}
          width={dimension}
          height={dimension}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: backgroundColor,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: fontSize,
            fontWeight: 600,
            userSelect: "none",
          }}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: Math.max(8, dimension * 0.25),
            height: Math.max(8, dimension * 0.25),
            borderRadius: "50%",
            border: "2px solid var(--bg-surface, #fff)",
            background:
              status === "online"
                ? "#10b981"
                : status === "busy"
                ? "#ef4444"
                : status === "away"
                ? "#f59e0b"
                : "#9ca3af",
          }}
        />
      )}
    </div>
  );
}

// Helper to generate consistent colors from strings
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}
