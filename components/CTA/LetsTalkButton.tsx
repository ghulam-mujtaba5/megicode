"use client";
import React from "react";
import styles from "./LetsTalkButtonCommon.module.css";
import lightStyles from "./LetsTalkButtonLight.module.css";
import darkStyles from "./LetsTalkButtonDark.module.css";
import { useTheme } from "../../context/ThemeContext";

const LetsTalkButton = ({ className = "", containerClassName = "" }) => {
  const { theme } = useTheme();
  const themeStyles = theme === "dark" ? darkStyles : lightStyles;

  return (
    <div className={`${styles.ctaButtonRow} ${containerClassName}`}>
      <a
        href="/contact"
        className={`${styles.ctaButton} ${themeStyles.ctaButton} ${className}`}
        aria-label="Let's Talk"
        tabIndex={0}
      >
        Let's Talk
      </a>
    </div>
  );
};

export default LetsTalkButton;
