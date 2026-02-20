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
