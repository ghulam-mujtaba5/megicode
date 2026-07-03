'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HiArrowRight,
  HiChatBubbleLeftRight,
  HiClock,
  HiEnvelope,
  HiExclamationCircle,
  HiMapPin,
  HiPaperAirplane,
} from 'react-icons/hi2';

import Link from 'next/link';

import { motion, useAnimation } from 'framer-motion';

import { CONTACT_EMAIL } from '@/lib/constants';

import { useTheme } from '../../context/ThemeContext';
import commonStyles from './ContactUsCommon.module.css';
import darkStyles from './ContactUsDark.module.css';
import lightStyles from './ContactUsLight.module.css';
import SuccessToast from './SuccessToast';

const ContactSection = ({ email = CONTACT_EMAIL }) => {
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { theme } = useTheme();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    nameInputRef.current?.setAttribute('aria-required', 'true');
  }, []);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError(null);
  }, []);

  const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
    setError(null);
  }, []);

  const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    setError(null);
  }, []);

  const validateEmail = useCallback((value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSending(true);
      setError(null);
      if (!name.trim() || !emailInput.trim() || !message.trim()) {
        setError('Please fill in all fields.');
        setIsSending(false);
        return;
      }
      if (!validateEmail(emailInput)) {
        setError('Please enter a valid email address.');
        setIsSending(false);
        return;
      }
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email: emailInput, message }),
        });
        const result = await res.json();
        if (res.ok) {
          setShowSuccess(true);
          setName('');
          setEmailInput('');
          setMessage('');
        } else {
          setError(result.error || 'Failed to send message. Please try again later.');
        }
      } catch {
        setError('Failed to send message. Please try again later.');
      } finally {
        setIsSending(false);
      }
    },
    [name, emailInput, message, validateEmail]
  );

  const themeStyles = useMemo(() => (theme === 'light' ? lightStyles : darkStyles), [theme]);

  // Scroll-reveal for the form and info cards
  const formControls = useAnimation();
  const infoControls = useAnimation();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const targets: { el: Element; controls: ReturnType<typeof useAnimation> }[] = [];
    if (formRef.current) targets.push({ el: formRef.current, controls: formControls });
    if (infoCardRef.current) targets.push({ el: infoCardRef.current, controls: infoControls });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = targets.find((t) => t.el === entry.target);
          if (!target) return;
          target.controls.start(
            entry.isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
          );
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => observer.observe(t.el));
    return () => observer.disconnect();
  }, [formControls, infoControls]);

  // Subtle mouse-parallax tilt on the info card (kept from the previous design)
  const handleInfoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = infoCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(800px) rotateX(${(y / rect.height) * -4}deg) rotateY(${(x / rect.width) * 4}deg) translateZ(0)`;
  };
  const handleInfoLeave = () => {
    const card = infoCardRef.current;
    if (!card) return;
    card.style.transition = 'transform 500ms cubic-bezier(.2,.9,.2,1)';
    card.style.transform = '';
    setTimeout(() => {
      if (card) card.style.transition = '';
    }, 520);
  };

  return (
    <>
      <SuccessToast show={showSuccess} onClose={() => setShowSuccess(false)} />
      <section className={`${commonStyles.section} ${themeStyles.section}`}>
        <div className={commonStyles.inner}>
          <div className={commonStyles.header}>
            <span className={`${commonStyles.eyebrow} ${themeStyles.eyebrow}`}>
              <HiChatBubbleLeftRight size={14} aria-hidden="true" />
              Get In Touch
            </span>
            <h2 className={`${commonStyles.title} ${themeStyles.title}`}>
              Have a project in mind?
            </h2>
            <p className={`${commonStyles.subtitle} ${themeStyles.subtitle}`}>
              Send us a quick message and we&apos;ll reply within one business day. Need to share
              budget, timeline, or full requirements? Use our detailed project brief instead.
            </p>
            <div className={commonStyles.trustChips} aria-label="Working with Megicode">
              {[
                '24h response',
                'Free intro call',
                'NDA available',
                'Remote-first',
                'Lahore-based, global clients',
              ].map((chip) => (
                <span key={chip} className={commonStyles.trustChip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className={commonStyles.grid}>
            <motion.form
              className={`${commonStyles.formCard} ${themeStyles.formCard}`}
              onSubmit={handleSubmit}
              aria-label="Quick contact form"
              ref={formRef}
              initial={{ opacity: 0, y: 40 }}
              animate={formControls}
              transition={{ duration: 0.5 }}
              noValidate
            >
              <div className={commonStyles.formTopBorder} />

              <div className={commonStyles.formGroup}>
                <label
                  className={`${commonStyles.label} ${themeStyles.label}`}
                  htmlFor="contact-name"
                >
                  Name
                </label>
                <input
                  className={`${commonStyles.input} ${themeStyles.input}`}
                  type="text"
                  name="user_name"
                  id="contact-name"
                  placeholder="Your name"
                  autoComplete="name"
                  maxLength={100}
                  value={name}
                  onChange={handleNameChange}
                  required
                  ref={nameInputRef}
                />
              </div>

              <div className={commonStyles.formGroup}>
                <label
                  className={`${commonStyles.label} ${themeStyles.label}`}
                  htmlFor="contact-email"
                >
                  Email
                </label>
                <input
                  className={`${commonStyles.input} ${themeStyles.input}`}
                  type="email"
                  name="user_email"
                  id="contact-email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  maxLength={254}
                  value={emailInput}
                  onChange={handleEmailChange}
                  required
                />
              </div>

              <div className={commonStyles.formGroup}>
                <label
                  className={`${commonStyles.label} ${themeStyles.label}`}
                  htmlFor="contact-message"
                >
                  Message
                </label>
                <textarea
                  className={`${commonStyles.input} ${commonStyles.textarea} ${themeStyles.input}`}
                  name="message"
                  id="contact-message"
                  placeholder="Tell us what you're building..."
                  autoComplete="off"
                  maxLength={2000}
                  rows={4}
                  value={message}
                  onChange={handleMessageChange}
                  required
                />
              </div>

              {error && (
                <p
                  className={`${commonStyles.formMessage} ${themeStyles.errorMessage}`}
                  role="alert"
                >
                  <HiExclamationCircle size={16} aria-hidden="true" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={`${commonStyles.sendButton} ${themeStyles.sendButton}`}
                disabled={isSending}
                aria-label={isSending ? 'Sending message…' : 'Send message'}
              >
                {isSending ? 'Sending…' : 'Send Message'}
                <HiPaperAirplane size={16} aria-hidden="true" />
              </button>
            </motion.form>

            <motion.div
              className={`${commonStyles.infoCard} ${themeStyles.infoCard}`}
              ref={infoCardRef}
              onMouseMove={handleInfoMove}
              onMouseLeave={handleInfoLeave}
              initial={{ opacity: 0, y: 40 }}
              animate={infoControls}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={commonStyles.infoCardGlow} aria-hidden="true" />

              <h3 className={`${commonStyles.infoTitle} ${themeStyles.infoTitle}`}>
                Contact Information
              </h3>
              <p className={`${commonStyles.infoSubtitle} ${themeStyles.infoSubtitle}`}>
                Let&apos;s start a conversation
              </p>

              <ul className={commonStyles.infoList}>
                <li className={commonStyles.infoItem}>
                  <span
                    className={`${commonStyles.infoIcon} ${themeStyles.infoIcon}`}
                    aria-hidden="true"
                  >
                    <HiEnvelope size={17} />
                  </span>
                  <a
                    className={`${commonStyles.infoLink} ${themeStyles.infoLink}`}
                    href={`mailto:${email}`}
                  >
                    {email}
                  </a>
                </li>
                <li className={commonStyles.infoItem}>
                  <span
                    className={`${commonStyles.infoIcon} ${themeStyles.infoIcon}`}
                    aria-hidden="true"
                  >
                    <HiMapPin size={17} />
                  </span>
                  <span className={`${commonStyles.infoText} ${themeStyles.infoText}`}>
                    Remote · Global — serving clients worldwide
                  </span>
                </li>
                <li className={commonStyles.infoItem}>
                  <span
                    className={`${commonStyles.infoIcon} ${themeStyles.infoIcon}`}
                    aria-hidden="true"
                  >
                    <HiClock size={17} />
                  </span>
                  <span className={`${commonStyles.infoText} ${themeStyles.infoText}`}>
                    Mon – Fri, 9 AM – 6 PM PKT
                  </span>
                </li>
              </ul>

              <Link href="/contact" className={`${commonStyles.ctaLink} ${themeStyles.ctaLink}`}>
                Need a full project brief?
                <HiArrowRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
