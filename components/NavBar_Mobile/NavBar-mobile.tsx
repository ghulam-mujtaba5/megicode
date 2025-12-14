"use client";
import React, { useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useViewTransition } from '@/hooks/useViewTransition';
import commonStyles from './NavBarCommon.module.css';
import lightStyles from './NavBarMobileLight.module.css';
import darkStyles from './NavBarMobileDark.module.css';
import { motion, AnimatePresence } from 'framer-motion';



const NavBar = () => {
    const sections = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'about', label: 'About', href: '/about' },
        { id: 'services', label: 'Services', href: '/services' },
        { id: 'projects', label: 'Projects', href: '/projects' },
        { id: 'article', label: 'Article', href: '/article' },
        { id: 'contact', label: 'Contact', href: '/contact' },
        { id: 'reviews', label: 'Reviews', href: '/reviews' },
        { id: 'careers', label: 'Careers', href: '/careers' },
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { navigateWithEffect } = useViewTransition();

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const handleNavigate = useCallback((route: string) => {
        navigateWithEffect(route, 'slide-up');
        setIsMenuOpen(false);
    }, [navigateWithEffect]);

    const themeStyles = theme === 'light' ? lightStyles : darkStyles;

    // Animation variants for menu items
    const menuItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
            },
        }),
        exit: { opacity: 0, x: -10 },
    };

    return (
        <nav className={`${commonStyles.navBar} ${themeStyles.navBar}`} aria-label="Main Navigation">
            <div className={commonStyles.topBar}>
                <button
                    className={`${commonStyles.menuToggle} ${themeStyles.menuToggle} ${isMenuOpen ? commonStyles.open : ''}`}
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-controls="menu-list"
                    aria-label="Toggle menu"
                >
                    <div className={`${commonStyles.menuIcon} ${themeStyles.menuIcon} ${isMenuOpen ? commonStyles.open : ''}`}></div>
                    <div className={`${commonStyles.menuIcon} ${themeStyles.menuIcon} ${isMenuOpen ? commonStyles.open : ''}`}></div>
                    <div className={`${commonStyles.menuIcon} ${themeStyles.menuIcon} ${isMenuOpen ? commonStyles.open : ''}`}></div>
                </button>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        id="menu-list"
                        className={`${commonStyles.menuContainer} ${themeStyles.menuContainer} ${commonStyles.open}`}
                        role="menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <ul className={`${commonStyles.menuList} ${themeStyles.menuList}`}>
                            {sections?.length > 0 ? (
                                sections.map((section, index) => (
                                    <motion.li
                                        key={section.id}
                                        className={`${commonStyles.menuItem} ${themeStyles.menuItem}`}
                                        onClick={() => handleNavigate(section.href)}
                                        role="menuitem"
                                        tabIndex={0}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleNavigate(section.href);
                                            }
                                        }}
                                        custom={index}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        whileHover={{ x: 8, transition: { duration: 0.15 } }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {section.label}
                                    </motion.li>
                                ))
                            ) : (
                                <li className={`${commonStyles.menuItem} ${themeStyles.menuItem}`} role="menuitem">
                                    No sections found
                                </li>
                            )}
                        </ul>
                        <div className={commonStyles.themeToggleContainer}>
                            <motion.button
                                type="button"
                                role="switch"
                                aria-checked={theme === 'dark'}
                                tabIndex={0}
                                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                onClick={toggleTheme}
                                className={commonStyles.premiumSwitch}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className={commonStyles.premiumSwitchTrack}>
                                    <span className={commonStyles.premiumSwitchThumb} data-checked={theme === 'dark'}>
                                        <span className={commonStyles.premiumSwitchIcon} aria-hidden="true">
                                            {theme === 'dark' ? (
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="9" cy="9" r="7" fill="#374151"/>
                                                    <path d="M13 6.5A5 5 0 0 1 6.5 13 5 5 0 1 0 13 6.5Z" fill="#cfd8dc"/>
                                                    <circle cx="13" cy="5" r="1.2" fill="#ffd700"/>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="9" cy="9" r="7" fill="#e3edf7"/>
                                                    <g stroke="#607d8b" strokeWidth="1.5" strokeLinecap="round">
                                                        <line x1="9" y1="2" x2="9" y2="4"/>
                                                        <line x1="9" y1="14" x2="9" y2="16"/>
                                                        <line x1="2" y1="9" x2="4" y2="9"/>
                                                        <line x1="14" y1="9" x2="16" y2="9"/>
                                                        <line x1="4.5" y1="4.5" x2="5.8" y2="5.8"/>
                                                        <line x1="12.2" y1="12.2" x2="13.5" y2="13.5"/>
                                                        <line x1="4.5" y1="13.5" x2="5.8" y2="12.2"/>
                                                        <line x1="12.2" y1="5.8" x2="13.5" y2="4.5"/>
                                                    </g>
                                                    <circle cx="9" cy="9" r="2.2" fill="#ffd700" fillOpacity="0.7"/>
                                                </svg>
                                            )}
                                        </span>
                                    </span>
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default React.memo(NavBar);
