import React from 'react';
import styles from './ReviewsGrid.module.css';
import ReviewCard from '../ReviewCard/ReviewCard';

const reviews = [
    {
        name: "Dr. Aesthetics Place",
        company: "The Aesthetics Place – aestheticsplace.pk",
        review: "Megicode built our entire clinic platform from scratch — a professional website and a complete internal management system for appointments, patient records, and billing. The team understood our medical practice needs perfectly. Our online presence went from zero to a website that actually brings in new patients. The internal portal has made daily operations seamless for our staff. Truly exceptional work from start to finish.",
        rating: 5
    },
    {
        name: "COMSATS Student",
        company: "CampusAxis – campusaxis.pk",
        review: "CampusAxis is a lifesaver. Before this, I was juggling multiple WhatsApp groups and random websites just to find my timetable or past papers. Now everything is in one place — dashboard, discussions, campus news. The team at Megicode built something students actually need and use every day. Highly recommend checking it out.",
        rating: 5
    },
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
