'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ReviewsHeroCommon.module.css';
import lightStyles from './ReviewsHeroLight.module.css';
import darkStyles from './ReviewsHeroDark.module.css';

const ReviewsHero: React.FC = () => {
    const { theme } = useTheme();
    const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section 
            className={`${commonStyles.heroContainer} ${themeStyles.heroContainer}`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className={commonStyles.heroContent}>                <motion.h1 
                    className={`${commonStyles.title} ${themeStyles.title}`}
                    variants={itemVariants}
                >
                    Client <span className={themeStyles.highlight}>Reviews</span> & Testimonials
                </motion.h1>
                <motion.p 
                    className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}
                    variants={itemVariants}
                >
                    Discover what our clients say about their experience working with Megicode.
                    Real stories from real clients who trusted us with their vision.
                </motion.p>
            </div>
        </motion.section>
    );
};

export default ReviewsHero;
