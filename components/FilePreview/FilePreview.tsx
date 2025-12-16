'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FocusTrap } from '@/components/FocusTrap';
import styles from './FilePreview.module.css';

interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  filename: string;
  mimeType?: string | null;
}

export function FilePreview({ isOpen, onClose, url, filename, mimeType }: FilePreviewProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isImage = mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  const isPdf = mimeType === 'application/pdf' || /\.pdf$/i.test(url);

  const content = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <FocusTrap isActive={isOpen}>
          <div className={styles.header}>
            <h3 className={styles.title}>{filename}</h3>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close preview">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          
          <div className={styles.content}>
            {isImage ? (
              <img src={url} alt={filename} className={styles.image} />
            ) : isPdf ? (
              <iframe src={url} className={styles.iframe} title={filename} />
            ) : (
              <div className={styles.unsupported}>
                <p>Preview not available for this file type.</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download File
                </a>
              </div>
            )}
          </div>
        </FocusTrap>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
