'use client';
import React, { useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { motion, useInView, useReducedMotion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import styles from './FooterCommon.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const SERVICE_LINKS = [
  { href: '/services/ai-automation-agents', label: 'AI Automation & Agents' },
  { href: '/services/ai-saas-mvp-development', label: 'AI SaaS MVPs' },
  { href: '/services/custom-web-development', label: 'Custom Platforms' },
  { href: '/services/mobile-app-development', label: 'Mobile Apps' },
  { href: '/services/data-analytics', label: 'Data & Analytics' },
  { href: '/services/ui-ux-design', label: 'UI/UX Design' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Our Work' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/insights', label: 'Insights' },
  { href: '/careers', label: 'Careers' },
];

/**
 * Site footer — where the pipeline motif terminates: a blueprint wire runs
 * across the top and its pulse docks at the "start your project" panel.
 * Fully token-based ([data-theme]); orange appears only on the single CTA.
 */
const Footer = ({
  copyrightText = `Copyright ${new Date().getFullYear()} Megicode. All Rights Reserved.`,
  linkedinUrl = 'https://www.linkedin.com/company/megicode',
  instagramUrl = 'https://www.instagram.com/megicode/',
  githubUrl = 'https://github.com/megicodes',
}) => {
  const { theme } = useTheme();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();

  const socials = [
    {
      href: linkedinUrl,
      label: 'LinkedIn',
      src: theme === 'dark' ? '/LinkedinDark.svg' : '/linkedin-icon.svg',
    },
    {
      href: instagramUrl,
      label: 'Instagram',
      src: theme === 'dark' ? '/InstagramDark.svg' : '/Instagram-icon.svg',
    },
    {
      href: githubUrl,
      label: 'GitHub',
      src: theme === 'dark' ? '/GithubDark.svg' : '/github_icon.svg',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      {/* The site-wide pipeline wire ends here */}
      <div className={styles.wire} aria-hidden="true">
        <span className={styles.wirePulse} />
        <span className={styles.wireNode} />
      </div>

      <motion.div
        className={styles.frame}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className={styles.content}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="Megicode home">
              <Image
                src={theme === 'dark' ? '/logo-navbar-dark.png' : '/logo-navbar-light.png'}
                alt="Megicode"
                width={48}
                height={48}
                className={styles.logo}
              />
            </Link>
            <p className={styles.tagline}>
              AI software, automation, SaaS MVPs, and custom business platforms — designed, built,
              and shipped by one accountable team.
            </p>
          </div>

          {/* Services */}
          <nav className={styles.navCol} aria-label="Footer services">
            <strong className={styles.colTitle}>Services</strong>
            {SERVICE_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Company */}
          <nav className={styles.navCol} aria-label="Footer company links">
            <strong className={styles.colTitle}>Company</strong>
            {COMPANY_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Start panel — where the wire's pulse docks */}
          <div className={styles.startPanel}>
            <strong className={styles.colTitle}>Have an idea?</strong>
            <p className={styles.startCopy}>
              Tell us the goal — we&rsquo;ll reply with the best next step, free.
            </p>
            <Link href="/contact?source=footer" className={styles.cta}>
              Start Your Project →
            </Link>
            <a href="mailto:contact@megicode.com" className={styles.emailLink}>
              contact@megicode.com
            </a>
            <div className={styles.social} aria-label="Megicode social links">
              {socials.map(({ href, label, src }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label={label}
                >
                  <Image alt="" src={src} width={20} height={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{copyrightText}</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy-policy" className={styles.bottomLink}>
              Privacy
            </Link>
            <a href="/internal/login" className={styles.bottomLink} title="Team portal access">
              Portal
            </a>
            <button
              type="button"
              className={styles.toTop}
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              ↑
            </button>
          </div>
        </div>
      </motion.div>

      {/* Oversized watermark — quiet, cropped, unmistakably ours */}
      <div className={styles.watermark} aria-hidden="true">
        megicode
      </div>
    </footer>
  );
};

export default Footer;
