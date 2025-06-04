import React from 'react';
import styles from './ProjectMetrics.module.css';

const ProjectMetrics = () => {
  const metrics = [
    {
      number: '98%',
      label: 'Project Success Rate',
      description: 'Successfully delivered projects on time and within budget'
    },
    {
      number: '85%',
      label: 'Cost Reduction',
      description: 'Average operational cost reduction for our clients'
    },
    {
      number: '200%',
      label: 'ROI Increase',
      description: 'Average return on investment for enterprise solutions'
    },
    {
      number: '24/7',
      label: 'Support Available',
      description: 'Round-the-clock technical support and maintenance'
    }
  ];

  return (
    <section className={styles.metrics}>
      <div className={styles.container}>
        <h2 className={styles.title}>Performance Metrics</h2>
        <div className={styles.grid}>
          {metrics.map((metric, index) => (
            <div key={index} className={styles.metric}>
              <h3 className={styles.number}>{metric.number}</h3>
              <h4 className={styles.label}>{metric.label}</h4>
              <p className={styles.description}>{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectMetrics;
