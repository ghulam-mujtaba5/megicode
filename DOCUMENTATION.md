# Megicode - Next.js Services Website

## Overview
Megicode is a modern, responsive web application built with Next.js and TypeScript. It showcases company services, projects, reviews, and contact information, with a focus on accessibility, performance, and a beautiful UI. The project uses dynamic imports, context for theming, and modular components for scalability.

## Features
- **Next.js 14+ App Router**: Uses the latest Next.js features for routing and server/client components.
- **TypeScript**: Type-safe codebase for reliability and maintainability.
- **Dynamic Imports**: Optimized loading for large components.
- **Custom Theme Context**: Light/dark mode support with context API.
- **Responsive Design**: Mobile and desktop navigation bars, grid layouts, and adaptive styles.
- **SEO & Accessibility**: Semantic HTML, ARIA labels, and hidden headings for screen readers.
- **Component-Based Architecture**: Reusable components for services, navigation, footer, and more.
- **Modern CSS**: Uses CSS modules and inline styles for scoped, theme-aware styling.

## Project Structure
```
app/
  ... (Next.js app directory structure)
  services/
    page.tsx         # Main services page (see below)
    servicesData.ts  # Data for services cards
components/
  ... (UI components: NavBar, Footer, Cards, etc.)
context/
  ThemeContext.tsx   # Theme context provider
hooks/
  ... (Custom React hooks)
public/
  ... (SVGs, images, static assets)
styles/
  ... (CSS modules, global styles)
utils/
  ... (Utility functions)
```

## Key Files
- `app/services/page.tsx`: Main page for listing all services. Uses dynamic imports, theme context, and renders service cards from data.
- `components/`: Contains all UI components, organized by feature.
- `context/ThemeContext.tsx`: Provides theme (light/dark) context to the app.
- `public/`: Contains all static assets (SVGs, images, etc.).
- `styles/`: CSS modules and global styles.

## How to Run
1. **Install dependencies**:
   ```sh
   npm install
   ```
2. **Run the development server**:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.
3. **Build for production**:
   ```sh
   npm run build
   npm start
   ```

## Theming
- The theme (light/dark) is managed via React context (`ThemeContext`).
- The toggle icon in the UI allows users to switch themes.
- Styles adapt based on the current theme.

## Accessibility
- Uses semantic HTML and ARIA attributes for navigation and main content.
- Hidden headings for screen readers.
- Keyboard navigable cards and buttons.

## Adding/Editing Services
- Edit `app/services/servicesData.ts` to add, remove, or update services.
- Each service should have a `slug`, `title`, `description`, `features`, `techs`, and `icon`.

## Deployment
- Standard Next.js deployment (Vercel, Netlify, or custom server).
- Ensure environment variables (if any) are set in `.env` files.

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint codebase

## License
Copyright 2025 Megicode. All Rights Reserved.

---

For questions or contributions, contact [Megicode on LinkedIn](https://www.linkedin.com/company/megicode) or [GitHub](https://github.com/megicode).
