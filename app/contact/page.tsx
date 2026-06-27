'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {
  HiChatBubbleLeftRight,
  HiCheckCircle,
  HiChevronRight,
  HiClock,
  HiCog6Tooth,
  HiCurrencyDollar,
  HiEnvelope,
  HiExclamationCircle,
  HiGlobeAlt,
  HiMapPin,
  HiPaperAirplane,
  HiRocketLaunch,
} from 'react-icons/hi2';

import dynamic from 'next/dynamic';

import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

import ThemeToggleIcon from '../../components/Icon/sbicon';
import NewNavBar from '../../components/NavBar_Desktop_Company/NewNavBar';
import NavBarMobile from '../../components/NavBar_Mobile/NavBar-mobile';
import { useTheme } from '../../context/ThemeContext';
import styles from './contact.module.css';

const LottiePlayer = dynamic(() => import('@/components/LottiePlayer/LottiePlayer'), {
  ssr: false,
});

interface FooterProps {
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
  copyrightText: string;
}

const Footer = dynamic<FooterProps>(
  () => import('../../components/Footer/Footer').then((mod) => mod.default),
  {
    loading: () => <LoadingAnimation size="medium" />,
  }
);

const ParticleBackground = dynamic(
  () => import('../../components/ParticleBackground/ParticleBackground'),
  {
    loading: () => <LoadingAnimation size="medium" />,
  }
);

function FAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const faqs = [
    {
      question: 'What types of projects do you specialize in?',
      answer:
        'We specialize in building custom web applications, scalable mobile apps, AI-powered SaaS products, and enterprise software. We partner with startups, non-technical founders, and growing businesses to ship intelligent digital products.',
      icon: <HiRocketLaunch size={18} />,
    },
    {
      question: 'Which technologies do you work with?',
      answer:
        'Our core stack includes React, Next.js, Node.js, and Python for web and AI development, React Native for mobile, and AWS/Vercel for cloud infrastructure. We also cover LLM integrations, data pipelines, and CI/CD automation.',
      icon: <HiCog6Tooth size={18} />,
    },
    {
      question: 'What does your typical project timeline look like?',
      answer:
        'Projects follow four phases: Discovery & Strategy (1–2 weeks), Design & Prototyping (2–4 weeks), Development & Testing (6–12 weeks), and Deployment & Support. We always provide a detailed roadmap before work begins.',
      icon: <HiClock size={18} />,
    },
    {
      question: 'How do you handle project management and communication?',
      answer:
        'We use an agile approach with weekly sprints and regular check-ins. You get a dedicated project manager, access to a shared workspace, and real-time progress visibility throughout the engagement.',
      icon: <HiChatBubbleLeftRight size={18} />,
    },
    {
      question: 'What are your pricing models?',
      answer:
        'We offer fixed-price contracts for well-scoped projects, time-and-materials for iterative development, and dedicated team retainers for ongoing work. A free consultation is always the first step — no commitments required.',
      icon: <HiCurrencyDollar size={18} />,
    },
  ];

  return (
    <div className={styles.faqContainer}>
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className={`${styles.faqItem} ${openIndex === idx ? styles.faqItemOpen : ''}`}
        >
          <button
            type="button"
            className={styles.faqQuestion}
            aria-expanded={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div className={styles.faqQuestionContent}>
              <span className={styles.faqIcon} aria-hidden="true">
                {faq.icon}
              </span>
              <span className={styles.faqQuestionText}>{faq.question}</span>
            </div>
            <span
              className={`${styles.faqArrow} ${openIndex === idx ? styles.faqArrowOpen : ''}`}
              aria-hidden="true"
            >
              <HiChevronRight size={18} />
            </span>
          </button>
          <div
            className={`${styles.faqAnswerWrapper} ${openIndex === idx ? styles.faqAnswerOpen : ''}`}
          >
            <div className={styles.faqAnswer}>{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme();
  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);

  const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
  const copyrightText = getCopyrightText();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    service: '',
  });

  useEffect(() => {
    const heroEl = heroRef.current;
    const titleEl = titleRef.current;
    const accentEl = accentRef.current;
    if (!heroEl || !titleEl || !accentEl) return;

    let rafId: number | null = null;

    function handleMove(e: MouseEvent) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = heroEl.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tx = (x / rect.width) * 10;
        const ty = (y / rect.height) * 6;
        const rotX = (y / rect.height) * -6;
        const rotY = (x / rect.width) * 6;
        titleEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        accentEl.style.transform = `translate3d(${tx * 0.6}px, ${ty * 0.6}px, 0) scale(1.02)`;
      });
    }

    function handleLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      titleEl.style.transition = 'transform 600ms cubic-bezier(.2,.9,.2,1)';
      accentEl.style.transition = 'transform 600ms cubic-bezier(.2,.9,.2,1)';
      titleEl.style.transform = '';
      accentEl.style.transform = '';
      setTimeout(() => {
        titleEl.style.transition = '';
        accentEl.style.transition = '';
      }, 650);
    }

    heroEl.addEventListener('mousemove', handleMove);
    heroEl.addEventListener('mouseleave', handleLeave);
    heroEl.addEventListener('touchstart', handleLeave);
    return () => {
      heroEl.removeEventListener('mousemove', handleMove);
      heroEl.removeEventListener('mouseleave', handleLeave);
      heroEl.removeEventListener('touchstart', handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Please enter a valid email address'
          : '';
      case 'subject':
        return value.trim().length < 3 ? 'Subject must be at least 3 characters' : '';
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
      case 'service':
        return !value ? 'Please select a service' : '';
      case 'phone':
        if (value && !/^\+?[0-9\s\-\(\)]{10,}$/.test(value.replace(/\s/g, '')))
          return 'Please enter a valid phone number';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    ['name', 'email', 'subject', 'message', 'service'].forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });
    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          service: '',
        });
        setErrors({});
        setTouched({});
        setTimeout(() => setShowSuccess(false), 6000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Sorry, there was an error sending your message.');
        setTimeout(() => setSubmitError(''), 6000);
      }
    } catch (error) {
      setSubmitError(
        'Sorry, there was an error sending your message. Please try again or contact us directly.'
      );
      console.error('Form submission error:', error);
      setTimeout(() => setSubmitError(''), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor:
          theme === 'dark' ? 'var(--page-bg-dark, #1d2127)' : 'var(--page-bg, #ffffff)',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <div
        id="theme-toggle"
        role="button"
        tabIndex={0}
        aria-label="Toggle theme"
        onClick={toggleTheme}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        }}
      >
        <ThemeToggleIcon />
      </div>

      <header>
        <NewNavBar />
        <NavBarMobile />
      </header>

      <main id="main-content" className={styles.container} data-theme={theme}>
        <div className={styles.backgroundGradient} />
        <Suspense fallback={<LoadingAnimation size="medium" />}>
          <ParticleBackground />
        </Suspense>

        {/* ── Hero ── */}
        <section className={styles.heroSection} ref={heroRef}>
          <div className={styles.heroLottie}>
            <LottiePlayer
              src="/lottie/12_customer_support_agent.json"
              loop
              autoplay
              pauseWhenHidden
              speed={0.8}
              style={{ width: 84, height: 84 }}
              ariaLabel="Animated contact illustration"
            />
          </div>
          <span className={styles.heroEyebrow}>Get In Touch</span>
          <h1 ref={titleRef} className={styles.heroTitle}>
            Let&apos;s Build
            <br />
            Something Great
          </h1>
          <p className={styles.heroDescription}>
            Tell us about your project and we&apos;ll get back to you within 24 hours with a free
            consultation and a clear plan forward.
          </p>
          <div className={styles.trustBar}>
            <div className={styles.trustItem}>
              <HiClock size={15} aria-hidden="true" />
              <span>24h Response</span>
            </div>
            <div className={styles.trustDot} aria-hidden="true" />
            <div className={styles.trustItem}>
              <HiGlobeAlt size={15} aria-hidden="true" />
              <span>Remote-First</span>
            </div>
            <div className={styles.trustDot} aria-hidden="true" />
            <div className={styles.trustItem}>
              <HiChatBubbleLeftRight size={15} aria-hidden="true" />
              <span>Free Consultation</span>
            </div>
          </div>
          <div ref={accentRef} className={styles.heroAccent} />
        </section>

        {/* ── Contact Grid ── */}
        <section className={styles.contactSection}>
          <div className={styles.contactGrid}>
            {/* Form card */}
            <div className={`${styles.card} ${styles.formCard}`}>
              <div className={styles.formTopBorder} />
              <div className={styles.formHeader}>
                <div className={styles.formIcon} aria-hidden="true">
                  <HiEnvelope size={22} />
                </div>
                <div>
                  <h2 className={styles.formTitle}>Send us a Message</h2>
                  <p className={styles.formSubtitle}>We&apos;ll get back to you within 24 hours</p>
                </div>
              </div>

              {showSuccess && (
                <div className={styles.successMessage}>
                  <HiCheckCircle size={22} aria-hidden="true" />
                  <span>Message sent — we&apos;ll be in touch soon.</span>
                </div>
              )}
              {submitError && (
                <div className={styles.errorMessage} role="alert">
                  <HiExclamationCircle size={22} aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off">
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
                      <label htmlFor="name" className={styles.floatingLabel}>
                        Name *
                      </label>
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
                      <label htmlFor="email" className={styles.floatingLabel}>
                        Email *
                      </label>
                    </div>
                    {errors.email ? (
                      <span className={styles.errorText}>{errors.email}</span>
                    ) : (
                      <span className={styles.helperText}>Required</span>
                    )}
                  </div>
                </div>

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
                      <label htmlFor="phone" className={styles.floatingLabel}>
                        Phone
                      </label>
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
                      <label htmlFor="company" className={styles.floatingLabel}>
                        Company
                      </label>
                    </div>
                    <span className={styles.helperText}>Optional</span>
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <div className={styles.floatingLabelGroup}>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${errors.service ? styles.inputError : ''}`}
                      aria-label="Service of interest"
                      required
                    >
                      <option value="" disabled hidden>
                        Select a service…
                      </option>
                      <option value="ai-ml">AI &amp; Machine Learning</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-apps">Mobile Applications</option>
                      <option value="ui-ux-design">UI/UX Design</option>
                      <option value="cloud-devops">Cloud &amp; DevOps</option>
                      <option value="data-analytics">Data Analytics &amp; BI</option>
                      <option value="automation">Automation &amp; Integration</option>
                      <option value="consulting">IT Consulting</option>
                      <option value="other">Other</option>
                    </select>
                    <label htmlFor="service" className={styles.floatingLabel}>
                      Service Interest *
                    </label>
                  </div>
                  {errors.service ? (
                    <span className={styles.errorText}>{errors.service}</span>
                  ) : (
                    <span className={styles.helperText}>Required</span>
                  )}
                </div>

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
                    <label htmlFor="subject" className={styles.floatingLabel}>
                      Subject *
                    </label>
                  </div>
                  {errors.subject ? (
                    <span className={styles.errorText}>{errors.subject}</span>
                  ) : (
                    <span className={styles.helperText}>Required</span>
                  )}
                </div>

                <div className={styles.formGroupFull}>
                  <div className={styles.floatingLabelGroup}>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                      rows={5}
                      aria-label="Your message"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="message" className={styles.floatingLabel}>
                      Message *
                    </label>
                  </div>
                  {errors.message ? (
                    <span className={styles.errorText}>{errors.message}</span>
                  ) : (
                    <span className={styles.helperText}>Required — Tell us about your project</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                  aria-label={isSubmitting ? 'Sending message…' : 'Send message'}
                >
                  <div className={styles.buttonContent}>
                    {isSubmitting ? (
                      <>
                        <div className={styles.spinner} />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <HiPaperAirplane size={18} aria-hidden="true" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>

            {/* Info card */}
            <div className={styles.card}>
              <div className={styles.infoCardHeader}>
                <LottiePlayer
                  src="/lottie/contact-email.json"
                  loop
                  style={{
                    width: 64,
                    height: 64,
                    flexShrink: 0,
                    filter: theme === 'dark' ? 'brightness(1.1)' : 'none',
                  }}
                  ariaLabel="Animated envelope illustration"
                />
                <div>
                  <h3 className={styles.infoCardTitle}>Contact Information</h3>
                  <p className={styles.infoCardSub}>Let&apos;s start a conversation</p>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <HiEnvelope size={18} />
                  </span>
                  <div className={styles.contactDetails}>
                    <h4>Email</h4>
                    <p>
                      <a href="mailto:contact@megicode.com">contact@megicode.com</a>
                    </p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <HiMapPin size={18} />
                  </span>
                  <div className={styles.contactDetails}>
                    <h4>Location</h4>
                    <p>
                      Lahore, Pakistan
                      <br />
                      Serving clients globally
                    </p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <HiClock size={18} />
                  </span>
                  <div className={styles.contactDetails}>
                    <h4>Business Hours</h4>
                    <p>Mon – Fri, 9 AM – 6 PM PKT</p>
                  </div>
                </div>
              </div>

              <div className={styles.socialSection}>
                <h4>Follow Us</h4>
                <div className={styles.socialLinks}>
                  <a
                    href="https://www.linkedin.com/company/megicode"
                    className={`${styles.socialLink} ${styles.linkedinLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://github.com/megicodes"
                    className={`${styles.socialLink} ${styles.githubLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://www.instagram.com/megicode/"
                    className={`${styles.socialLink} ${styles.instagramLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className={styles.faqSection}>
          <h2 className={styles.faqTitle}>
            Frequently Asked Questions
            <span className={styles.titleAccent}>.</span>
          </h2>
          <FAQAccordion />
        </section>
      </main>

      <footer id="footer-section" aria-label="Footer" style={{ width: '100%', overflow: 'hidden' }}>
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
