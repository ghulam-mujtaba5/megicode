import { breadcrumbJsonLd, reviewJsonLd } from '@/lib/metadata';
import { clientReviews } from '@/lib/reviews';

export { metadata } from './metadata';

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Reviews', path: '/reviews' },
  ]);

  const reviews = reviewJsonLd(
    clientReviews.map((review) => ({
      author: review.name,
      reviewBody: review.review,
      ratingValue: review.rating,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviews) }}
      />
      {children}
    </>
  );
}
