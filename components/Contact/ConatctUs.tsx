'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { motion, useAnimation } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import PlexusCanvas from '../Backgrounds/PlexusCanvas';
import commonStyles from './ContactUsCommon.module.css';
import darkStyles from './ContactUsDark.module.css';
import lightStyles from './ContactUsLight.module.css';
import SuccessToast from './SuccessToast';

const ContactSection = ({ email = 'contact@megicode.com' }) => {
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { theme } = useTheme();
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.setAttribute('aria-required', 'true');
    }
  }, []);

  const handleNameChange = useCallback((event) => {
    setName(event.target.value);
    setError(null);
  }, []);

  const handleEmailChange = useCallback((event) => {
    setEmailInput(event.target.value);
    setError(null);
  }, []);

  const handleMessageChange = useCallback((event) => {
    setMessage(event.target.value);
    setError(null);
  }, []);

  const validateEmail = useCallback((email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSending(true);
      setError(null);
      setResponse(null);
      if (!name || !emailInput || !message) {
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
          setResponse(result.message || 'Message sent successfully!');
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

  // Framer Motion animation setup
  const controls = useAnimation();
  const ref = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start({ opacity: 1, y: 0 });
        } else {
          controls.start({ opacity: 0, y: 50 });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [controls]);

  return (
    <>
      <SuccessToast show={showSuccess} onClose={() => setShowSuccess(false)} />
      <section className={`${commonStyles.contactSection} ${themeStyles.contactSection}`}>
        <div
          className={`${commonStyles.contactFormBackground} ${themeStyles.contactFormBackground}`}
        >
          {/* Themed plexus canvas background (conservative settings) */}
          <PlexusCanvas maxNodes={100} maxDistance={120} speed={0.15} />
        </div>
        <motion.form
          className={`${commonStyles.contactForm} ${themeStyles.contactForm}`}
          onSubmit={handleSubmit}
          aria-label="Contact form"
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ duration: 0.5 }}
        >
          <label className={`${commonStyles.nameLabel} ${themeStyles.nameLabel}`} htmlFor="name">
            Name
          </label>
          <input
            className={`${commonStyles.nameInput} ${themeStyles.nameInput}`}
            type="text"
            name="user_name"
            id="name"
            placeholder="Name"
            autoComplete="name"
            value={name}
            onChange={handleNameChange}
            required
            ref={nameInputRef}
          />
          <label className={`${commonStyles.emailLabel} ${themeStyles.emailLabel}`} htmlFor="email">
            Email
          </label>
          <input
            className={`${commonStyles.emailInput} ${themeStyles.emailInput}`}
            type="email"
            name="user_email"
            id="email"
            placeholder="Email"
            autoComplete="email"
            value={emailInput}
            onChange={handleEmailChange}
            required
          />
          <label
            className={`${commonStyles.messageLabel} ${themeStyles.messageLabel}`}
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className={`${commonStyles.messageInput} ${themeStyles.messageInput}`}
            name="message"
            id="message"
            placeholder="Message"
            autoComplete="off"
            value={message}
            onChange={handleMessageChange}
            required
          ></textarea>
          <button
            type="submit"
            className={`${commonStyles.sendButton} ${themeStyles.sendButton}`}
            disabled={isSending}
          >
            <div className={`${commonStyles.sendButtonBorder} ${themeStyles.sendButtonBorder}`} />
            <div className={`${commonStyles.sendLabel} ${themeStyles.sendLabel}`}>
              {isSending ? 'Sending...' : 'SEND'}
            </div>
          </button>
        </motion.form>
        {error && (
          <p className={`${commonStyles.message} ${themeStyles.errorMessage}`} role="alert">
            {error}
          </p>
        )}
        {response && (
          <p className={`${commonStyles.message} ${themeStyles.successMessage}`} role="status">
            {response}
          </p>
        )}
        <div className={`${commonStyles.contactDetails} ${themeStyles.contactDetails}`}>
          {/* ── Connector: email address with dot node ─────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div className="connector-dot" aria-hidden="true" />
            <p
              className={`${commonStyles.contactEmail} ${themeStyles.contactEmail}`}
              style={{ margin: 0 }}
            >
              {email}
            </p>
          </div>

          {/* ── Flowing connector divider ───────────────────────────── */}
          <div
            className="divider-node"
            aria-hidden="true"
            style={{ maxWidth: 240, margin: '0 0 14px' }}
          >
            <div className="divider-node-dot" />
          </div>

          <h2
            className={`${commonStyles.contactMeDescription} ${themeStyles.contactMeDescription}`}
          >
            Contact Us
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-team-success.png"
            alt=""
            width={72}
            height={72}
            loading="lazy"
            aria-hidden="true"
            style={{
              display: 'block',
              margin: '0.75rem auto 1rem',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(69,115,223,0.28))',
              opacity: 0.88,
            }}
          />
          <div className={`${commonStyles.contactMeLabel} ${themeStyles.contactMeLabel}`}>
            <p className={`${commonStyles.doYouHave} ${themeStyles.doYouHave}`}>
              Do you have any project idea?
            </p>
            <p className={`${commonStyles.doyouHave} ${themeStyles.doyouHave}`}>
              Let’s discuss and turn them into reality!
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`${commonStyles.emailIcon} ${themeStyles.emailIcon}`}
            alt="Email"
            src={theme === 'light' ? 'email-icon.svg' : 'EmailDark.svg'}
            loading="lazy"
          />
          {/* Certification badges removed as requested */}
        </div>
      </section>
    </>
  );
};

export default ContactSection;
