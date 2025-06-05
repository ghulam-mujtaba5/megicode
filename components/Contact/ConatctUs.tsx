"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useTheme } from '../../context/ThemeContext';
import commonStyles from './ContactUsCommon.module.css';
import lightStyles from './ContactUsLight.module.css';
import darkStyles from './ContactUsDark.module.css';
import { motion, useAnimation } from 'framer-motion';
import SuccessToast from "./SuccessToast";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const ContactSection = ({
  email = "megicode@gmail.com",
  phoneNumber = "+92 317 7107849",
  showCertificationBadge = false,
  showAdditionalCertificationBadge = false
}) => {
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { theme, toggleTheme } = useTheme();
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
    (event) => {
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
      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: emailInput,
          message: message,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then((result) => {
        setResponse('Message sent successfully!');
        setShowSuccess(true);
        setName('');
        setEmailInput('');
        setMessage('');
      }, (error) => {
        setError('Failed to send message. Please try again later.');
      })
      .finally(() => {
        setIsSending(false);
      });
    },
    [name, emailInput, message, validateEmail]
  );

  const handleDarkModeButtonClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const themeStyles = useMemo(() => (theme === 'light' ? lightStyles : darkStyles), [theme]);

  // Framer Motion animation setup
  const controls = useAnimation();
  const ref = useRef(null);

  const handleScroll = useCallback(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          controls.start({ opacity: 1, y: 0 });
        } else {
          controls.start({ opacity: 0, y: 50 });
        }
      }, { threshold: 0.1 });

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [controls]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  return (
    <>
      <SuccessToast show={showSuccess} onClose={() => setShowSuccess(false)} />
      <section className={`${commonStyles.contactSection} ${themeStyles.contactSection}`}>
        <div className={`${commonStyles.contactFormBackground} ${themeStyles.contactFormBackground}`} />
        <motion.form
          className={`${commonStyles.contactForm} ${themeStyles.contactForm}`}
          onSubmit={handleSubmit}
          aria-label="Contact form"
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ duration: 0.5 }}
        >
          <label className={`${commonStyles.nameLabel} ${themeStyles.nameLabel}`} htmlFor="name">Name</label>
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
          <label className={`${commonStyles.emailLabel} ${themeStyles.emailLabel}`} htmlFor="email">Email</label>
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
          <label className={`${commonStyles.messageLabel} ${themeStyles.messageLabel}`} htmlFor="message">Message</label>
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
          <p className={`${commonStyles.contactEmail} ${themeStyles.contactEmail}`}>{email}</p>
          <div className={`${commonStyles.contactPhoneNo} ${themeStyles.contactPhoneNo}`}>{phoneNumber}</div>
          <h2 className={`${commonStyles.contactMeDescription} ${themeStyles.contactMeDescription}`}>Contact Me</h2>
          <div className={`${commonStyles.contactMeLabel} ${themeStyles.contactMeLabel}`}>
            <p className={`${commonStyles.doYouHave} ${themeStyles.doYouHave}`}>Do you have any project idea?</p>
            <p className={`${commonStyles.doyouHave} ${themeStyles.doyouHave}`}>Let’s discuss and turn them into reality!</p>
          </div>
          <img
            className={`${commonStyles.emailIcon} ${themeStyles.emailIcon}`}
            alt="Email"
            src={theme === 'light' ? "email icon.svg" : "EmailDark.svg"}
            loading="lazy"
          />
          <img
            className={`${commonStyles.phoneIcon} ${themeStyles.phoneIcon}`}
            alt="Phone"
            src={theme === 'light' ? "phone-icon.svg" : "PhoneDark.svg"}
            loading="lazy"
          />
          <button
            className={`${commonStyles.darkModeButton} ${themeStyles.darkModeButton}`}
            onClick={handleDarkModeButtonClick}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div className={`${commonStyles.darkModeButtonBorder} ${themeStyles.darkModeButtonBorder}`} />
            <div className={`${commonStyles.buttonState1} ${themeStyles.buttonState}`} />
            <div className={`${commonStyles.buttonState} ${themeStyles.buttonState1}`} />
            <b className={`${commonStyles.darkModeLabel} ${themeStyles.darkModeLabel}`}>
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </b>
          </button>
          {/* Certification badges removed as requested */}
        </div>
      </section>
    </>
  );
};

export default ContactSection;


