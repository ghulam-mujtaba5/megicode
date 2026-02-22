import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "Megicode — Custom Software Development, AI & Web Solutions in Pakistan",
  description: "Megicode is a next-generation software agency in Pakistan specializing in custom AI development, scalable web & mobile applications, cloud migration, and data analytics. We help startups and enterprises ship production-ready software faster.",
  alternates: {
    canonical: 'https://megicode.com',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
