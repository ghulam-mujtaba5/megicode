export type BlogStatus = 'draft' | 'published';

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
}

export interface BlogPost extends BlogPostInput {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
