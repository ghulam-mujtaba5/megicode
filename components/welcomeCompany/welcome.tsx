"use client";
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import styles from './welcomeLight.module.css'; // Import the light mode CSS file
import darkStyles from './welcomeDark.module.css'; // Import the dark mode CSS file
import commonStyles from './welcomeCommon.module.css'; // Import the common CSS file


const Frame = () => {
  const { theme } = useTheme(); // Destructure theme from the context
  const [welcomeText, setWelcomeText] = useState('');
  const [megicodeText, setMegicodeText] = useState('');
  const [serviceText, setServiceText] = useState('');

  const welcomeTextToDisplay = 'Welcome to ';
  const megicodeTextToDisplay = ' MegiCode';
  const serviceTextToDisplay = 'Elevate your Business with our Services.';

  useEffect(() => {
    const animateText = async () => {
      try {
        // Animate welcome text
        for (let i = 0; i <= welcomeTextToDisplay.length; i++) {
          setWelcomeText(welcomeTextToDisplay.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 40)); // Adjusted for smoother typing effect
        }

        // Pause before adding 'Megicode'
        await new Promise(resolve => setTimeout(resolve, 500));

        // Animate 'Megicode'
        for (let i = 0; i <= megicodeTextToDisplay.length; i++) {
          setMegicodeText(megicodeTextToDisplay.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 40)); // Adjusted for smoother typing effect
        }

        // Pause before showing service text
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Animate service text
        setServiceText('');
        for (let i = 0; i <= serviceTextToDisplay.length; i++) {
          setServiceText(serviceTextToDisplay.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 50)); // Adjusted for smoother typing effect
        }
      } catch (error) {
        console.error('Error in animation:', error);
      }
    };

    animateText();
  }, []);

  return (
    <section
      className={`${commonStyles.container} ${theme === 'dark' ? darkStyles.darkContainer : styles.container}`}
      aria-label="Welcome to Megicode"
    >
      <div
        className={`${commonStyles.textContainer} ${theme === 'dark' ? darkStyles.textContainer : styles.textContainer}`}
      >
        <motion.h1
          className={`${commonStyles.text} ${theme === 'dark' ? darkStyles.text : styles.text}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {welcomeText}
          <motion.span
            className={styles.softBuilt}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: (welcomeText.length * 40) / 1000 + 0.5 }}
          >
            {megicodeText}
          </motion.span>
        </motion.h1>
        <motion.p
          className={`${commonStyles.paragraph} ${theme === 'dark' ? darkStyles.paragraph : styles.paragraph}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: (welcomeText.length * 40 + 500 + megicodeText.length * 40) / 1000 + 1 }}
        >
          {serviceText}
        </motion.p>
      </div>
    </section>
  );
};

export default Frame;
