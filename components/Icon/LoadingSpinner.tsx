import React from 'react';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  'aria-label'?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  'aria-label': ariaLabel = 'Loading...',
}) => {
  return (
    <div role="progressbar" aria-label={ariaLabel} aria-busy="true">
      <LoadingAnimation size={size} showLogo={false} />
    </div>
  );
};
