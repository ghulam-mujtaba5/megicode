import React from 'react';

import { clientReviews } from '@/lib/reviews';

import ReviewCard from '../ReviewCard/ReviewCard';
import styles from './ReviewsGrid.module.css';

const ReviewsGrid: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {clientReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </section>
  );
};

export default ReviewsGrid;
