"use client";
import React, { useMemo } from "react";
import styles from "./PrivacyPolicy.module.css";
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";

export default function PrivacyPolicyPage() {
  const { theme = "light" } = useTheme() || {};
  const themeClass = useMemo(() => theme === "dark" ? styles.darkTheme : styles.lightTheme, [theme]);
  return (
    <div className={themeClass} style={{ minHeight: "100vh", width: "100vw", position: "relative", zIndex: 0, boxSizing: "border-box", transition: "background 0.3s" }}>
      <NewNavBar />
      <NavBarMobile />
      <main id="main-content" className={styles.privacyMain}>
        <section className={styles.section} aria-labelledby="privacy-policy-title">
          <h1 id="privacy-policy-title" className={styles.heading}>Privacy Policy</h1>
          <p className={styles.date}><em>Last updated: June 27, 2025</em></p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>1. Introduction</h2>
          <p>
            Welcome to <strong>Megicode</strong> (<a href="https://megicode.com" target="_blank" rel="noopener noreferrer">megicode.com</a>). We are a technology company specializing in modern, scalable, and innovative software solutions, including web, mobile, desktop, and AI-driven applications. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>2. Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> If you contact us via forms or email (contact@megicode.com), we collect your name, email address, and message content for communication purposes only.</li>
            <li><strong>Usage Data:</strong> We collect information about your visit (pages viewed, time spent, browser/device info) via cookies and analytics tools (e.g., Google Analytics) to improve our site and services.</li>
            <li><strong>Cookies:</strong> Cookies are used to enhance your experience, remember preferences, and manage consent. You can accept or decline cookies via the cookie consent banner.</li>
            <li><strong>Social Links:</strong> If you visit our external profiles (LinkedIn, Instagram, GitHub), those platforms may collect data per their own privacy policies.</li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>3. How We Use Your Information</h2>
          <ul>
            <li>To provide, operate, and maintain our website and services.</li>
            <li>To improve and personalize your experience.</li>
            <li>To respond to your inquiries or feedback sent to <a href="mailto:contact@megicode.com">contact@megicode.com</a>.</li>
            <li>To analyze usage and trends for site improvement.</li>
            <li>To comply with legal obligations and protect the rights of Megicode.</li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>4. Sharing Your Information</h2>
          <p>
            Your personal information is <strong>never</strong> sold, traded, or rented to third parties. Information may be shared with trusted service providers (such as analytics providers) only as necessary to operate the website, and always in accordance with this policy.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>5. Cookies and Tracking Technologies</h2>
          <p>
            Cookies and similar technologies are used to collect and store information about your preferences and usage. You can control cookie preferences via your browser settings or the cookie consent banner.
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., theme, consent banner).</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the site.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., dark/light mode).</li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>6. Data Security</h2>
          <p>
            Reasonable security measures are implemented to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>7. Third-Party Links</h2>
          <p>
            Our website contains links to third-party sites or services, including LinkedIn, Instagram, and GitHub. Megicode is not responsible for the privacy practices or content of those sites. Please review their privacy policies.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>8. Children’s Privacy</h2>
          <p>
            Our website is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information, please contact us and we will promptly delete such data.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>9. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. To exercise these rights, please contact us using the information below. Requests will be responded to as soon as possible.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>10. Changes to This Policy</h2>
          <p>
            This Privacy Policy may be updated from time to time. Any changes will be posted on this page with an updated date. Please review this policy periodically.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subheading}>11. Contact</h2>
          <p>
            For any questions, concerns, or feedback about this Privacy Policy or data practices, please contact:
          </p>
          <ul>
            <li><strong>Name:</strong> Megicode</li>
            <li><strong>Email:</strong> <a href="mailto:contact@megicode.com">contact@megicode.com</a></li>
            <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/company/megicode" target="_blank" rel="noopener noreferrer">megicode</a></li>
            <li><strong>Instagram:</strong> <a href="https://www.instagram.com/megicode/" target="_blank" rel="noopener noreferrer">megicode</a></li>
            <li><strong>GitHub:</strong> <a href="https://github.com/megicodes" target="_blank" rel="noopener noreferrer">megicodes</a></li>
          </ul>
          <p>
            You may also <Link href="/#contact-section">contact us via the contact form</Link> for any privacy-related requests or feedback.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}


