"use client";
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import common from './CareersHeroCommon.module.css';
import light from './CareersHeroLight.module.css';
import dark from './CareersHeroDark.module.css';

const CareersHero: React.FC = () => {
  const { theme } = useTheme();
  const themed = theme === 'dark' ? dark : light;
  const cx = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section className={cx(common.careersHero, themed.careersHero)}>
      <div className={common.container}>
        <div className={common.heroContent}>
          <div className={common.textContent}>
            <h1 className={cx(common.title, themed.title)}>
              Join Our Mission to <span className={cx(common.highlight, themed.highlight)}>Shape the Future</span>
            </h1>
            <p className={cx(common.subtitle, themed.subtitle)}>
              Be part of a team that transforms ideas into intelligent solutions. 
              At Megicode, we're not just building software—we're crafting the digital world of tomorrow.
            </p>
            <div className={common.stats}>
              <div className={common.stat}>
                <span className={common.statNumber}>50+</span>
                <span className={common.statLabel}>Projects Delivered</span>
              </div>
              <div className={common.stat}>
                <span className={common.statNumber}>15+</span>
                <span className={common.statLabel}>Team Members</span>
              </div>
              <div className={common.stat}>
                <span className={common.statNumber}>3</span>
                <span className={common.statLabel}>Years of Excellence</span>
              </div>
            </div>
            <div className={common.ctaButtons}>
              <button className={cx(common.primaryBtn, themed.primaryBtn)} onClick={() => handleScroll('open-positions')}>
                View Open Positions
              </button>
              <button className={cx(common.secondaryBtn, themed.secondaryBtn)} onClick={() => handleScroll('company-culture')}>
                Learn About Our Culture
              </button>
            </div>
          </div>
          <div className={common.visualContent}>
            <div className={common.heroImage}>
              <div className={common.imageOverlay}>
                <div className={cx(common.floatingCard, themed.floatingCard)}>
                  <h3>Our Vision</h3>
                  <p>To set the ideal standard of quality and innovation in business and technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
