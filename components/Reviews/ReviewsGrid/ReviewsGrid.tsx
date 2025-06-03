import React from 'react';
import styles from './ReviewsGrid.module.css';
import ReviewCard from '../ReviewCard/ReviewCard';

const reviews = [
    {
        name: "John Smith",
        company: "Tech Innovations Inc.",
        review: "Working with Megicode was a game-changer for our business. Their expertise in AI and machine learning helped us develop a cutting-edge solution that put us ahead of our competition.",
        rating: 5
    },
    {
        name: "Sarah Johnson",
        company: "Digital Solutions Co.",
        review: "The web application Megicode developed for us exceeded our expectations. Their attention to detail and commitment to quality is outstanding.",
        rating: 5
    },
    {
        name: "Michael Chen",
        company: "DataFlow Systems",
        review: "Megicode's data science solutions helped us make sense of our complex data sets. Their team's technical expertise and professional approach made the entire process smooth.",
        rating: 5
    },
    {
        name: "Emma Davis",
        company: "Mobile First Ltd.",
        review: "The mobile app development team at Megicode delivered a fantastic product. Their understanding of user experience and technical requirements was impressive.",
        rating: 5
    },
    {
        name: "Robert Wilson",
        company: "Enterprise Solutions",
        review: "From concept to deployment, Megicode demonstrated excellence in every phase of our project. Their team's communication and technical skills are top-notch.",
        rating: 5
    },
    {
        name: "Lisa Martinez",
        company: "AI Innovations",
        review: "Megicode's AI solutions helped us automate critical processes. Their expertise in machine learning and data analysis is remarkable.",
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
