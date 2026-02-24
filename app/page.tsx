import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "Megicode — AI-Powered Software Development for Startups & Businesses",
  description: "Megicode builds AI-powered software for startups, non-technical founders, and growing businesses. From AI SaaS MVPs to intelligent automation — your technical co-founder from idea to scale.",
  keywords: ['AI software development', 'AI-powered MVP', 'technical co-founder', 'AI SaaS development', 'startup software partner', 'AI automation for business', 'LLM integration', 'AI development company'],
  alternates: {
    canonical: 'https://megicode.com',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
