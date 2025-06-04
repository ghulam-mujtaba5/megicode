import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  'aria-label'?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  'aria-label': ariaLabel = 'Loading...',
}) => {
  return (
    <div
      className={`${styles.spinnerWrapper} ${styles[size]}`}
      role="progressbar"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <div className={styles.spinner}>
        <div className={styles.bounce1}></div>
        <div className={styles.bounce2}></div>
        <div className={styles.bounce3}></div>
      </div>
    </div>
  );
};
