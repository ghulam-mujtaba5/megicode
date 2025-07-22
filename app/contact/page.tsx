"use client";
import React, { useState, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import ParticleBackground from "../../components/ParticleBackground/ParticleBackground";
import styles from "./contact.module.css";

function FAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const faqs = [
    {
      question: 'How quickly do you respond?',
      answer: 'We typically respond within 24 hours during business days.'
    },
    {
      question: 'Do you offer free consultations?',
      answer: 'Yes, we offer a free initial consultation to discuss your project needs.'
    },
    {
      question: 'What services do you provide?',
      answer: 'We specialize in web development, mobile apps, UI/UX design, and technical consulting.'
    }
  ];
  return (
    <div>
      {faqs.map((faq, idx) => (
        <div key={idx} className={styles.faqItem}>
          <button
  type="button"
  className={styles.faqQuestion}
  aria-expanded={openIndex === idx}
  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
>
  {faq.question}
  <span className={styles.faqArrow}>▶</span>
</button>
{openIndex === idx && (
  <div className={styles.faqAnswer}>{faq.answer}</div>
)}
        </div>
      ))}
    </div>
  );
}

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const onDarkModeButtonContainerClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setSubmitStatus('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '', service: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";

  return (
    <div className={styles.container} data-theme={theme}>
      {/* Enhanced Background with Particles */}
      <div className={styles.backgroundGradient}></div>
      <ParticleBackground />
      
      {/* Enhanced Navigation Container */}
      <div className={styles.navigation}>
          {/* Theme Toggle */}
          <div 
            className={styles.themeToggle}
            id="theme-toggle" 
            role="button" 
            tabIndex={0} 
            onClick={onDarkModeButtonContainerClick}
            title="Toggle dark/light theme"
            aria-label="Toggle dark/light theme"
          >
            <ThemeToggleIcon />
          </div>
          <NavBarDesktop />
          <NavBarMobile />
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroDescription}>
            Ready to transform your business? Get in touch with our expert team and let's discuss how we can help you achieve your goals.
          </p>
          <div className={styles.heroAccent}></div>
        </section>

        {/* Contact Content */}
        <section className={styles.contactSection}>
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div className={`${styles.card} ${styles.formCard}`}>
              <div className={styles.formTopBorder}></div>
              
              {/* Form Header */}
              <div className={styles.formHeader}>
                <div className={styles.formIcon}>📧</div>
                <div>
                  <h2 className={styles.formTitle}>Send us a Message</h2>
                  <p className={styles.formSubtitle}>We'll get back to you within 24 hours</p>
                </div>
              </div>

              {/* Success Message */}
              {showSuccess && (
  <div className={styles.successMessage}>
    <span role="img" aria-label="Success" className={styles.successIcon}>✅</span>
    <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
  </div>
)}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} autoComplete="off">
  {/* First Row - Name and Email */}
  <div className={styles.formGrid}>
    <div className={styles.formGroup}>
      <div className={styles.floatingLabelGroup}>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={styles.input}
          required
          aria-label="Full name"
          placeholder=" "
        />
        <label htmlFor="name" className={styles.floatingLabel}>Name *</label>
      </div>
      <span className={styles.helperText}>Required</span>
    </div>
    <div className={styles.formGroup}>
      <div className={styles.floatingLabelGroup}>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles.input}
          required
          aria-label="Email address"
          placeholder=" "
        />
        <label htmlFor="email" className={styles.floatingLabel}>Email *</label>
      </div>
      <span className={styles.helperText}>Required</span>
    </div>
  </div>

                {/* Second Row - Phone and Company */}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={styles.input}
                      aria-label="Phone number"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="company" className={styles.label}>Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                      className={styles.input}
                      aria-label="Company name"
                    />
                  </div>
                </div>

                {/* Service Interest */}
                <div className={styles.formGroupFull}>
                  <label htmlFor="service" className={styles.label}>Service Interest</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className={styles.input}
                    aria-label="Service of interest"
                  >
                    <option value="">Select a service</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-apps">Mobile Applications</option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="consulting">Technical Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subject */}
                <div className={styles.formGroupFull}>
                  <label htmlFor="subject" className={styles.label}>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief subject of your inquiry"
                    className={styles.input}
                    aria-label="Message subject"
                  />
                </div>

                {/* Message */}
                <div className={styles.formGroupFull}>
                  <label htmlFor="message" className={styles.label}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project or inquiry..."
                    className={`${styles.input} ${styles.textarea}`}
                    rows={5}
                    aria-label="Your message"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                  aria-label={isSubmitting ? "Sending message..." : "Send message"}
                >
                  <div className={styles.buttonContent}>
                    {isSubmitting ? (
                      <>
                        <div className={styles.spinner}></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span>🚀</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className={styles.card}>
              <h3>Contact Information</h3>
              
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
  <img src="/email icon.svg" alt="Email icon" width={24} height={24} />
</span>
                  <div className={styles.contactDetails}>
                    <h4>Email</h4>
                    <p><a href="mailto:info@megicode.com">info@megicode.com</a></p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
  <img src="/phone-icon.svg" alt="Phone icon" width={24} height={24} />
</span>
                  <div className={styles.contactDetails}>
                    <h4>Phone</h4>
                    <p>+123 456 7890</p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
  <span role="img" aria-label="Address icon" style={{fontSize: 24, verticalAlign: 'middle'}}>📍</span>
</span>
                  <div className={styles.contactDetails}>
                    <h4>Address</h4>
                    <p>123 Innovation Street<br />Tech District, CA 90210</p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
  <span role="img" aria-label="Business hours icon" style={{fontSize: 24, verticalAlign: 'middle'}}>🕒</span>
</span>
                  <div className={styles.contactDetails}>
                    <h4>Business Hours</h4>
                    <p>24/7 Support Available</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.socialSection}>
                <h4>Follow Us</h4>
                <div className={styles.socialLinks}>
  <a href="https://www.linkedin.com/company/megicode" className={`${styles.socialLink} ${styles.linkedinLink}`} target="_blank" rel="noopener" aria-label="LinkedIn">
    <img src="/linkedin-icon.svg" alt="LinkedIn" width={28} height={28} />
  </a>
  <a href="https://github.com/megicode" className={`${styles.socialLink} ${styles.githubLink}`} target="_blank" rel="noopener" aria-label="GitHub">
    <img src="/github_icon.svg" alt="GitHub" width={28} height={28} />
  </a>
  <a href="https://www.instagram.com/megicode/" className={`${styles.socialLink} ${styles.instagramLink}`} target="_blank" rel="noopener" aria-label="Instagram">
    <img src="/Instagram-icon.svg" alt="Instagram" width={28} height={28} />
  </a>
</div>                </div>
              </div>

              <div className={styles.sectionDivider}></div>
                {/* FAQ Section */}
                <div className={styles.faqSection}>
                  <h3>Frequently Asked Questions</h3>
                  <FAQAccordion />
                </div>
            </div>
          </section>

        <div className={styles.sectionDivider}></div>
        {/* Map Section */}
        <section className={styles.mapSection}>
          <div className={styles.card}>
            <h3>Find Us</h3>
            <div className={styles.mapPlaceholder}>
              <div>
                <span className={styles.mapIcon}>🗺️</span>
                <div>Interactive Map Coming Soon</div>
                <div className={styles.mapText}>We're located in the heart of the tech district</div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
    </div>
  );
}
