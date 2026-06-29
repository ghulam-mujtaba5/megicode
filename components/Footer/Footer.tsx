'use client';
import React, { useMemo, useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { motion, useInView } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import commonStyles from './FooterCommon.module.css';
import darkStyles from './FooterDark.module.css';
import lightStyles from './FooterLight.module.css';

const Footer = ({
  copyrightText = `Copyright ${new Date().getFullYear()} Megicode. All Rights Reserved.`,
  linkedinUrl = 'https://www.linkedin.com/company/megicode',
  instagramUrl = 'https://www.instagram.com/megicode/',
  githubUrl = 'https://github.com/megicodes',
}) => {
  const { theme } = useTheme();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.3 });

  const themeStyles = useMemo(() => (theme === 'dark' ? darkStyles : lightStyles), [theme]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        staggerChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.footer
      ref={footerRef}
      className={`${commonStyles.footer} ${themeStyles.footer}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <div className={commonStyles.footerFrame}>
        <div className={`${commonStyles.footerBackground} ${themeStyles.footerBackground}`} />
        <motion.div className={commonStyles.footerContent} variants={containerVariants}>
          <motion.div className={commonStyles.footerBrand} variants={iconVariants}>
            <Link href="/" className={commonStyles.footerLogoLink} aria-label="Megicode home">
              <Image
                src={theme === 'dark' ? '/logo-main-dark.svg' : '/logo-main-light.svg'}
                alt="Megicode"
                width={190}
                height={58}
                className={commonStyles.footerLogo}
                priority={false}
              />
            </Link>
            <p>AI software, automation, SaaS MVPs, and custom business platforms.</p>
          </motion.div>

          <motion.nav
            className={commonStyles.footerNav}
            aria-label="Footer services"
            variants={iconVariants}
          >
            <strong>Services</strong>
            <Link href="/pricing">Pricing</Link>
            <Link href="/services/ai-automation-agents">AI Automation</Link>
            <Link href="/services/ai-saas-mvp-development">AI SaaS MVP</Link>
            <Link href="/services/custom-web-development">Custom Platforms</Link>
          </motion.nav>

          <motion.nav
            className={commonStyles.footerNav}
            aria-label="Footer company links"
            variants={iconVariants}
          >
            <strong>Company</strong>
            <Link href="/projects">Case Studies</Link>
            <Link href="/article">Insights</Link>
            <Link href="/contact?source=footer">Contact</Link>
            <Link href="/privacy-policy">Privacy</Link>
          </motion.nav>

          <motion.div className={commonStyles.footerContact} variants={iconVariants}>
            <strong>Start here</strong>
            <Link className={commonStyles.footerCta} href="/contact?source=footer">
              Book Free Fit Call →
            </Link>
            <a href="mailto:contact@megicode.com">contact@megicode.com</a>
            <div className={commonStyles.footerSocial} aria-label="Megicode social links">
              <motion.a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={commonStyles.linkedinIcon}
                aria-label="LinkedIn"
                variants={iconVariants}
                whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  alt=""
                  src={theme === 'dark' ? '/LinkedinDark.svg' : '/linkedin-icon.svg'}
                  width={22}
                  height={22}
                />
              </motion.a>
              <motion.a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={commonStyles.instagramIcon}
                aria-label="Instagram"
                variants={iconVariants}
                whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  alt=""
                  src={theme === 'dark' ? '/InstagramDark.svg' : '/Instagram-icon.svg'}
                  width={22}
                  height={22}
                />
              </motion.a>
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={commonStyles.githubIcon}
                aria-label="GitHub"
                variants={iconVariants}
                whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  alt=""
                  src={theme === 'dark' ? '/GithubDark.svg' : '/github_icon.svg'}
                  width={22}
                  height={22}
                />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        <div className={commonStyles.footerBottom}>
          <motion.img
            className={commonStyles.copyrightIcon}
            alt=""
            src={theme === 'dark' ? '/CopyrightDark.svg' : '/copyright-icon.svg'}
            variants={iconVariants}
          />
          <motion.p className={commonStyles.copyrightLabel} variants={iconVariants}>
            {copyrightText}
          </motion.p>
          <motion.a
            href="/internal/login"
            className={`${commonStyles.internalPortalLink} ${themeStyles.internalPortalLink}`}
            variants={iconVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            title="Team Portal Access"
            aria-label="Access Internal Portal"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginRight: '4px', verticalAlign: 'middle' }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Portal
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
