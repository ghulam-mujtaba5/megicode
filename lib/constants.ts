// ─── Shared site constants ───────────────────────────────────
// Single source of truth for values duplicated across pages.

export const SITE_SOCIAL = {
  linkedinUrl: 'https://www.linkedin.com/company/megicode',
  instagramUrl: 'https://www.instagram.com/megicode/',
  githubUrl: 'https://github.com/megicodes',
} as const;

export const CONTACT_EMAIL = 'contact@megicode.com';

export function getCopyrightText() {
  return `Copyright ${new Date().getFullYear()} Megicode. All Rights Reserved.`;
}

export const NAV_SECTIONS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'article', label: 'Article', href: '/article' },
  { id: 'contact', label: 'Contact', href: '/contact' },
  { id: 'reviews', label: 'Reviews', href: '/reviews' },
  { id: 'careers', label: 'Careers', href: '/careers' },
] as const;
