import React from 'react';
import { useCalendlyModal } from '../CalendlyModal';
import styles from './ServiceDetail.module.css';
export function RequestDemoCalendlyButton() {
  const [openCalendly, calendlyModal] = useCalendlyModal();
  return (
    <>
      <button type="button" className={styles.ctaButton} data-animate="cta-bounce" onClick={openCalendly}>
        <span role="img" aria-label="Talk to AI Consultant" style={{ marginRight: 8 }}>🤖</span>Request Demo
      </button>
      {calendlyModal}
    </>
  );
}
