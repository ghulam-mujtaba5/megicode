"use client";
import React from "react";
import { useCalendlyModal } from "../CalendlyModal";
import styles from "./LetsTalkButtonCommon.module.css";
import lightStyles from "./LetsTalkButtonLight.module.css";
import darkStyles from "./LetsTalkButtonDark.module.css";
import { useTheme } from "../../context/ThemeContext";

const LetsTalkButton = ({ className = "", containerClassName = "" }) => {
  const { theme } = useTheme();
  const themeStyles = theme === "dark" ? darkStyles : lightStyles;
  const [openCalendly, calendlyModal] = useCalendlyModal();
  return (
    <div className={`${styles.ctaButtonRow} ${containerClassName}`}>
      <button
        type="button"
        className={`${styles.ctaButton} ${themeStyles.ctaButton} ${className}`}
        aria-label="Let's Talk"
        tabIndex={0}
        onClick={openCalendly}
      >
        Let's Talk
      </button>
      {calendlyModal}
    </div>
  );
};

export default LetsTalkButton;
