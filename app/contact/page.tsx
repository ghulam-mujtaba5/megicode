'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
  HiChatBubbleLeftRight,
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
import Image from 'next/image';

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
        'We publish USD starting prices for roadmap, automation, clinic AI receptionist, SaaS MVP, platform, and support packages. Fixed-scope packages are quoted clearly, while larger builds use milestone pricing after scope is confirmed.',
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
    country: '',
    message: '',
    service: '',
    budget: '',
    timeline: '',
    stage: '',
    hasRequirements: '',
    needsNda: '',
    timezone: '',
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
  const [, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Please enter a valid email address'
          : '';
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
      case 'service':
        return !value ? 'Please select a service' : '';
      case 'budget':
        return !value ? 'Please select a budget range' : '';
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
    ['name', 'email', 'message', 'service', 'budget'].forEach((field) => {
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
      const enrichedMessage = [
        `Country: ${formData.country || 'Not provided'}`,
        `Budget range: ${formData.budget || 'Not provided'}`,
        `Timeline: ${formData.timeline || 'Not provided'}`,
        `Project stage: ${formData.stage || 'Not provided'}`,
        `Has designs/requirements: ${formData.hasRequirements || 'Not provided'}`,
        `Needs NDA: ${formData.needsNda || 'Not provided'}`,
        `Preferred meeting time zone: ${formData.timezone || 'Not provided'}`,
        '',
        formData.message,
      ].join('\n');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          subject: `${formData.service || 'Project fit review'} inquiry`,
          message: enrichedMessage,
        }),
      });
      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          country: '',
          message: '',
          service: '',
          budget: '',
          timeline: '',
          stage: '',
          hasRequirements: '',
          needsNda: '',
          timezone: '',
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
          <span className={styles.heroEyebrow}>Get In Touch</span>
          <h1 ref={titleRef} className={styles.heroTitle}>
            Tell us what you want to build
          </h1>
          <p className={styles.heroDescription}>
            Share your goal, current problem, and timeline. We&apos;ll reply within one business day
            with the best next step.
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
              <span>Free Fit Call</span>
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
                  <h2 className={styles.formTitle}>Start a fit review</h2>
                  <p className={styles.formSubtitle}>Tell us the goal, budget, and timeline</p>
                </div>
              </div>

              {showSuccess && (
                <div className={styles.successMessage}>
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

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        aria-label="Country"
                        placeholder=" "
                      />
                      <label htmlFor="country" className={styles.floatingLabel}>
                        Country
                      </label>
                    </div>
                    <span className={styles.helperText}>Optional</span>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <input
                        type="text"
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        aria-label="Preferred meeting time zone"
                        placeholder=" "
                      />
                      <label htmlFor="timezone" className={styles.floatingLabel}>
                        Preferred meeting time zone
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
                      <option value="AI Automation">AI Automation</option>
                      <option value="AI SaaS / MVP">AI SaaS / MVP</option>
                      <option value="Custom Platform">Custom Platform</option>
                      <option value="Not sure yet">Not sure yet</option>
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

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`${styles.input} ${errors.budget ? styles.inputError : ''}`}
                        aria-label="Budget range"
                        required
                      >
                        <option value="" disabled hidden>
                          Select budget…
                        </option>
                        <option value="Under $500">Under $500</option>
                        <option value="$500-$1,500">$500-$1,500</option>
                        <option value="$1,500-$3,500">$1,500-$3,500</option>
                        <option value="$3,500-$7,500">$3,500-$7,500</option>
                        <option value="$7,500-$15,000">$7,500-$15,000</option>
                        <option value="$15,000-$30,000">$15,000-$30,000</option>
                        <option value="$30,000+">$30,000+</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                      <label htmlFor="budget" className={styles.floatingLabel}>
                        Budget range *
                      </label>
                    </div>
                    {errors.budget ? (
                      <span className={styles.errorText}>{errors.budget}</span>
                    ) : (
                      <span className={styles.helperText}>Required</span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        aria-label="Timeline"
                      >
                        <option value="">Select timeline…</option>
                        <option value="ASAP">ASAP</option>
                        <option value="2-4 weeks">2-4 weeks</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3+ months">3+ months</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                      <label htmlFor="timeline" className={styles.floatingLabel}>
                        Timeline
                      </label>
                    </div>
                    <span className={styles.helperText}>Optional</span>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <select
                        id="stage"
                        name="stage"
                        value={formData.stage}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        aria-label="Project stage"
                      >
                        <option value="">Select stage…</option>
                        <option value="Idea only">Idea only</option>
                        <option value="Requirements ready">Requirements ready</option>
                        <option value="Designs ready">Designs ready</option>
                        <option value="Existing product">Existing product</option>
                        <option value="Need rescue or rebuild">Need rescue or rebuild</option>
                      </select>
                      <label htmlFor="stage" className={styles.floatingLabel}>
                        Project stage
                      </label>
                    </div>
                    <span className={styles.helperText}>Optional</span>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.floatingLabelGroup}>
                      <select
                        id="hasRequirements"
                        name="hasRequirements"
                        value={formData.hasRequirements}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        aria-label="Do you already have designs or requirements?"
                      >
                        <option value="">Select answer…</option>
                        <option value="Yes">Yes</option>
                        <option value="Partial">Partial</option>
                        <option value="No">No</option>
                      </select>
                      <label htmlFor="hasRequirements" className={styles.floatingLabel}>
                        Designs or requirements?
                      </label>
                    </div>
                    <span className={styles.helperText}>Optional</span>
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <div className={styles.floatingLabelGroup}>
                    <select
                      id="needsNda"
                      name="needsNda"
                      value={formData.needsNda}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={styles.input}
                      aria-label="Need NDA?"
                    >
                      <option value="">Select answer…</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Maybe later">Maybe later</option>
                    </select>
                    <label htmlFor="needsNda" className={styles.floatingLabel}>
                      Need NDA?
                    </label>
                  </div>
                  <span className={styles.helperText}>Optional</span>
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

              {/* Illustration */}
              <div className={styles.contactIllustration}>
                <Image
                  src="/images/assets/contact-flow.webp"
                  alt="Send Message, Book Consultation, Get Clear Plan"
                  width={380}
                  height={200}
                  style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                  priority={false}
                />
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
