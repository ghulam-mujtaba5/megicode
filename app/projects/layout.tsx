import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/metadata';

export { metadata } from './metadata';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Case Studies', path: '/projects' },
  ]);

  const collection = collectionPageJsonLd({
    name: 'Megicode Case Studies & Engineering Portfolio',
    description:
      'Proven engineering results across AI automation, healthcare clinic management, mobile apps, and enterprise SaaS platforms.',
    path: '/projects',
    items: [
      {
        name: 'The Aesthetics Place — Full-Stack Clinic Platform',
        path: '/projects/aesthetics-clinic-platform',
        description:
          'Complete digital transformation: public patient portal and internal clinic management system.',
      },
      {
        name: 'Fitter — Fitness & Workout Mobile App',
        path: '/projects/fitter-app',
        description:
          'React Native workout companion with offline sync, personalized plans, and analytics.',
      },
      {
        name: 'CampusAxis — Student Information & LMS Portal',
        path: '/projects/campusaxis-student-portal',
        description:
          'Scalable multi-tenant education management platform for universities and colleges.',
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      {children}
    </>
  );
}
