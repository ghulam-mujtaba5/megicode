const servicesData = [
  {
    icon: "/Ai icon.svg",
    title: "AI-Powered Product Development",
    slug: "ai-machine-learning",
    description: "We build intelligent software products with AI baked in from day one. From GPT-powered SaaS tools to custom ML models — we turn your AI idea into a production-ready product.",
    features: [
      "AI-Powered SaaS MVPs",
      "LLM & ChatGPT Integration",
      "Custom ML Model Development",
      "RAG Systems & AI Agents",
      "Predictive Analytics Engines"
    ],
    techs: ["Python", "OpenAI", "LangChain", "TensorFlow", "Next.js", "FastAPI"],
    keywords: ["AI MVP development", "build AI SaaS product", "GPT integration for startups", "AI product development agency", "LLM application development", "custom AI software company", "AI startup technical partner", "RAG system development"],
    openGraph: {
      title: "AI-Powered Product Development for Startups | Megicode",
      description: "We build intelligent software products with AI baked in from day one. GPT-powered SaaS, custom ML models, and AI agents — from idea to production.",
      url: "https://megicode.com/services/ai-machine-learning",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "AI-Powered Product Development | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "AI-Powered Product Development for Startups | Megicode",
      description: "We build intelligent software products with AI baked in from day one. GPT-powered SaaS, custom ML models, and AI agents.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/ai-machine-learning",
  },
  {
    icon: "/ds&ai-icon.svg",
    title: "AI Integration & Data Intelligence",
    slug: "data-analytics-bi",
    description: "Already have a product? We add AI superpowers to it. From intelligent dashboards and predictive analytics to AI chatbots and smart search — we integrate AI into your existing software.",
    features: [
      "AI Integration into Existing Products",
      "Intelligent Dashboards & Analytics",
      "AI Chatbot Development",
      "Smart Search & Recommendations",
      "Data Pipeline Automation"
    ],
    techs: ["Python", "OpenAI", "Power BI", "SQL", "Pandas", "FastAPI"],
    keywords: ["AI integration for existing software", "add AI to my product", "AI chatbot development", "intelligent dashboard development", "predictive analytics for startups", "AI data analytics agency"],
    openGraph: {
      title: "AI Integration & Data Intelligence for Startups | Megicode",
      description: "Add AI superpowers to your existing product. Intelligent dashboards, AI chatbots, smart search, and predictive analytics integration.",
      url: "https://megicode.com/services/data-analytics-bi",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "AI Integration & Data Intelligence | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "AI Integration & Data Intelligence for Startups | Megicode",
      description: "Add AI superpowers to your existing product. Intelligent dashboards, AI chatbots, smart search, and predictive analytics.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/data-analytics-bi",
  },
  {
    icon: "/web app icon.svg",
    title: "SaaS & Web Platform Development",
    slug: "custom-web-development",
    description: "Full-stack SaaS platforms and web applications for startups and growing businesses. We build scalable, production-ready products — from MVP to market-ready platforms with payment, auth, and admin panels built in.",
    process: [
      {
        title: "1. Product Discovery & Strategy",
        description: "We map your business model, user personas, and core features to build a product roadmap that minimizes time-to-market."
      },
      {
        title: "2. UI/UX Design & Prototyping",
        description: "Conversion-focused design with high-fidelity prototypes you can test with real users before writing a single line of code."
      },
      {
        title: "3. Agile Sprint Development",
        description: "We ship in 2-week sprints with demo reviews, so you see progress every step of the way."
      },
      {
        title: "4. Launch & Go Live",
        description: "Production deployment on scalable cloud infrastructure with CI/CD, monitoring, and zero-downtime deploys."
      },
      {
        title: "5. Growth & Iteration",
        description: "Post-launch analytics, A/B testing, feature iterations, and scaling support as your user base grows."
      }
    ],
    benefits: [
      {
        title: "Built for Scale",
        description: "Architecture designed to handle 10 users or 100,000 — auto-scaling infrastructure that grows with your startup."
      },
      {
        title: "Startup-Grade Security",
        description: "Auth, encryption, RBAC, and compliance built in from day one — so you're investor-ready and user-safe."
      },
      {
        title: "SEO & Performance First",
        description: "Server-rendered, Core Web Vitals optimized, and SEO-ready — because organic traffic is your cheapest growth channel."
      }
    ],
    faqs: [
      {
        question: "How fast can you build an MVP?",
        answer: "A focused MVP typically takes 6-10 weeks. We prioritize core features that validate your business hypothesis, then iterate based on real user feedback."
      },
      {
        question: "Do you work with non-technical founders?",
        answer: "That's our specialty. We handle everything technical — architecture, development, deployment, and maintenance — so you can focus on business and customers."
      },
      {
        question: "Can you integrate with third-party tools and APIs?",
        answer: "Absolutely. We build custom integrations with payment processors (Stripe, Razorpay), CRMs, email tools, analytics platforms, and any API-based service."
      }
    ],
    features: [
      "SaaS MVP Development",
      "Full-Stack Web Applications",
      "Admin Dashboards & Portals",
      "API Development & Integration",
      "Payment & Subscription Systems"
    ],
    techs: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL", "Stripe"],
    keywords: ["SaaS MVP development", "startup web development agency", "build SaaS platform", "Next.js development agency", "full-stack development for startups", "hire web developers for startup", "MVP development company"],
    openGraph: {
      title: "SaaS & Web Platform Development for Startups | Megicode",
      description: "Full-stack SaaS platforms and web apps for startups. From MVP to market-ready products with payment, auth, and admin panels built in.",
      url: "https://megicode.com/services/custom-web-development",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "SaaS & Web Platform Development | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "SaaS & Web Platform Development for Startups | Megicode",
      description: "Full-stack SaaS platforms and web apps for startups. From MVP to market-ready products.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/custom-web-development"
  },
  {
    icon: "/mobile app icon.svg",
    title: "Mobile App Development",
    slug: "mobile-app-solutions",
    description: "Cross-platform mobile apps with AI features for startups and businesses. We build performant iOS and Android apps using React Native and Flutter — with intelligent features that set you apart.",
    features: [
      "React Native & Flutter Apps",
      "AI-Powered Mobile Features",
      "Real-time & Push Notifications",
      "Offline-First Architecture",
      "App Store Optimization & Launch"
    ],
    techs: ["React Native", "Flutter", "Firebase", "Node.js", "TypeScript"],
    keywords: ["mobile app development for startups", "React Native development agency", "Flutter app development", "AI mobile app development", "cross-platform mobile app company", "startup mobile app builder"],
    openGraph: {
      title: "Mobile App Development for Startups | Megicode",
      description: "Cross-platform mobile apps with AI features. React Native and Flutter development for startups and growing businesses.",
      url: "https://megicode.com/services/mobile-app-solutions",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "Mobile App Development | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Mobile App Development for Startups | Megicode",
      description: "Cross-platform mobile apps with AI features. React Native and Flutter development for startups.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/mobile-app-solutions",
  },
  {
    icon: "/meta/rm.svg",
    title: "Cloud Infrastructure & DevOps",
    slug: "cloud-devops-services",
    description: "Scalable cloud architecture and DevOps for startups going from 0 to scale. We set up your entire cloud infrastructure, CI/CD pipelines, and monitoring — so your product stays fast, secure, and reliable as you grow.",
    features: [
      "Cloud Architecture for Startups",
      "CI/CD Pipeline Automation",
      "Infrastructure as Code",
      "Auto-Scaling & Cost Optimization",
      "Security & Compliance Setup"
    ],
    techs: ["AWS", "Vercel", "Docker", "GitHub Actions", "Terraform"],
    keywords: ["cloud infrastructure for startups", "DevOps for SaaS companies", "AWS setup for startups", "CI/CD pipeline for startups", "cloud cost optimization", "startup DevOps agency"],
    openGraph: {
      title: "Cloud Infrastructure & DevOps for Startups | Megicode",
      description: "Scalable cloud architecture and DevOps for startups. CI/CD, auto-scaling, monitoring, and security — built to grow with you.",
      url: "https://megicode.com/services/cloud-devops-services",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "Cloud & DevOps for Startups | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Cloud Infrastructure & DevOps for Startups | Megicode",
      description: "Scalable cloud architecture and DevOps for startups. CI/CD, auto-scaling, and security.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/cloud-devops-services",
  },
  {
    icon: "/data scrapping icon.svg",
    title: "AI Automation for Businesses",
    slug: "automation-integration",
    description: "Intelligent workflow automation for SMEs and growing companies. We replace manual, repetitive tasks with AI-powered automation — saving you hours every week and reducing human error.",
    features: [
      "AI-Powered Workflow Automation",
      "Smart Chatbots & Virtual Assistants",
      "API & System Integration",
      "Automated Reporting & Alerts",
      "Process Optimization with AI"
    ],
    techs: ["Python", "OpenAI", "n8n", "Zapier", "Node.js", "Make"],
    keywords: ["AI automation for small business", "workflow automation agency", "AI chatbot for business", "business process automation with AI", "automate repetitive tasks AI", "SME automation solutions", "intelligent automation company"],
    openGraph: {
      title: "AI Automation for Businesses & SMEs | Megicode",
      description: "Intelligent workflow automation for SMEs. Replace manual tasks with AI-powered automation that saves hours every week.",
      url: "https://megicode.com/services/automation-integration",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "AI Automation for Businesses | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "AI Automation for Businesses & SMEs | Megicode",
      description: "Replace manual tasks with AI-powered automation. Smart chatbots, workflow automation, and system integration.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/automation-integration",
  },
  {
    icon: "/Ui&Ux-icon.svg",
    title: "Product Design & UX Strategy",
    slug: "ui-ux-product-design",
    description: "Conversion-focused design for AI-powered products and SaaS platforms. We design interfaces that users love — backed by research, prototyping, and iterative testing to maximize engagement and retention.",
    features: [
      "Product Strategy & Roadmapping",
      "UI/UX Design Systems",
      "High-Fidelity Prototyping",
      "Conversion-Focused Design",
      "Usability Testing & Iteration"
    ],
    techs: ["Figma", "Framer", "Storybook", "Adobe XD", "Analytics"],
    keywords: ["SaaS product design agency", "startup UX design", "AI product design", "conversion focused UI design", "Figma design agency for startups", "product design for SaaS"],
    openGraph: {
      title: "Product Design & UX Strategy for Startups | Megicode",
      description: "Conversion-focused design for SaaS and AI-powered products. Research-backed interfaces that maximize engagement and retention.",
      url: "https://megicode.com/services/ui-ux-product-design",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "Product Design & UX | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Product Design & UX Strategy for Startups | Megicode",
      description: "Conversion-focused design for SaaS and AI-powered products. Interfaces that maximize engagement.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/ui-ux-product-design",
  },
  {
    icon: "/it-consulting-support-icon.svg",
    title: "Technical Co-Founder as a Service",
    slug: "it-consulting-support",
    description: "Your dedicated tech partner — from idea to scale. For non-technical founders who need CTO-level guidance without hiring a full-time CTO. We handle architecture, team building, tech strategy, and investor-ready due diligence.",
    features: [
      "CTO-Level Tech Strategy",
      "Architecture & Stack Selection",
      "Development Team Building",
      "Product Roadmap Planning",
      "Investor-Ready Tech Due Diligence"
    ],
    techs: ["Architecture", "Agile", "Team Management", "Due Diligence", "Roadmapping"],
    keywords: ["technical co-founder for startups", "fractional CTO service", "CTO as a service", "tech partner for non-technical founders", "startup technical advisor", "outsourced CTO for startup", "tech strategy consulting for founders"],
    openGraph: {
      title: "Technical Co-Founder as a Service | Megicode",
      description: "CTO-level guidance for non-technical founders. Architecture, team building, tech strategy, and investor-ready due diligence — without hiring a full-time CTO.",
      url: "https://megicode.com/services/it-consulting-support",
      images: [{ url: "/meta/services-og.png", width: 1200, height: 630, alt: "Technical Co-Founder as a Service | Megicode" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Technical Co-Founder as a Service | Megicode",
      description: "CTO-level guidance for non-technical founders. Architecture, strategy, and investor-ready tech due diligence.",
      images: ["/meta/services-og.png"],
    },
    canonical: "https://megicode.com/services/it-consulting-support",
  }
];

export default servicesData;
