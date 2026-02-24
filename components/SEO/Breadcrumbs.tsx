"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight, FaHome } from "react-icons/fa";

interface BreadcrumbItem {
    name: string;
    path: string;
}

export default function Breadcrumbs({
    theme = 'light'
}: {
    theme?: 'light' | 'dark'
}) {
    const pathname = usePathname();
    const isDark = theme === 'dark';

    if (pathname === '/') return null;

    // Split path into segments and filter out empty strings
    const segments = pathname.split('/').filter(Boolean);

    // Create breadcrumb items
    const items: BreadcrumbItem[] = segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        // Formatting: replace hyphens with spaces and capitalize
        const name = segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

        return { name, path };
    });

    // Styles
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        fontSize: '0.9rem',
        color: isDark ? '#a8b0c0' : '#64748b',
        background: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.4)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        marginBottom: '24px',
        listStyle: 'none',
        width: 'fit-content',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    };

    const linkStyle: React.CSSProperties = {
        color: 'inherit',
        textDecoration: 'none',
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    };

    const activeLinkStyle: React.CSSProperties = {
        ...linkStyle,
        color: '#4573df',
        fontWeight: 600,
        pointerEvents: 'none',
    };

    return (
        <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
            <ol style={containerStyle}>
                <li>
                    <Link href="/" style={linkStyle} title="Home">
                        <FaHome size={14} style={{ marginBottom: '2px' }} />
                        <span>Home</span>
                    </Link>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <React.Fragment key={item.path}>
                            <li style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                                <FaChevronRight size={10} />
                            </li>
                            <li>
                                <Link
                                    href={item.path}
                                    style={isLast ? activeLinkStyle : linkStyle}
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
