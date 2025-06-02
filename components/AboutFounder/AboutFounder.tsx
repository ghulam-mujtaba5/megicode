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
          <div className={commonStyles.imageGlow}></div>
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
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #4573df 60%, #2d4fa2 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.05rem',
            borderRadius: '0.7rem',
            padding: '0.25rem 1.1rem',
            marginBottom: '0.7rem',
            letterSpacing: '0.03em',
            boxShadow: '0 2px 8px #4573df22',
            marginLeft: '0.2rem',
          }}>Founder & Lead Developer</span>
          <h3 className={`${commonStyles.name} ${themeStyles.name}`}>Ghulam Mujtaba</h3>
          <p className={`${commonStyles.quote} ${themeStyles.quote}`} style={{fontWeight: 500, fontSize: '1.18rem', color: '#2d4fa2'}}>
            <span style={{fontSize: '2rem', verticalAlign: 'middle', color: '#4573df', marginRight: 6}}>&ldquo;</span>
            After years of experience in <span style={{color:'#4573df', fontWeight:600}}>software engineering</span> and <span style={{color:'#4573df', fontWeight:600}}>AI</span>, I founded <span style={{color:'#4573df', fontWeight:600}}>Megicode</span> to help businesses achieve breakthrough results using intelligent systems.
            <span style={{fontSize: '2rem', verticalAlign: 'middle', color: '#4573df', marginLeft: 6}}>&rdquo;</span>
          </p>
          <p className={themeStyles.description}>
            With a passion for <b>innovation</b> and deep expertise in <b>AI</b> and <b>software development</b>, I lead a team dedicated to creating <span style={{color:'#4573df', fontWeight:600}}>cutting-edge solutions</span> that transform businesses.<br/>
            Our approach combines <span style={{color:'#4573df', fontWeight:600}}>technical excellence</span> with a deep understanding of our clients' needs.
          </p>
          <div style={{margin: '1.2rem 0 0.5rem 0', fontFamily: 'cursive', fontSize: '1.2rem', color: '#2d4fa2', opacity: 0.85, textAlign: 'right'}}>
            <span style={{fontSize: '1.6rem', color: '#4573df'}}>—</span> Ghulam Mujtaba
          </div>
          <div className={commonStyles.socialLinks}>
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
