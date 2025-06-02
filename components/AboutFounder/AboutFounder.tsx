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

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className={`${commonStyles.founderSection} ${themeStyles.founderSection}`}>
      <motion.div 
        className={`${commonStyles.container}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        <motion.div 
          className={commonStyles.imageContainer}
          variants={fadeInUp}
        >
          <div className={commonStyles.imageGlow}></div>
          <motion.div 
            className={commonStyles.imageWrapper}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/images/portfolio-picture.png"
              alt="Ghulam Mujtaba - Founder of Megicode"
              width={400}
              height={400}
              className={commonStyles.founderImage}
              priority
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className={`${commonStyles.content} ${themeStyles.content}`}
          variants={fadeInUp}
        >
          <motion.span 
            className={commonStyles.title}
            variants={fadeInUp}
          >
            Meet the Founder
          </motion.span>

          <motion.div variants={fadeInUp}>
            <h3 className={`${commonStyles.name} ${themeStyles.name}`}>Ghulam Mujtaba</h3>
            <div className={`${commonStyles.role} ${themeStyles.role}`}>
              Founder & Lead Developer
            </div>
          </motion.div>

          <motion.blockquote
            className={`${commonStyles.quote} ${themeStyles.quote}`}
            variants={fadeInUp}
          >
            After years of experience in <span className={commonStyles.highlight}>software engineering</span> and <span className={commonStyles.highlight}>AI</span>, I founded <span className={commonStyles.highlight}>Megicode</span> to help businesses achieve breakthrough results using intelligent systems.
          </motion.blockquote>

          <motion.div 
            className={commonStyles.socialLinks}
            variants={fadeInUp}
          >
            <Link 
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
                  src={theme === 'dark' ? "/GithubDark.svg" : "/github_icon.svg"}
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
                  src={theme === 'dark' ? "/LinkedinDark.svg" : "/linkedin-icon.svg"}
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutFounder;
