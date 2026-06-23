'use client';

import React, { useState } from 'react';

import styles from './article.module.css';

interface Faq {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: Faq[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs }) => {
  const [open, setOpen] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={styles.faqSection} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className={styles.faqHeading}>
        Frequently asked questions
      </h2>
      <div className={styles.faqList}>
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <div key={index} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
              <button
                type="button"
                className={styles.faqQuestion}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <span className={styles.faqIcon} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div className={styles.faqAnswer} hidden={!isOpen}>
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqAccordion;
