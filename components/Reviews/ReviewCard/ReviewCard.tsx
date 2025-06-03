import React from 'react';
import styles from './ReviewCard.module.css';

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
    return (
        <div className={styles.card}>
            <div className={styles.rating}>
                {[...Array(rating)].map((_, index) => (
                    <span key={index} className={styles.star}>★</span>
                ))}
            </div>
            <p className={styles.review}>{review}</p>
            <div className={styles.reviewer}>
                {image && (
                    <div className={styles.imageContainer}>
                        <img src={image} alt={name} className={styles.image} />
                    </div>
                )}
                <div className={styles.info}>
                    <h4 className={styles.name}>{name}</h4>
                    <p className={styles.company}>{company}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
