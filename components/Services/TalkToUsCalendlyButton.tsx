import React from 'react';
import { useCalendlyModal } from '../CalendlyModal';
import styles from './ServiceDetail.module.css';
export function TalkToUsCalendlyButton() {
  const [openCalendly, calendlyModal] = useCalendlyModal();
  return (
    <>
      <button type="button" className={styles.ctaButton} onClick={openCalendly}>
        Talk to Us
      </button>
      {calendlyModal}
    </>
  );
}
