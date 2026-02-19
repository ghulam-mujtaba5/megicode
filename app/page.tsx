import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "Megicode - Custom Software Development, AI & Web Solutions",
  description: "Megicode delivers high-performance custom software solutions, including web and mobile applications, AI-driven systems, and data analytics. Partner with us to build your next big idea.",
  alternates: {
    canonical: 'https://megicode.com',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
