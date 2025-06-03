"use client";
import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
import { useTheme } from "../../context/ThemeContext";
import NavBarDesktop from "../../components/NavBar_Desktop_Company/nav-bar-Company";
import NavBarMobile from "../../components/NavBar_Mobile/NavBar-mobile";
import Footer from "../../components/Footer/Footer";
import ThemeToggleIcon from "../../components/Icon/sbicon";
import Loading from "../loading";

// Dynamic imports for optimized loading
const ReviewsHero = dynamic(() => import("../../components/Reviews/ReviewsHero/ReviewsHero"), {
    loading: () => <Loading />
});
const ReviewsGrid = dynamic(() => import("../../components/Reviews/ReviewsGrid/ReviewsGrid"), {
    loading: () => <Loading />
});

export default function ReviewsPage() {
    const { theme } = useTheme();

    const sections = [
        { label: "Home", route: "/" },
        { label: "About", route: "/about" },
        { label: "Services", route: "/services" },
        { label: "Reviews", route: "/reviews" },
        { label: "Project", route: "/project" },
        { label: "Contact", route: "/contact" },
    ];

    return (
        <div className={`min-h-screen ${theme}`}>            <div className="relative z-50">
                <NavBarDesktop />
                <NavBarMobile sections={sections} />
                <ThemeToggleIcon />
            </div>

            <main className="relative">
                <Suspense fallback={<Loading />}>
                    <ReviewsHero />
                    <ReviewsGrid />
                </Suspense>
            </main>

            <Footer 
                linkedinUrl="https://www.linkedin.com/company/megicode"
                instagramUrl="https://www.instagram.com/megicode"
                githubUrl="https://github.com/megicode"
                copyrightText="© 2025 Megicode. All rights reserved."
            />
        </div>
    );
}
