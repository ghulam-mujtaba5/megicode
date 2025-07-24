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
## Theming

The project uses a robust, modular theming system to support both light and dark modes across all major sections and components (except the careers page, which has a separate approach).

### Three-File CSS Module Structure
For each main section or component, there are three CSS module files:
- **Common Styles:** `[Component]Common.module.css` — Contains shared styles used in both themes.
- **Light Theme Styles:** `[Component]Light.module.css` — Contains styles specific to light mode.
- **Dark Theme Styles:** `[Component]Dark.module.css` — Contains styles specific to dark mode.

#### Example (About Section):
- `components/AboutHero/AboutHeroCommon.module.css`
- `components/AboutHero/AboutHeroLight.module.css`
- `components/AboutHero/AboutHeroDark.module.css`

This pattern is consistently applied throughout the project for sections like About, Services, Contact, and more. For example, the Services section uses:
- `app/services/ai-machine-learning-common.module.css`
- `app/services/ai-machine-learning-light.module.css`
- `app/services/ai-machine-learning-dark.module.css`

### How It Works
- **Theme Context:** The current theme (light or dark) is managed via React context (`ThemeContext`).
- **Dynamic Imports:** Components dynamically import and apply the appropriate CSS module(s) based on the active theme.
- **Class Composition:** Shared classes from the Common file are always applied. Light or Dark classes are conditionally applied depending on the theme.
- **Global Theme Class:** A global `.darkTheme` or `.lightTheme` class may be applied to the `<body>` or a top-level wrapper, aiding in CSS specificity for theme overrides.

### Why This Structure?
- **Separation of Concerns:** Keeps shared, light-only, and dark-only styles organized and maintainable.
- **Scalability:** Makes it easy to update or extend theming for new components or sections.
- **Consistency:** Ensures a uniform approach to theming across the codebase.


## Accessibility

## Adding/Editing Services

To add, remove, or update services displayed on the Services page, edit the `app/services/servicesData.ts` file. Each service is represented as an object in the exported array. Follow these steps and guidelines:

### 1. Service Object Structure
Each service should be an object with the following fields:

| Field        | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| `slug`       | string   | Unique identifier for the service (used in URLs, e.g., `web-development`).   |
| `title`      | string   | Display name of the service.                                                |
| `description`| string   | Short summary (1-2 sentences) describing the service.                       |
| `features`   | string[] | List of key features or offerings for this service.                         |
| `techs`      | string[] | Technologies/tools used (e.g., ['React', 'Node.js']).                        |
| `icon`       | string   | Path to the SVG icon in `public/` or a React component for the icon.         |

#### Example:
```ts
{
  slug: 'web-development',
  title: 'Web Development',
  description: 'Modern, scalable websites and web apps tailored to your business needs.',
  features: [
    'Responsive design',
    'SEO optimization',
    'Performance-focused',
    'Custom CMS integration'
  ],
  techs: ['Next.js', 'React', 'TypeScript', 'Node.js'],
  icon: '/web app icon.svg',
}
```

### 2. Adding a New Service
1. Open `app/services/servicesData.ts`.
2. Copy an existing service object and paste it at the end of the array (before the closing bracket).
3. Update the fields as needed:
   - **slug**: Use lowercase, hyphen-separated words. Must be unique.
   - **title**: Clear, concise name.
   - **description**: 1-2 sentences, avoid jargon.
   - **features**: 3-6 bullet points, each a short phrase.
   - **techs**: List of relevant technologies.
   - **icon**: Path to an SVG in `public/` or a React icon component.
4. Save the file. The new service will appear automatically on the Services page.

### 3. Editing or Removing a Service
- **Edit**: Find the service object and update any fields as needed.
- **Remove**: Delete the entire object from the array.

### 4. Best Practices
- Keep slugs unique and URL-friendly.
- Use consistent formatting and indentation.
- Prefer SVG icons for scalability and theme support.
- Keep descriptions and features concise and user-focused.
- If adding a new icon, place it in `public/` and reference its path.

### 5. Preview Changes
After editing, run the development server (`npm run dev`) and visit `/services` to verify your changes.

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

For questions or contributions, contact [Megicode on LinkedIn](https://www.linkedin.com/company/megicode) or [GitHub](https://github.com/megicodes).
