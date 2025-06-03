'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import styles from './ReviewCard.module.css';
import Image from 'next/image';

interface ReviewCardProps {
  review: {
    content: string;
    author: string;
    role: string;
    company: string;
    rating: number;
    image?: string;
    companyLogo?: string;
  };
  index: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className={`${styles.card} ${theme === 'dark' ? styles.dark : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.header}>
        {review.companyLogo && (
          <div className={styles.companyLogo}>
            <Image 
              src={review.companyLogo} 
              alt={`${review.company} logo`}
              width={80}
              height={30}
              objectFit="contain"
            />
          </div>
        )}
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`${styles.star} ${i < review.rating ? styles.filled : ''}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <blockquote className={styles.content}>
        <p>{review.content}</p>
      </blockquote>

      <div className={styles.footer}>
        <div className={styles.author}>
          {review.image && (
            <div className={styles.authorImage}>
              <Image 
                src={review.image} 
                alt={review.author}
                width={48}
                height={48}
                className={styles.avatar}
              />
            </div>
          )}
          <div className={styles.authorInfo}>
            <h4 className={styles.authorName}>{review.author}</h4>
            <p className={styles.authorRole}>
              {review.role} at <span className={styles.company}>{review.company}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
