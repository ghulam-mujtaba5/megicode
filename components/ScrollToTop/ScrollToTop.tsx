"use client";
import React, { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollToTop({
    theme = 'light'
}: {
    theme?: 'light' | 'dark'
}) {
    const [isVisible, setIsVisible] = useState(false);
    const isDark = theme === 'dark';

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make surfing smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    if (!isVisible) return null;

    const buttonStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        zIndex: 999,
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: '#4573df',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(69, 115, 223, 0.25)',
        transition: 'all 0.3s ease-in-out',
        animation: 'fadeIn 0.3s'
    };

    return (
        <>
            <button
                onClick={scrollToTop}
                style={buttonStyle}
                className="scroll-to-top"
                aria-label="Scroll to top"
            >
                <FaChevronUp />
            </button>
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scroll-to-top:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(69, 115, 223, 0.45);
          filter: brightness(1.1);
        }
        @media (max-width: 768px) {
          .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
        </>
    );
}
