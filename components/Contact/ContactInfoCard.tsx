"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FaLinkedin, FaGithub, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

const socialLinks = [
  {
    icon: <FaLinkedin />, url: "https://www.linkedin.com/company/megicode", label: "LinkedIn"
  },
  {
    icon: <FaGithub />, url: "https://github.com/megicodes", label: "GitHub"
  },
  {
    icon: <FaInstagram />, url: "https://www.instagram.com/megicode/", label: "Instagram"
  },
];

export default function ContactInfoCard({ onlyCard = false }) {
  const { theme } = useTheme();
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        maxWidth: 400,
        margin: "0 auto 2.5rem auto",
        padding: "2rem 1.5rem 1.5rem 1.5rem",
        borderRadius: 20,
        background: theme === "dark" ? "#23272f" : "#f5f7fa",
        boxShadow: theme === "dark"
          ? "0 4px 24px 0 rgba(45,79,162,0.18)"
          : "0 4px 24px 0 rgba(69,115,223,0.08)",
        border: theme === "dark" ? "1px solid #2d4fa2" : "1px solid #4573df",
        textAlign: "center",
        zIndex: 2
      }}
    >
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: theme === "dark" ? "#fff" : "#1d2127" }}>Contact Details</h2>
        <p style={{ color: theme === "dark" ? "#eaf6ff" : "#4573df", fontSize: 16, marginBottom: 18 }}>
          Reach out to us directly via email, phone, or social media.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", marginBottom: 18 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, color: theme === "dark" ? "#fff" : "#1d2127" }}>
            <FaEnvelope /> info@megicode.com
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, color: theme === "dark" ? "#fff" : "#1d2127" }}>
            <FaPhone /> +123 456 7890
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
          {socialLinks.map((link, idx) => (
            <motion.a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              whileHover={{ scale: 1.18, rotate: [0, 8, -8, 0] }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                color: theme === "dark" ? "#4573df" : "#23272f",
                fontSize: 26,
                background: theme === "dark" ? "#181b20" : "#e5e7eb",
                borderRadius: "50%",
                padding: 10,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme === "dark"
                  ? "0 2px 8px 0 rgba(30,33,39,0.12)"
                  : "0 2px 8px 0 rgba(69,115,223,0.06)",
                transition: "background 0.2s, color 0.2s"
              }}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
  return onlyCard ? cardContent : <>{cardContent}</>;
}
