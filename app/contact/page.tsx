"use client";
import React, { useState, Suspense } from 'react';
import { useTheme } from '../../context/ThemeContext';
import dynamic from 'next/dynamic';
import styles from './contact.module.css';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaLinkedin, FaGithub, FaInstagram, FaCheckCircle, FaBolt, FaComments, FaRocket, FaCogs, FaTools
} from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

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

// TODO: Update FAQ content to be more specific to your services.
function FAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const faqs = [
    {
      question: 'How quickly do you respond?',
      answer: 'We typically respond within 24 hours during business days. Our team is committed to providing timely support and quick turnaround times for all inquiries.',
      icon: <FaBolt />
    },
    {
      question: 'Do you offer free consultations?',
      answer: 'Yes, we offer a free initial consultation to discuss your project needs, timeline, and budget. This helps us understand your vision and provide the best solution.',
      icon: <FaComments />
    },
    {
      question: 'What services do you provide?',
      answer: 'We specialize in web development, mobile apps, UI/UX design, technical consulting, cloud solutions, and digital transformation services.',
      icon: <FaRocket />
    },
    {
      question: 'What is your development process?',
      answer: 'We follow an agile development methodology with regular updates, milestone reviews, and continuous client collaboration to ensure project success.',
      icon: <FaCogs />
    },
    {
      question: 'Do you provide ongoing support?',
      answer: 'Yes, we offer comprehensive post-launch support including maintenance, updates, bug fixes, and feature enhancements to keep your solution running smoothly.',
      icon: <FaTools />
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
              <span className={styles.faqIcon} aria-hidden="true">{faq.icon}</span>
              <span className={styles.faqQuestionText}>{faq.question}</span>
            </div>
                        <span className={`${styles.faqArrow} ${openIndex === idx ? styles.faqArrowOpen : ''}`} aria-hidden="true">
              <FiChevronRight />
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  // Validation functions
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'subject':
        return value.trim().length < 3 ? 'Subject must be at least 3 characters' : '';
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
      case 'phone':
        if (value && !/^\+?[0-9\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });
    
    // Validate optional phone field if provided
    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('Please fix the errors above before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setSubmitStatus('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '', service: '' });
        setErrors({});
        setTouched({});
        
        setTimeout(() => {
          setShowSuccess(false);
          setSubmitStatus('');
        }, 6000);
      } else {
        const errorData = await response.json();
        setSubmitStatus(errorData.error || 'Sorry, there was an error sending your message.');
      }
    } catch (error) {
      setSubmitStatus('Sorry, there was an error sending your message. Please try again or contact us directly.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                <div className={styles.formIcon} aria-hidden="true"><FaEnvelope /></div>
                <div>
                  <h2 className={styles.formTitle}>Send us a Message</h2>
                  <p className={styles.formSubtitle}>We'll get back to you within 24 hours</p>
                </div>
              </div>

              {/* Success Message */}
              {submitStatus && !showSuccess && (
                <div className={styles.statusMessage} role="alert">{submitStatus}</div>
              )}
              {showSuccess && (
                <div className={styles.successMessage}>
                  <FaCheckCircle className={styles.successIcon} aria-hidden="true" />
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
          onBlur={handleBlur}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          required
          aria-label="Full name"
          placeholder=" "
        />
        <label htmlFor="name" className={styles.floatingLabel}>Name *</label>
      </div>
      {errors.name ? (
        <span className={styles.errorText}>{errors.name}</span>
      ) : (
        <span className={styles.helperText}>Required</span>
      )}
    </div>
    <div className={styles.formGroup}>
      <div className={styles.floatingLabelGroup}>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          required
          aria-label="Email address"
          placeholder=" "
        />
        <label htmlFor="email" className={styles.floatingLabel}>Email *</label>
      </div>
      {errors.email ? (
        <span className={styles.errorText}>{errors.email}</span>
      ) : (
        <span className={styles.helperText}>Required</span>
      )}
    </div>
  </div>

                {/* Second Row - Phone and Company */}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        aria-label="Phone number"
                        placeholder=" "
                      />
                      <label htmlFor="phone" className={styles.floatingLabel}>Phone</label>
                    </div>
                    {errors.phone ? (
                      <span className={styles.errorText}>{errors.phone}</span>
                    ) : (
                      <span className={styles.helperText}>Optional</span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        aria-label="Company name"
                        placeholder=" "
                      />
                      <label htmlFor="company" className={styles.floatingLabel}>Company</label>
                    </div>
                    <span className={styles.helperText}>Optional</span>
                  </div>
                </div>

                {/* Service Interest */}
                <div className={styles.formGroupFull}>
                  <div className={styles.floatingLabelGroup}>
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
                      <option value="cloud-solutions">Cloud Solutions</option>
                      <option value="digital-transformation">Digital Transformation</option>
                      <option value="other">Other</option>
                    </select>
                    <label htmlFor="service" className={styles.floatingLabel}>Service Interest</label>
                  </div>
                </div>

                {/* Subject */}
                <div className={styles.formGroupFull}>
                  <div className={styles.floatingLabelGroup}>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
                      required
                      aria-label="Message subject"
                      placeholder=" "
                    />
                    <label htmlFor="subject" className={styles.floatingLabel}>Subject *</label>
                  </div>
                  {errors.subject ? (
                    <span className={styles.errorText}>{errors.subject}</span>
                  ) : (
                    <span className={styles.helperText}>Required</span>
                  )}
                </div>

                {/* Message */}
                <div className={styles.formGroupFull}>
                  <div className={styles.floatingLabelGroup}>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`${styles.input} ${styles.textarea}`}
                      rows={5}
                      aria-label="Your message"
                      placeholder=" "
                      required
                    ></textarea>
                    <label htmlFor="message" className={styles.floatingLabel}>Message *</label>
                  </div>
                  {errors.message ? (
                    <span className={styles.errorText}>{errors.message}</span>
                  ) : (
                    <span className={styles.helperText}>Required - Tell us about your project</span>
                  )}
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
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaEnvelope />
                  </span>
                  <div className={styles.contactDetails}>
                    <h4>Email</h4>
                    <p><a href="mailto:info@megicode.com">info@megicode.com</a></p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaPhoneAlt />
                  </span>
                  <div className={styles.contactDetails}>
                                        {/* TODO: Replace with your actual phone number */}
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                    <p className={styles.contactNote}>WhatsApp Available</p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaMapMarkerAlt />
                  </span>
                  <div className={styles.contactDetails}>
                                        {/* TODO: Verify and update your business location */}
                    <h4>Location</h4>
                    <p>Lahore, Pakistan<br />Serving clients globally</p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaClock />
                  </span>
                  <div className={styles.contactDetails}>
                                        {/* TODO: Update with your actual business hours */}
                    <h4>Business Hours</h4>
                    <p>Mon - Fri, 9 AM - 5 PM PST</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.socialSection}>
                <h4>Follow Us</h4>
                <div className={styles.socialLinks}>
                  <a href="https://www.linkedin.com/company/megicode" className={`${styles.socialLink} ${styles.linkedinLink}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FaLinkedin />
                  </a>
                  <a href="https://github.com/megicode" className={`${styles.socialLink} ${styles.githubLink}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <FaGithub />
                  </a>
                  <a href="https://www.instagram.com/megicode/" className={`${styles.socialLink} ${styles.instagramLink}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram />
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
