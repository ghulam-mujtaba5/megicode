'use client';
import React from 'react';
import { motion, easeOut } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import commonStyles from './ReviewCardCommon.module.css';
import lightStyles from './ReviewCardLight.module.css';
import darkStyles from './ReviewCardDark.module.css';

interface ReviewCardProps {
    name: string;
    company: string;
    image?: string;
    review: string;
    rating: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    name,
    company,
    image,
    review,
    rating
}) => {
    const { theme } = useTheme();
    const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: easeOut
            }
        }
    };

    return (
        <motion.div 
            className={`${commonStyles.card} ${themeStyles.card}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -8 }}
        >
            <div className={`${commonStyles.rating} ${themeStyles.rating}`}>
                {[...Array(rating)].map((_, index) => (
                    <span key={index} className={`${commonStyles.star} ${themeStyles.star}`}>★</span>
                ))}
            </div>
            <p className={`${commonStyles.review} ${themeStyles.review}`}>{review}</p>
            <div className={`${commonStyles.reviewer} ${themeStyles.reviewer}`}>
                {image && (
                    <div className={`${commonStyles.imageContainer} ${themeStyles.imageContainer}`}>
                        <img src={image} alt={name} className={commonStyles.image} />
                    </div>
                )}
                <div className={`${commonStyles.info} ${themeStyles.info}`}>
                    <h4 className={`${commonStyles.name} ${themeStyles.name}`}>{name}</h4>
                    <p className={`${commonStyles.company} ${themeStyles.company}`}>{company}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;
