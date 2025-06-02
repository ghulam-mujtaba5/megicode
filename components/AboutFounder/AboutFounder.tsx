'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import commonStyles from './AboutFounderCommon.module.css';
import lightStyles from './AboutFounderLight.module.css';
import darkStyles from './AboutFounderDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';

const AboutFounder = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  return (
    <section className={`${commonStyles.founderSection} ${themeStyles.founderSection}`}>
      <motion.div 
        className={`${commonStyles.container}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className={commonStyles.imageContainer}
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={commonStyles.imageWrapper}>
            <Image
              src="/images/portfolio-picture.png"
              alt="Ghulam Mujtaba - Founder of Megicode"
              width={400}
              height={400}
              className={commonStyles.founderImage}
              priority
            />
            <div className={commonStyles.imageBorder}></div>
          </div>
        </motion.div>

        <motion.div 
        className={`${commonStyles.content} ${themeStyles.content}`}
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className={`${commonStyles.title} ${themeStyles.title}`}>Meet the Founder</h2>
          <h3 className={`${commonStyles.name} ${themeStyles.name}`}>Ghulam Mujtaba</h3>
          <p className={`${commonStyles.role} ${themeStyles.role}`}>Founder & Lead Developer</p>
          <p className={`${commonStyles.quote} ${themeStyles.quote}`}>
            "After years of experience in software engineering and AI, I founded Megicode to help businesses 
            achieve breakthrough results using intelligent systems."
          </p>
          
          <p className={themeStyles.description}>
            With a passion for innovation and deep expertise in AI and software development, 
            I lead a team dedicated to creating cutting-edge solutions that transform businesses. 
            Our approach combines technical excellence with a deep understanding of our clients' needs.
          </p>

          <div className={commonStyles.socialLinks}>            <Link 
              href="https://github.com/ghulam-mujtaba5" 
              target="_blank" 
              rel="noopener noreferrer"
              className={commonStyles.socialLink}
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
              className={commonStyles.socialLink}
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
              className={`${commonStyles.socialLink} ${commonStyles.portfolioLink}`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={commonStyles.portfolioIcon}
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
