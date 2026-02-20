import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import { canonicalUrl, SITE_NAME, breadcrumbJsonLd, caseStudyJsonLd } from '@/lib/metadata';
import ProjectDetailClient from './ProjectDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const url = canonicalUrl(`/projects/${slug}`);
  const ogImage = `/api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent('Case Study | Megicode')}`;

  return {
    title: project.title,
    description: project.description,
    keywords: [...project.techStack, 'megicode', 'case study', project.category],
    openGraph: {
      title: `${project.title} | ${SITE_NAME}`,
      description: project.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | ${SITE_NAME}`,
      description: project.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: project.title, path: `/projects/${slug}` },
  ]);

  const caseStudy = caseStudyJsonLd({
    title: project.title,
    description: project.description,
    path: `/projects/${slug}`,
    image: project.image,
    techStack: project.techStack,
    testimonial: project.testimonial,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudy) }} />
      <ProjectDetailClient slug={slug} />
    </>
  );
}
