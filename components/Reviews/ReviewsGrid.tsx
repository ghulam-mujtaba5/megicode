'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import commonStyles from './ReviewsCommon.module.css';
import lightStyles from './ReviewsLight.module.css';
import darkStyles from './ReviewsDark.module.css';
import Image from 'next/image';

const reviews = [
  {
    content: "Megicode's innovative approach to AI integration transformed our business operations. Their team delivered exceptional results that exceeded our expectations.",
    author: "Emily Chen",
    role: "CTO at TechSphere",
    rating: 5,
    companyLogo: "/softbuiltsolutions-icon.svg" // Using existing icon as placeholder
  },
  {
    content: "Outstanding web development service! The team's expertise in modern technologies helped us create a cutting-edge platform that our users love.",
    author: "Michael Roberts",
    role: "Product Director at InnovateTech",
    rating: 5,
    companyLogo: "/megicode-logo-alt.svg" // Using existing icon as placeholder
  },
  {
    content: "The data visualization solutions provided by Megicode gave us incredible insights into our business metrics. Their work was truly game-changing.",
    author: "Sarah Thompson",
    role: "Analytics Lead at DataFlow",
    rating: 5,
    companyLogo: "/megicode-wordmark.svg" // Using existing icon as placeholder
  }
];

const ReviewsGrid = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`${commonStyles.gridSection} ${themeStyles.gridSection}`}>
      <div className={commonStyles.reviewsContainer}>
        <motion.h2 
          className={`${commonStyles.sectionTitle} ${themeStyles.sectionTitle}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Client Testimonials
        </motion.h2>
        <motion.p 
          className={`${commonStyles.sectionSubtitle} ${themeStyles.sectionSubtitle}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Hear what our clients say about their experience working with Megicode
        </motion.p>
        
        <motion.div 
          className={commonStyles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              className={`${commonStyles.gridItem} ${themeStyles.gridItem}`}
              variants={itemVariants}
            >
              <div className={commonStyles.card}>
                <div className={commonStyles.cardHeader}>
                  <div className={`${commonStyles.logoContainer} ${themeStyles.logoContainer}`}>
                    <Image 
                      src={review.companyLogo}
                      alt="Company logo"
                      width={40}
                      height={40}
                      className={commonStyles.logo}
                    />
                  </div>
                  <div className={commonStyles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`${commonStyles.star} ${themeStyles.star} ${
                          i < review.rating ? themeStyles.filled : ''
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <blockquote className={`${commonStyles.content} ${themeStyles.content}`}>
                  {review.content}
                </blockquote>

                <div className={commonStyles.reviewFooter}>
                  <div className={commonStyles.authorInfo}>
                    <h4 className={`${commonStyles.authorName} ${themeStyles.authorName}`}>
                      {review.author}
                    </h4>
                    <p className={`${commonStyles.authorRole} ${themeStyles.authorRole}`}>
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsGrid;
