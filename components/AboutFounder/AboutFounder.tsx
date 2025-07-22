'use client';
import React from 'react';
import Image from 'next/image';
import { motion, easeOut } from 'framer-motion';
import commonStyles from './AboutFounderCommon.module.css';
import lightStyles from './AboutFounderLight.module.css';
import darkStyles from './AboutFounderDark.module.css';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';
import styles from './AboutFounderGrid.module.css';

const AboutFounder = () => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: easeOut }
    }
  };

  const founders = [
    {
      name: "Azan Wahla",
      role: "Founder & CEO",
      image: "/azan.png",
      quote: "Leading Megicode's vision to transform businesses through innovative technology solutions.",
      github: "https://github.com/AzanWahla",
      linkedin: "https://www.linkedin.com/in/azanwahla"
    },
    {
      name: "Ghulam Mujtaba",
      role: "Founder & CTO",
      image: "/images/portfolio-picture.png",
      quote: "Driving technological excellence and innovation to create impactful solutions for our clients.",
      github: "https://github.com/ghulam-mujtaba5",
      linkedin: "https://pk.linkedin.com/in/ghulamujtabaofficial"
    },
    {
      name: "Muhammad Waqar ul Mulk",
      role: "Founder & COO/CMO",
      image: "/mesh-circuit-dark.svg",
      quote: "Building strategic partnerships and ensuring operational excellence in everything we do.",
      github: "https://github.com/Mwaqarulmulk",
      linkedin: "https://www.linkedin.com/in/mwaqarulmulk"
    }
  ];

  return (
    <section className={styles.leadershipSection}>
      <motion.div 
        className={styles.sectionTitle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { 
              y: 0, 
              opacity: 1,
              transition: {
                duration: 0.6,
                ease: [0.215, 0.610, 0.355, 1.000]
              }
            }
          }}
        >
          Leadership Team
        </motion.h2>
        <motion.p
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { 
              y: 0, 
              opacity: 1,
              transition: {
                duration: 0.6,
                delay: 0.2,
                ease: [0.215, 0.610, 0.355, 1.000]
              }
            }
          }}
        >
          Meet the visionaries behind Megicode's success
        </motion.p>
      </motion.div>

      <motion.div 
        className={styles.foundersGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        {founders.map((founder, index) => (
          <motion.div 
            key={founder.name}
            className={styles.founderCard}
            variants={fadeInUp}
          >
            <div className={styles.imageContainer}>
              <motion.div 
                className={styles.imageWrapper}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={founder.image}
                  alt={`${founder.name} - ${founder.role}`}
                  width={200}
                  height={200}
                  className={styles.founderImage}
                  priority={index === 0}
                />
              </motion.div>
            </div>

            <div className={styles.founderInfo}>
              <h3 className={styles.founderName}>{founder.name}</h3>
              <span className={styles.founderRole}>
                {founder.role}
              </span>
              <p className={styles.founderQuote}>
                {founder.quote}
              </p>

              <div className={styles.socialLinks}>
                <Link 
                  href={founder.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={theme === 'dark' ? "/GithubDark.svg" : "/github_icon.svg"}
                      alt="GitHub"
                      width={20}
                      height={20}
                    />
                  </motion.div>
                </Link>
                <Link 
                  href={founder.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={theme === 'dark' ? "/LinkedinDark.svg" : "/linkedin-icon.svg"}
                      alt="LinkedIn"
                      width={20}
                      height={20}
                    />
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutFounder;
