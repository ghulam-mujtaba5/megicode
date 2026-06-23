export type BlogStatus = 'draft' | 'published';

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogRelatedLink {
  label: string;
  href: string;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  contentHtml: string;
  coverImage?: string;
  coverImageAlt?: string;
  coverImageFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  authorName?: string;
  tags?: string[];
  categories?: string[];
  status: BlogStatus;
  publishedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  // Executive SEO fields
  primaryKeyword?: string;
  keywords?: string[];
  funnelStage?: string;
  audience?: string;
  readingMinutes?: number;
  ctaLabel?: string;
  ctaText?: string;
  faqs?: BlogFaq[];
  relatedLinks?: BlogRelatedLink[];
}

export interface BlogPost extends BlogPostInput {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
