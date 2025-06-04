import React from 'react';
import styles from './ProjectContact.module.css';

const ProjectContact = () => {
  return (
    <section className={styles.contact}>
      <div className={styles.container}>
        <h2 className={styles.title}>Let's Build Something Amazing Together</h2>
        <p className={styles.subtitle}>
          Ready to transform your business with cutting-edge technology solutions?
        </p>
        
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Full Name"
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Business Email"
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Company Name"
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <select className={styles.select} required>
              <option value="">Select Service Type</option>
              <option value="enterprise">Enterprise Solutions</option>
              <option value="saas">SaaS Development</option>
              <option value="ai">AI & Machine Learning</option>
              <option value="consulting">Technical Consulting</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <textarea
              placeholder="Project Description"
              className={styles.textarea}
              rows={4}
              required
            ></textarea>
          </div>
          
          <button type="submit" className={styles.button}>
            Get Started
          </button>
        </form>
        
        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <i className={styles.icon}>📧</i>
            <p>contact@megicode.com</p>
          </div>
          <div className={styles.infoItem}>
            <i className={styles.icon}>📱</i>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectContact;
