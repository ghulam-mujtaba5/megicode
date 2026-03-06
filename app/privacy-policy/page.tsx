"use client";
import React from "react";
import commonStyles from "./PrivacyPolicyCommon.module.css";
import lightStyles from "./PrivacyPolicyLight.module.css";
import darkStyles from "./PrivacyPolicyDark.module.css";
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/animations";
import { CONTACT_EMAIL, SITE_SOCIAL } from "@/lib/constants";
import { Variants, easeOut } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export default function PrivacyPolicyPage() {
  const { theme } = useTheme();
  const themeStyles = theme === "dark" ? darkStyles : lightStyles;

  return (
    <div>
      <NewNavBar />
      <NavBarMobile />
      <main
        id="main-content"
        className={`${commonStyles.privacyMain} ${themeStyles.privacyMain}`}
      >
        <motion.div
          className={commonStyles.heroSection}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            id="privacy-policy-title"
            className={`${commonStyles.heading} ${themeStyles.heading}`}
            variants={fadeInUp}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className={`${commonStyles.date} ${themeStyles.date}`}
            variants={fadeInUp}
          >
            <em>Last updated: March 6, 2026</em>
          </motion.p>
        </motion.div>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-intro"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-intro" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            1. Introduction
          </h2>
          <p>
            Welcome to <strong>Megicode</strong> (
            <a href="https://www.megicode.com" target="_blank" rel="noopener noreferrer">
              megicode.com
            </a>
            ). We are a technology company specializing in modern, scalable, and innovative
            software solutions, including web, mobile, desktop, and AI-driven applications.
            This Privacy Policy explains how we collect, use, and protect your information
            when you use our website and services.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-info-collect"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-info-collect" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            2. Information We Collect
          </h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> If you contact us via forms or email
              ({CONTACT_EMAIL}), we collect your name, email address, and message content for
              communication purposes only.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about your visit (pages
              viewed, time spent, browser/device info) via cookies and analytics tools (e.g.,
              Google Analytics) to improve our site and services.
            </li>
            <li>
              <strong>Cookies:</strong> Cookies are used to enhance your experience, remember
              preferences, and manage consent. You can accept or decline cookies via the
              cookie consent banner.
            </li>
            <li>
              <strong>Social Links:</strong> If you visit our external profiles (LinkedIn,
              Instagram, GitHub), those platforms may collect data per their own privacy
              policies.
            </li>
          </ul>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-how-use"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-how-use" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            3. How We Use Your Information
          </h2>
          <ul>
            <li>To provide, operate, and maintain our website and services.</li>
            <li>To improve and personalize your experience.</li>
            <li>
              To respond to your inquiries or feedback sent to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </li>
            <li>To analyze usage and trends for site improvement.</li>
            <li>To comply with legal obligations and protect the rights of Megicode.</li>
          </ul>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-sharing"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-sharing" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            4. Sharing Your Information
          </h2>
          <p>
            Your personal information is <strong>never</strong> sold, traded, or rented to
            third parties. Information may be shared with trusted service providers (such as
            analytics providers) only as necessary to operate the website, and always in
            accordance with this policy.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-cookies"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-cookies" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            5. Cookies and Tracking Technologies
          </h2>
          <p>
            Cookies and similar technologies are used to collect and store information about
            your preferences and usage. You can control cookie preferences via your browser
            settings or the cookie consent banner.
          </p>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for the website to function (e.g.,
              theme, consent banner).
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how visitors interact
              with the site.
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your settings and preferences
              (e.g., dark/light mode).
            </li>
          </ul>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-data-retention"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-data-retention" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            6. Data Retention
          </h2>
          <p>
            We retain personal information only for as long as necessary to fulfil the
            purposes outlined in this policy, unless a longer retention period is required or
            permitted by law. Contact form submissions are retained for up to 12 months to
            ensure we can follow up on your inquiry, after which they are securely deleted.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-security"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-security" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            7. Data Security
          </h2>
          <p>
            Reasonable security measures are implemented to protect your information from
            unauthorized access, disclosure, alteration, or destruction. These include
            encrypted connections (HTTPS/TLS), secure server infrastructure, and access
            controls. However, no method of transmission over the Internet or electronic
            storage is 100% secure.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-third-party"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-third-party" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            8. Third-Party Links
          </h2>
          <p>
            Our website contains links to third-party sites or services, including LinkedIn,
            Instagram, and GitHub. Megicode is not responsible for the privacy practices or
            content of those sites. Please review their privacy policies before providing any
            personal information.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-children"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-children" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            9. Children&apos;s Privacy
          </h2>
          <p>
            Our website is not intended for children under 13. We do not knowingly collect
            personal information from children. If you believe a child has provided personal
            information, please contact us and we will promptly delete such data.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-rights"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-rights" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            10. Your Rights
          </h2>
          <p>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul>
            <li>Access and receive a copy of your personal data.</li>
            <li>Rectify or update inaccurate information.</li>
            <li>Request deletion of your personal data.</li>
            <li>Object to or restrict the processing of your data.</li>
            <li>Withdraw consent at any time where processing is based on consent.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the details below.
            Requests will be responded to within 30 days.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-international"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-international" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            11. International Data Transfers
          </h2>
          <p>
            Your information may be processed in countries other than the one in which you
            reside. These countries may have data protection laws that differ from those in
            your jurisdiction. By using our website, you consent to the transfer of your
            information to these countries. We take reasonable steps to ensure that your data
            is treated securely and in accordance with this Privacy Policy.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-changes"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-changes" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            12. Changes to This Policy
          </h2>
          <p>
            This Privacy Policy may be updated from time to time. Any changes will be posted
            on this page with an updated date. We encourage you to review this policy
            periodically. Continued use of our website after changes constitutes acceptance of
            the updated policy.
          </p>
        </motion.section>

        <motion.section
          className={`${commonStyles.section} ${themeStyles.section}`}
          aria-labelledby="section-contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
        >
          <h2 id="section-contact" className={`${commonStyles.subheading} ${themeStyles.subheading}`}>
            13. Contact
          </h2>
          <p>
            For any questions, concerns, or feedback about this Privacy Policy or data
            practices, please contact:
          </p>
          <ul className={commonStyles.contactList}>
            <li>
              <strong>Company:</strong> Megicode
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a href={SITE_SOCIAL.linkedinUrl} target="_blank" rel="noopener noreferrer">
                megicode
              </a>
            </li>
            <li>
              <strong>Instagram:</strong>{" "}
              <a href={SITE_SOCIAL.instagramUrl} target="_blank" rel="noopener noreferrer">
                megicode
              </a>
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a href={SITE_SOCIAL.githubUrl} target="_blank" rel="noopener noreferrer">
                megicodes
              </a>
            </li>
          </ul>
          <p>
            You may also{" "}
            <Link href="/contact">contact us via the contact form</Link> for any
            privacy-related requests or feedback.
          </p>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
