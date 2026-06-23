'use client';

import React, { useEffect, useState } from 'react';

import styles from './article.module.css';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!items.length) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: [0, 1] }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top, behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  if (!items.length) return null;

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.tocTitle}>On this page</p>
      <ul className={styles.tocList}>
        {items.map((item) => (
          <li
            key={item.id}
            className={`${styles.tocItem} ${item.level === 3 ? styles.tocSub : ''} ${
              activeId === item.id ? styles.tocActive : ''
            }`}
          >
            <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
