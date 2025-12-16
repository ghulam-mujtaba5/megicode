"use client";

import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Separator between items */
  separator?: React.ReactNode;
  /** Maximum items to show (collapses middle if exceeded) */
  maxItems?: number;
  /** Custom className */
  className?: string;
}

export default function Breadcrumbs({
  items,
  separator = "/",
  maxItems,
  className,
}: BreadcrumbsProps) {
  // If maxItems is set and we have more items, collapse the middle
  let displayItems = items;
  let collapsed = false;

  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [firstItem, { label: "..." }, ...lastItems];
    collapsed = true;
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: "0.875rem",
        }}
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isCollapsedIndicator = collapsed && index === 1;

          return (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {/* Separator (not before first item) */}
              {index > 0 && (
                <span
                  style={{
                    color: "var(--text-muted, #9ca3af)",
                    fontSize: "0.75rem",
                  }}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}

              {/* Breadcrumb item */}
              {isCollapsedIndicator ? (
                <span
                  style={{
                    color: "var(--text-muted, #9ca3af)",
                    padding: "0.125rem 0.25rem",
                  }}
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              ) : isLast || !item.href ? (
                <span
                  style={{
                    color: isLast
                      ? "var(--text-primary, #1f2937)"
                      : "var(--text-secondary, #6b7280)",
                    fontWeight: isLast ? 500 : 400,
                  }}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  style={{
                    color: "var(--text-secondary, #6b7280)",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "var(--primary, #3b82f6)";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary, #6b7280)";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Convenience component for internal portal breadcrumbs
interface InternalBreadcrumbsProps {
  /** Current page label */
  current: string;
  /** Parent pages leading to current */
  parents?: { label: string; href: string }[];
}

export function InternalBreadcrumbs({ current, parents = [] }: InternalBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/internal" },
    ...parents,
    { label: current },
  ];

  return <Breadcrumbs items={items} separator="›" />;
}
