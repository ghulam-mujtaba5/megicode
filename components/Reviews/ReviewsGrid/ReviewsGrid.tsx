import React from 'react';
import styles from './ReviewsGrid.module.css';
import ReviewCard from '../ReviewCard/ReviewCard';

const reviews = [
    {
        name: "John Smith",
        company: "Tech Innovations Inc.",
        review: "Working with Megicode was a game-changer for our business. Their expertise in AI and machine learning helped us develop a cutting-edge solution that put us ahead of our competition. The team's innovative approach and technical excellence exceeded our expectations.",
        rating: 5
    },
    {
        name: "Sarah Johnson",
        company: "Digital Solutions Co.",
        review: "The web application Megicode developed for us exceeded our expectations. Their attention to detail and commitment to quality is outstanding. From initial concept to final deployment, every step was handled with utmost professionalism.",
        rating: 5
    },
    {
        name: "Michael Chen",
        company: "DataFlow Systems",
        review: "Megicode's data science solutions helped us make sense of our complex data sets. Their team's technical expertise and professional approach made the entire process smooth. The insights we gained have transformed our decision-making process.",
        rating: 5
    }
];

const ReviewsGrid: React.FC = () => {
    return (
        <section className={styles.container}>
            <div className={styles.grid}>
                {reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                ))}
            </div>
        </section>
    );
};

export default ReviewsGrid;
