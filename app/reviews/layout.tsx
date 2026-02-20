export { metadata } from './metadata';
import { breadcrumbJsonLd, reviewJsonLd } from '@/lib/metadata';

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Reviews', path: '/reviews' },
  ]);

  const reviews = reviewJsonLd([
    {
      author: 'Dr. Aesthetics Place',
      reviewBody: 'Megicode built our entire clinic platform from scratch — a professional website and a complete internal management system for appointments, patient records, and billing. The team understood our medical practice needs perfectly. Our online presence went from zero to a website that actually brings in new patients. The internal portal has made daily operations seamless for our staff. Truly exceptional work from start to finish.',
      ratingValue: 5,
    },
    {
      author: 'COMSATS Student',
      reviewBody: 'CampusAxis is a lifesaver. Before this, I was juggling multiple WhatsApp groups and random websites just to find my timetable or past papers. Now everything is in one place — dashboard, discussions, campus news. The team at Megicode built something students actually need and use every day. Highly recommend checking it out.',
      ratingValue: 5,
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviews) }} />
      {children}
    </>
  );
}
