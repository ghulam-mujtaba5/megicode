"use client";
import React, { useState, Suspense } from 'react';
import { useTheme } from '../../context/ThemeContext';
import dynamic from 'next/dynamic';
import styles from './contact.module.css';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

// Static imports for critical components
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import ThemeToggleIcon from "../../components/Icon/sbicon";

// Component interfaces
interface FooterProps {
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
  copyrightText: string;
}

// Dynamic imports for non-critical components
const Footer = dynamic<FooterProps>(
  () => import("../../components/Footer/Footer").then(mod => mod.default), {
  loading: () => <LoadingAnimation size="medium" />
});

const ParticleBackground = dynamic(
  () => import("../../components/ParticleBackground/ParticleBackground"), {
  loading: () => <LoadingAnimation size="medium" />
});

function FAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const faqs = [
    {
      question: 'How quickly do you respond?',
      answer: 'We typically respond within 24 hours during business days. Our team is committed to providing timely support and quick turnaround times for all inquiries.',
      icon: '⚡'
    },
    {
      question: 'Do you offer free consultations?',
      answer: 'Yes, we offer a free initial consultation to discuss your project needs, timeline, and budget. This helps us understand your vision and provide the best solution.',
      icon: '💬'
    },
    {
      question: 'What services do you provide?',
      answer: 'We specialize in web development, mobile apps, UI/UX design, technical consulting, cloud solutions, and digital transformation services.',
      icon: '🚀'
    },
    {
      question: 'What is your development process?',
      answer: 'We follow an agile development methodology with regular updates, milestone reviews, and continuous client collaboration to ensure project success.',
      icon: '⚙️'
    },
    {
      question: 'Do you provide ongoing support?',
      answer: 'Yes, we offer comprehensive post-launch support including maintenance, updates, bug fixes, and feature enhancements to keep your solution running smoothly.',
      icon: '🛠️'
    }
  ];

  return (
    <div className={styles.faqContainer}>
      {faqs.map((faq, idx) => (
        <div key={idx} className={`${styles.faqItem} ${openIndex === idx ? styles.faqItemOpen : ''}`}>
          <button
            type="button"
            className={styles.faqQuestion}
            aria-expanded={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div className={styles.faqQuestionContent}>
              <span className={styles.faqIcon}>{faq.icon}</span>
              <span className={styles.faqQuestionText}>{faq.question}</span>
            </div>
            <span className={`${styles.faqArrow} ${openIndex === idx ? styles.faqArrowOpen : ''}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          <div className={`${styles.faqAnswerWrapper} ${openIndex === idx ? styles.faqAnswerOpen : ''}`}>
            <div className={styles.faqAnswer}>
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContactPage() {
  const { theme } = useTheme();

  // Social/contact info
  const linkedinUrl = "https://www.linkedin.com/company/megicode";
  const instagramUrl = "https://www.instagram.com/megicode/";
  const githubUrl = "https://github.com/megicode";
  const copyrightText = "Copyright 2025 Megicode. All Rights Reserved.";
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

  return (
    <div 
      style={{ 
        backgroundColor: theme === "dark" ? "#181c22" : "#ffffff", 
        minHeight: "100vh", 
        overflowX: "hidden" 
      }}
    >
      {/* Theme Toggle Icon */}
      <div 
        id="theme-toggle" 
        role="button" 
        tabIndex={0} 
        aria-label="Toggle theme"
      >
        <ThemeToggleIcon />
      </div>

      {/* Navigation */}
      <header>
        {/* Desktop NavBar */}
        <nav 
          id="desktop-navbar" 
          aria-label="Main Navigation"
          className="hidden md:block"
        >
          <NavBarDesktop />
        </nav>

        {/* Mobile NavBar */}
        <nav 
          id="mobile-navbar" 
          aria-label="Mobile Navigation"
          className="block md:hidden"
        >
          <NavBarMobile />
        </nav>
      </header>

      {/* Main Content */}
      <main className={`${styles.container}`} data-theme={theme}>
        <div className={styles.backgroundGradient}></div>
        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <ParticleBackground />
        </Suspense>

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
  <span role="img" aria-label="Address icon" className={styles.emojiIcon}>📍</span>
</span>
                  <div className={styles.contactDetails}>
                    <h4>Address</h4>
                    <p>123 Innovation Street<br />Tech District, CA 90210</p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
  <span role="img" aria-label="Business hours icon" className={styles.emojiIcon}>🕒</span>
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
        {/* Location Section */}
        <section className={styles.mapSection}>
          <div className={styles.card}>
            <h3>Our Location</h3>
            <div className={styles.locationContainer}>
              <div className={styles.locationHeader}>
                <span className={styles.locationIcon}>🌍</span>
                <div className={styles.locationInfo}>
                  <h4>Lahore, Pakistan</h4>
                  <p>Serving clients globally from the heart of Pakistan's tech hub</p>
                </div>
              </div>
              
              <div className={styles.locationDetails}>
                <div className={styles.locationItem}>
                  <span className={styles.detailIcon}>🏙️</span>
                  <div>
                    <strong>City</strong>
                    <p>Lahore - Cultural & Tech Capital</p>
                  </div>
                </div>
                
                <div className={styles.locationItem}>
                  <span className={styles.detailIcon}>🇵🇰</span>
                  <div>
                    <strong>Country</strong>
                    <p>Pakistan - South Asia</p>
                  </div>
                </div>
                
                <div className={styles.locationItem}>
                  <span className={styles.detailIcon}>🌐</span>
                  <div>
                    <strong>Service Area</strong>
                    <p>Global - Remote & On-site</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.locationFooter}>
                <p>🚀 Ready to work with clients worldwide through modern technology and communication</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer 
        id="footer-section" 
        aria-label="Footer" 
        style={{ width: "100%", overflow: "hidden" }}
      >
        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <Footer
            linkedinUrl={linkedinUrl}
            instagramUrl={instagramUrl}
            githubUrl={githubUrl}
            copyrightText={copyrightText}
          />
        </Suspense>
      </footer>
    </div>
  );
}
