'use client';

import React, { useState } from 'react';

import styles from './article.module.css';

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: 'Share on LinkedIn',
      short: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'Share on X',
      short: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'Share on WhatsApp',
      short: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.share}>
      <span className={styles.shareLabel}>Share</span>
      <div className={styles.shareButtons}>
        {links.map((link) => (
          <a
            key={link.short}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareButton}
            aria-label={link.label}
          >
            {link.short}
          </a>
        ))}
        <button type="button" className={styles.shareButton} onClick={copy}>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
