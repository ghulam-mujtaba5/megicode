export { metadata } from './metadata';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/metadata';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  const faq = faqJsonLd([
    {
      question: 'What types of projects do you specialize in?',
      answer: 'We specialize in building custom web applications, scalable mobile apps, and robust e-commerce solutions. We have extensive experience in SaaS development, enterprise software, and digital platform engineering for startups and established businesses.',
    },
    {
      question: 'Which technologies do you work with?',
      answer: 'Our team is proficient in a modern tech stack, including React, Next.js, and Node.js for web development, and React Native for mobile apps. We leverage cloud platforms like AWS and Vercel for scalable infrastructure and follow best practices in CI/CD and DevOps.',
    },
    {
      question: 'What does your typical project timeline look like?',
      answer: 'A typical project is divided into four phases: Discovery & Strategy (1-2 weeks), Design & Prototyping (2-4 weeks), Development & Testing (6-12 weeks), and Deployment & Support. Timelines vary based on project complexity, but we always provide a detailed roadmap upfront.',
    },
    {
      question: 'How do you handle project management and communication?',
      answer: 'We use an agile approach with weekly sprints and regular check-ins. You will have a dedicated project manager and access to a shared Slack channel and project board (like Jira or Trello) for transparent communication and real-time progress tracking.',
    },
    {
      question: 'What are your pricing models?',
      answer: 'We offer flexible pricing models to fit your needs, including fixed-price contracts for well-defined projects, time and materials for iterative development, and dedicated team retainers for ongoing collaboration. We provide a detailed proposal after our initial consultation.',
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      {children}
    </>
  );
}
