"use client";
import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
import { useTheme } from "../../context/ThemeContext";
import NewNavBar from "../../components/NavBar_Desktop_Company/NewNavBar";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { SITE_SOCIAL, getCopyrightText } from '@/lib/constants';

// Dynamic imports for optimized loading
const ReviewsHero = dynamic(() => import("../../components/Reviews/ReviewsHero/ReviewsHero"), {
    loading: () => <LoadingAnimation size="medium" />
});
const ReviewsGrid = dynamic(() => import("../../components/Reviews/ReviewsGrid/ReviewsGrid"), {
    loading: () => <LoadingAnimation size="medium" />
});

export default function ReviewsPage() {
    const { theme } = useTheme();
    const { linkedinUrl, instagramUrl, githubUrl } = SITE_SOCIAL;
    const copyrightText = getCopyrightText();

    return (
      <div style={{ backgroundColor: theme === "dark" ? "var(--page-bg-dark, #1d2127)" : "var(--page-bg, #ffffff)", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Theme Toggle Icon */}
      <div id="theme-toggle" role="button" tabIndex={0}>
        <ThemeToggleIcon />
      </div>

      {/* Desktop NavBar */}
      <nav id="desktop-navbar" aria-label="Main Navigation">
        <NewNavBar />
      </nav>

      {/* Mobile NavBar */}
      <nav id="mobile-navbar" aria-label="Mobile Navigation">
        <NavBarMobile />
      </nav>   

        <main id="main-content" className="relative" aria-label="Reviews Main Content">
            <h1 style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>Reviews & Testimonials</h1>
            <Suspense fallback={<LoadingAnimation size="medium" />}>
                <ReviewsHero />
                <ReviewsGrid />
            </Suspense>
        </main>

            <Footer 
                linkedinUrl={linkedinUrl}
                instagramUrl={instagramUrl}
                githubUrl={githubUrl}
                copyrightText={copyrightText}
            />
        </div>
    );
}
