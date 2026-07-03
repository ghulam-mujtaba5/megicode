import React from 'react';

import styles from './PipelineDivider.module.css';

/**
 * Section joint for the site's pipeline motif (plan §1): a short vertical
 * blueprint line with a node dot and a pulse that travels down it —
 * the same "data flowing through the system" language as the hero diagram.
 * Purely decorative; hidden from assistive tech and static under reduced motion.
 */
export default function PipelineDivider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.line}>
        <span className={styles.pulse} />
      </span>
      <span className={styles.node} />
    </div>
  );
}
