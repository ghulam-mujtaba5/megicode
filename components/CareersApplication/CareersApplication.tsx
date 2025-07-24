"use client";
import React, { useState } from 'react';
import common from './CareersApplicationCommon.module.css';
import light from './CareersApplicationLight.module.css';
import dark from './CareersApplicationDark.module.css';
import { useTheme } from '../../context/ThemeContext';

const CareersApplication: React.FC = () => {
  const { theme } = useTheme();
  const themed = theme === 'dark' ? dark : light;
  // Helper to compose classes
  const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className={cx(common.applicationSection, themed.applicationSection)}>
      <h2 className={cx(common.heading, themed.heading)}>Apply Now</h2>
      <p className={cx(common.intro, themed.intro)}>Ready to join Megicode? Send your CV and a short intro to <a href="mailto:careers@megicode.com" className={cx(common.email, themed.email)}>careers@megicode.com</a> or use the form below:</p>
      {submitted ? (
        <div className={cx(common.successMsg, themed.successMsg)}>Thank you for applying! We’ll review your application and get in touch soon.</div>
      ) : (
        <form
          className={cx(common.form, themed.form)}
          onSubmit={e => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className={common.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={common.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={common.formGroup}>
            <label htmlFor="position">Position</label>
            <input type="text" id="position" name="position" placeholder="e.g. Frontend Engineer" required />
          </div>
          <div className={common.formGroup}>
            <label htmlFor="cv">CV/Resume (PDF)</label>
            <input type="file" id="cv" name="cv" accept="application/pdf" required />
          </div>
          <div className={common.formGroup}>
            <label htmlFor="message">Your Message</label>
            <textarea id="message" name="message" rows={4} placeholder="Tell us why you want to join..." required />
          </div>
          <button type="submit" className={cx(common.submitBtn, themed.submitBtn)}>Submit Application</button>
        </form>
      )}
    </section>
  );
};

export default CareersApplication;
