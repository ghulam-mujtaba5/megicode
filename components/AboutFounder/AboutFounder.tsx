'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './AboutFounder.module.css';
import Link from 'next/link';

const AboutFounder = () => {
  return (
    <section className={styles.founderSection}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className={styles.imageContainer}
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.imageWrapper}>
            <Image
              src="/images/portfolio-picture.png"
              alt="Ghulam Mujtaba - Founder of Megicode"
              width={400}
              height={400}
              className={styles.founderImage}
              priority
            />
            <div className={styles.imageBorder}></div>
          </div>
        </motion.div>

        <motion.div 
          className={styles.content}
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className={styles.title}>Meet the Founder</h2>
          <h3 className={styles.name}>Ghulam Mujtaba</h3>
          <p className={styles.role}>Founder & Lead Developer</p>
          
          <p className={styles.quote}>
            "After years of experience in software engineering and AI, I founded Megicode to help businesses 
            achieve breakthrough results using intelligent systems."
          </p>
          
          <p className={styles.description}>
            With a passion for innovation and deep expertise in AI and software development, 
            I lead a team dedicated to creating cutting-edge solutions that transform businesses. 
            Our approach combines technical excellence with a deep understanding of our clients' needs.
          </p>

          <div className={styles.socialLinks}>            <Link 
              href="https://github.com/ghulam-mujtaba5" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/github_icon.svg"
                  alt="GitHub"
                  width={24}
                  height={24}
                />
              </motion.div>
            </Link>
            <Link 
              href="https://pk.linkedin.com/in/ghulamujtabaofficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/linkedin-icon.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
              </motion.div>
            </Link>
            <Link 
              href="http://ghulammujtaba.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.portfolioLink}`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={styles.portfolioIcon}
              >
                <Image
                  src="/preview_icon1.svg"
                  alt="Portfolio"
                  width={24}
                  height={24}
                />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutFounder;
