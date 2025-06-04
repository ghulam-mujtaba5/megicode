import React from 'react';
import styles from './ProjectTestimonials.module.css';

const testimonials = [
  {
    name: 'Sarah Lee',
    company: 'MediTech Solutions',
    feedback: 'Megicode delivered a robust AI platform that transformed our patient care. Their expertise and support are unmatched!',
    avatar: '/images/testimonials/sarah.jpg',
    badge: 'HIPAA Compliant'
  },
  {
    name: 'James Carter',
    company: 'Global Manufacturing Co.',
    feedback: 'The ERP system Megicode built increased our productivity by 30%. Their team is professional and reliable.',
    avatar: '/images/testimonials/james.jpg',
    badge: 'ISO 27001 Certified'
  },
  {
    name: 'Priya Singh',
    company: 'InvestSmart',
    feedback: 'Our fintech platform is now faster and more secure. Megicode exceeded our expectations in every way.',
    avatar: '/images/testimonials/priya.jpg',
    badge: 'PCI DSS Compliant'
  }
];

const ProjectTestimonials = () => (
  <section className={styles.testimonialsSection} aria-label="Client Testimonials">
    <div className={styles.container}>
      <h2 className={styles.title}>What Our Clients Say</h2>
      <div className={styles.grid}>
        {testimonials.map((t, idx) => (
          <div key={idx} className={styles.card}>
            <img
              src={t.avatar}
              alt={`Photo of ${t.name}`}
              className={styles.avatar}
              width={64}
              height={64}
              loading="lazy"
            />
            <blockquote className={styles.feedback}>
              “{t.feedback}”
            </blockquote>
            <div className={styles.clientInfo}>
              <span className={styles.name}>{t.name}</span>
              <span className={styles.company}>{t.company}</span>
            </div>
            <span className={styles.badge} aria-label={t.badge} role="img">🏅 {t.badge}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectTestimonials;
