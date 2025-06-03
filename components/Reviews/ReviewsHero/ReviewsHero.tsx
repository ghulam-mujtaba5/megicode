import React from 'react';
import styles from './ReviewsHero.module.css';

const ReviewsHero: React.FC = () => {
    return (
        <section className={styles.heroContainer}>
            <div className={styles.heroContent}>
                <h1 className={styles.title}>Client Reviews & Testimonials</h1>
                <p className={styles.subtitle}>
                    Discover what our clients say about their experience working with Megicode.
                    Real stories from real clients who trusted us with their vision.
                </p>
            </div>
        </section>
    );
};

export default ReviewsHero;
