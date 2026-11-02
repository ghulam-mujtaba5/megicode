export type PricingTier = {
  name: string;
  price: string;
  timeline: string;
  description: string;
  deliverables: string[];
  isPopular?: boolean;
  ctaText?: string;
};

export type ComparisonDimension = {
  dimension: string;
  megicode: string;
  agency: string;
  freelancer: string;
  inHouse: string;
};

export type AnswerCapsuleData = {
  definition: string;
  targetAudience: string;
  deliveryScope: string;
  roiBenchmark: string;
  turnaround: string;
  ownership: string;
};

export type ServicePageCopy = {
  mainSalesPitch: string;
  supportingLine: string;
  proofMicroLine: string;
  primaryCta: string;
  abVariant: string;
  useCaseHeading: string;
  useCases: string[];
  outcomes: { title: string; description: string }[];
  decisionGuide: {
    goodFit: string[];
    notFor: string[];
  };
  definitionBlock: string;
  answerCapsule: AnswerCapsuleData;
  pricingTiers: PricingTier[];
  comparisonMetrics: ComparisonDimension[];
};

export const defaultComparisonMetrics: ComparisonDimension[] = [
  {
    dimension: 'Time to Market',
    megicode: '1–8 Weeks sprint delivery with weekly working builds',
    agency: '3–9 Months with prolonged scoping and meetings',
    freelancer: 'Unpredictable timelines & high project abandonment risk',
    inHouse: '3–6 Months to recruit, hire, and onboard engineers',
  },
  {
    dimension: 'Architecture & Code Quality',
    megicode: 'Production Next.js, TypeScript & clean scalable patterns',
    agency: 'Junior-assembled templates with heavy technical debt',
    freelancer: 'Inconsistent patterns, limited testing & poor documentation',
    inHouse: 'High quality, but significant initial ramp-up delay',
  },
  {
    dimension: 'Dedicated Principal Engineer',
    megicode: 'Direct founder & lead architect involvement on every build',
    agency: 'Junior developers managed by non-technical account reps',
    freelancer: 'Solo developer lacking cross-domain architecture breadth',
    inHouse: 'Requires $180k+/yr salary plus equity and benefits',
  },
  {
    dimension: 'Cost Predictability',
    megicode: '100% Fixed-price milestones with 0 hidden change fees',
    agency: 'Hourly creep and expensive billable change orders',
    freelancer: 'Scope ambiguity leading to sudden rate renegotiations',
    inHouse: 'High fixed burn ($15k–$25k/month ongoing payroll)',
  },
  {
    dimension: 'IP Ownership & Security',
    megicode: '100% Full source code, IP, and repository ownership',
    agency: 'Proprietary lock-in or restrictive agency licensing clauses',
    freelancer: 'Legal ambiguity and risk of unvetted code reuse',
    inHouse: '100% company-owned IP after legal employment contracts',
  },
  {
    dimension: 'Post-Launch Support & SLA',
    megicode: 'Direct engineering warranty, documentation & support SLA',
    agency: 'Expensive monthly retainers ($3k–$10k/mo required)',
    freelancer: 'High ghosting risk after final milestone payment',
    inHouse: 'Continuous internal support, dependent on team retention',
  },
];

const servicePageCopy: Record<string, ServicePageCopy> = {
  'ui-ux-design': {
    mainSalesPitch:
      'Good design makes users trust faster, understand faster, and take action faster.',
    supportingLine: 'We remove confusion from screens so users feel confident using your product.',
    proofMicroLine:
      'Stanford: credible websites are useful, easy to use, and show real trust signals.',
    primaryCta: 'Improve My UX',
    abVariant: 'A confusing interface does not just look bad; it makes users doubt the business.',
    useCaseHeading:
      'Use this when users hesitate, get confused, or stop before the action you need.',
    useCases: [
      'Users hesitate, drop off, or ask for help because screens are unclear.',
      'Your product has grown, but the interface now feels inconsistent or crowded.',
      'You need sharper flows before development, fundraising, or a major launch.',
    ],
    outcomes: [
      {
        title: 'Clearer flows',
        description: 'Users can understand the next step without extra explanation.',
      },
      {
        title: 'Reusable design system',
        description:
          'Core components, spacing, states, and patterns stay consistent across screens.',
      },
      {
        title: 'Developer-ready handoff',
        description:
          'Design files, interaction notes, and edge states are ready for implementation.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'You have an existing product that feels hard to use.',
        'You need wireframes, prototypes, or a full product UI.',
        'You want design decisions tied to conversion, trust, and retention.',
      ],
      notFor: [
        'Pure logo-only branding work.',
        'Decorative mockups without product logic.',
        'Design changes without access to the real user journey.',
      ],
    },
    definitionBlock:
      'Megicode crafts conversion-focused UI/UX product designs and scalable design systems for SaaS startups and digital platforms. We deliver high-fidelity Figma prototypes, interactive user journey maps, design tokens, and developer-ready design specifications in 2 to 4 weeks, increasing user onboarding completion by 35% and cutting development rework in half.',
    answerCapsule: {
      definition:
        'Megicode crafts conversion-focused UI/UX product designs and scalable design systems for SaaS startups and digital platforms. We deliver high-fidelity Figma prototypes, interactive user journey maps, design tokens, and developer-ready design specifications in 2 to 4 weeks, increasing user onboarding completion by 35% and cutting development rework in half.',
      targetAudience: 'SaaS founders, product teams, and scaling B2B platforms needing conversion-driven interfaces.',
      deliveryScope: 'User research, wireframing, high-fidelity Figma design systems, interactive prototypes, and dev handoff.',
      roiBenchmark: '+35% onboarding completion, -50% frontend engineering rework, 2-4 week delivery.',
      turnaround: '2–4 Weeks',
      ownership: '100% Figma Source Files & Component Token Ownership',
    },
    pricingTiers: [
      {
        name: 'UX Audit & Sprint',
        price: '$800',
        timeline: '1–2 Weeks',
        description: 'Rapid UX heuristic audit, friction identification, and wireframe redesign of 3 core conversion flows.',
        deliverables: [
          'Comprehensive heuristic UX evaluation',
          '3 core user flow redesigns in Figma',
          'Conversion bottleneck analysis report',
          'Developer handoff notes & annotations',
        ],
        isPopular: false,
        ctaText: 'Book UX Audit',
      },
      {
        name: 'Full Product UI/UX',
        price: '$2,400',
        timeline: '2–4 Weeks',
        description: 'Complete end-to-end product UI/UX design, design system tokens, and 15+ high-fidelity interactive screens.',
        deliverables: [
          'Complete Figma design system & tokens',
          '15+ responsive screens (Desktop & Mobile)',
          'Interactive prototype for user testing',
          'Component states & edge-case library',
          'Developer handoff call & documentation',
        ],
        isPopular: true,
        ctaText: 'Start Product Design',
      },
      {
        name: 'Enterprise Design System',
        price: '$5,000+',
        timeline: '4–6 Weeks',
        description: 'Multi-platform design system architecture, 40+ screens, dark/light theme tokens, and micro-interactions.',
        deliverables: [
          'Multi-brand scalable design token architecture',
          '40+ high-fidelity responsive screens',
          'Micro-interactions & animation specs',
          'Accessibility (WCAG AA) compliance verification',
          'Ongoing design-dev collaboration sprint',
        ],
        isPopular: false,
        ctaText: 'Request Custom Scope',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'custom-web-development': {
    mainSalesPitch:
      'Your software should fit your business, not force your business to adjust around it.',
    supportingLine:
      'We build custom portals, dashboards, workflows, and internal systems around your real operations.',
    proofMicroLine:
      'PwC: customers value speed, convenience, and easy experiences when choosing brands.',
    primaryCta: 'Build My Web App',
    abVariant:
      'Messy software slows teams down. Custom systems make work smoother and easier to manage.',
    useCaseHeading:
      'Use this when operations need software that follows the real business process.',
    useCases: [
      'Your team is stuck using spreadsheets, manual approvals, or disconnected tools.',
      'Customers or staff need a portal, dashboard, booking flow, or internal workflow.',
      'Your current software blocks operations because it was not built around your process.',
    ],
    outcomes: [
      {
        title: 'Operational fit',
        description: 'The system follows your real workflow instead of forcing workarounds.',
      },
      {
        title: 'Scalable architecture',
        description:
          'Authentication, roles, data structure, and integrations are planned before build.',
      },
      {
        title: 'Launch-ready product',
        description:
          'Performance, responsive UI, deployment, and admin visibility are handled together.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'You need a real web application, not just a static website.',
        'You want dashboards, portals, workflows, or integrations.',
        'You need a product that can evolve after launch.',
      ],
      notFor: [
        'A one-page brochure site only.',
        'A project with no clear workflow or users.',
        'A build where maintainability is not important.',
      ],
    },
    definitionBlock:
      'Megicode develops enterprise-grade custom web applications, internal operational portals, and customer-facing platforms for scaling companies. We deliver high-performance Next.js architectures, complex database schemas, role-based access controls, and third-party API integrations in 4 to 10 weeks, delivering 3x faster workflows, 99.9% uptime, and complete source code ownership.',
    answerCapsule: {
      definition:
        'Megicode develops enterprise-grade custom web applications, internal operational portals, and customer-facing platforms for scaling companies. We deliver high-performance Next.js architectures, complex database schemas, role-based access controls, and third-party API integrations in 4 to 10 weeks, delivering 3x faster workflows, 99.9% uptime, and complete source code ownership.',
      targetAudience: 'Growing enterprises, B2B companies, and operators needing bespoke portals and business web applications.',
      deliveryScope: 'Full-stack Next.js/TypeScript architecture, PostgreSQL/database schema, RBAC, API integrations, and cloud deployment.',
      roiBenchmark: '3x operational workflow velocity, 99.9% uptime SLA, $0 ongoing vendor platform fees.',
      turnaround: '4–10 Weeks',
      ownership: '100% Full Source Code & Repository Transfer',
    },
    pricingTiers: [
      {
        name: 'Essential Portal',
        price: '$1,800',
        timeline: '2–3 Weeks',
        description: 'Custom database dashboard, client portal, or internal workflow app with secure authentication and CRUD flows.',
        deliverables: [
          'Full-stack Next.js web application',
          'User authentication & role permissions',
          'Database setup (PostgreSQL / Supabase)',
          'Responsive UI with dark/light mode',
          'Production Vercel / Cloud deployment',
        ],
        isPopular: false,
        ctaText: 'Build Essential Portal',
      },
      {
        name: 'Full Business Platform',
        price: '$4,500',
        timeline: '4–8 Weeks',
        description: 'End-to-end custom operational platform with multi-tier permissions, payment integration, external API sync, and reporting.',
        deliverables: [
          'Complex multi-role permissions & access control',
          'Payment & billing integration (Stripe / PayPal)',
          'Third-party API & webhook automation',
          'Custom analytics & exportable reports',
          'Automated database backups & security audit',
          '30-day post-launch engineering warranty',
        ],
        isPopular: true,
        ctaText: 'Build Full Platform',
      },
      {
        name: 'Enterprise System',
        price: '$9,500+',
        timeline: '6–10 Weeks',
        description: 'High-concurrency enterprise web platform with microservice architecture, custom ERP/CRM sync, and compliance telemetry.',
        deliverables: [
          'Enterprise multi-tenant microservices architecture',
          'Custom ERP/CRM integrations & legacy sync',
          'High-throughput caching & database optimization',
          'Automated CI/CD deployment pipeline',
          'Full security hardening & SOC2 compliance prep',
          '60-day SLA warranty & team onboarding',
        ],
        isPopular: false,
        ctaText: 'Consult Enterprise Architect',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'ai-saas-mvp-development': {
    mainSalesPitch:
      'AI should not be added for hype; it should make your product smarter and more useful.',
    supportingLine:
      'We build AI features around real user needs: assistants, recommendations, search, scoring, and analysis.',
    proofMicroLine:
      'MIT NANDA: only a small share of GenAI pilots create measurable value without proper integration.',
    primaryCta: 'Build My AI Product',
    abVariant: 'The best AI products solve a real workflow, not just add a chatbot.',
    useCaseHeading:
      'Use this when AI needs to improve a real decision, workflow, or product moment.',
    useCases: [
      'You want AI features inside a product, not a disconnected experiment.',
      'Users need search, recommendations, scoring, summaries, assistants, or analysis.',
      'You need to turn AI capability into a workflow people can actually trust and use.',
    ],
    outcomes: [
      {
        title: 'Workflow-first AI',
        description: 'AI is designed around user decisions, data flow, and human control points.',
      },
      {
        title: 'Production integration',
        description: 'Prompts, models, APIs, permissions, and fallbacks are planned for real use.',
      },
      {
        title: 'Measurable value',
        description:
          'The feature is judged by saved time, better decisions, or improved user experience.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'You have a specific user workflow AI can improve.',
        'You have data, documents, or product actions AI can use.',
        'You need AI designed into the product experience.',
      ],
      notFor: [
        'AI added only because competitors mention it.',
        'A chatbot with no clear business task.',
        'A pilot with no success metric or owner.',
      ],
    },
    definitionBlock:
      'Megicode designs and builds launch-ready AI SaaS MVPs for startup founders and enterprise innovators. We deliver complete Next.js web applications featuring LLM integrations, multi-tenant authentication, Stripe billing, and vector database architectures within 4 to 8 weeks, slashing time-to-market by 60% with production-grade engineering and zero technical debt.',
    answerCapsule: {
      definition:
        'Megicode designs and builds launch-ready AI SaaS MVPs for startup founders and enterprise innovators. We deliver complete Next.js web applications featuring LLM integrations, multi-tenant authentication, Stripe billing, and vector database architectures within 4 to 8 weeks, slashing time-to-market by 60% with production-grade engineering and zero technical debt.',
      targetAudience: 'Startup founders, non-technical entrepreneurs, and product leaders launching proprietary AI SaaS products.',
      deliveryScope: 'Full-stack Next.js app, OpenAI/Anthropic model integration, RAG vector embeddings, Stripe billing, and admin dashboard.',
      roiBenchmark: '60% faster launch speed, validated revenue readiness in 4-8 weeks, 100% intellectual property ownership.',
      turnaround: '4–8 Weeks',
      ownership: '100% Full IP, Codebase, and AI Prompt Pipeline Ownership',
    },
    pricingTiers: [
      {
        name: 'Lean AI MVP Sprint',
        price: '$2,800',
        timeline: '2–4 Weeks',
        description: 'Rapid proof-of-concept AI web app with single core LLM workflow, user auth, database, and polished UI.',
        deliverables: [
          'Next.js & Tailwind application skeleton',
          'OpenAI / Anthropic API integration with streaming',
          'User authentication & session management',
          'Database setup with Supabase / PostgreSQL',
          'Production cloud deployment & testing',
        ],
        isPopular: false,
        ctaText: 'Launch Lean AI MVP',
      },
      {
        name: 'Full AI SaaS Launch',
        price: '$5,500',
        timeline: '4–8 Weeks',
        description: 'Complete commercial SaaS MVP with RAG vector search, multi-tiered Stripe billing, admin portal, and usage limits.',
        deliverables: [
          'Full-featured AI SaaS web application',
          'RAG vector database search (Pinecone / pgvector)',
          'Stripe subscription checkout & customer portal',
          'Token usage rate-limiting & cost controls',
          'Admin analytics & user management dashboard',
          '30-day post-launch warranty & maintenance',
        ],
        isPopular: true,
        ctaText: 'Build Full AI SaaS',
      },
      {
        name: 'Enterprise Scale AI SaaS',
        price: '$11,000+',
        timeline: '6–10 Weeks',
        description: 'Multi-tenant enterprise AI platform with custom model fine-tuning, SOC2 security controls, and high-concurrency architecture.',
        deliverables: [
          'Multi-tenant enterprise architecture & team workspaces',
          'Custom model fine-tuning & prompt evaluation pipeline',
          'Role-based permissions & audit logging',
          'Enterprise telemetry, Datadog & error monitoring',
          'Full automated testing suite (E2E & integration)',
          '60-day engineering SLA warranty',
        ],
        isPopular: false,
        ctaText: 'Talk to Lead AI Engineer',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'data-analytics': {
    mainSalesPitch: 'Better data turns guessing into confident decisions.',
    supportingLine:
      'We build dashboards, reports, analytics, and decision-support tools that make performance clear.',
    proofMicroLine:
      'McKinsey: AI value grows when companies integrate intelligence into core workflows.',
    primaryCta: 'Turn Data Into Insights',
    abVariant: 'Business leaders do not need more charts; they need clearer decisions.',
    useCaseHeading: 'Use this when leaders need one trusted view of performance and next actions.',
    useCases: [
      'Your data exists, but leaders still rely on manual reports or guesswork.',
      'Teams need one trusted view of sales, operations, finance, or product performance.',
      'You need dashboards that explain what to do next, not just what happened.',
    ],
    outcomes: [
      {
        title: 'Reliable reporting',
        description: 'Data sources, definitions, and dashboards are aligned around real KPIs.',
      },
      {
        title: 'Decision clarity',
        description: 'Charts are organized around questions leaders actually need answered.',
      },
      {
        title: 'Operational visibility',
        description:
          'Teams can monitor performance, bottlenecks, and trends without manual reporting.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'You have scattered data sources.',
        'You need executive or operational dashboards.',
        'You want reporting that supports recurring decisions.',
      ],
      notFor: [
        'Charts made only for decoration.',
        'Unowned data with no source of truth.',
        'Analytics without a clear business question.',
      ],
    },
    definitionBlock:
      'Megicode builds custom business intelligence platforms, real-time analytics dashboards, and automated data pipelines for data-driven companies. We deliver unified data warehouse connections, interactive executive reporting interfaces, predictive modeling, and automated KPI tracking in 2 to 6 weeks, cutting manual reporting labor by 80% and delivering instant executive decision clarity.',
    answerCapsule: {
      definition:
        'Megicode builds custom business intelligence platforms, real-time analytics dashboards, and automated data pipelines for data-driven companies. We deliver unified data warehouse connections, interactive executive reporting interfaces, predictive modeling, and automated KPI tracking in 2 to 6 weeks, cutting manual reporting labor by 80% and delivering instant executive decision clarity.',
      targetAudience: 'Executives, finance leaders, and operational managers wanting automated KPI tracking and unified dashboards.',
      deliveryScope: 'Data warehouse modeling (PostgreSQL/BigQuery/Snowflake), ETL pipeline integration, interactive dashboards, and automated email alerts.',
      roiBenchmark: '80% reduction in manual report preparation hours, real-time decision visibility across 100% of core business metrics.',
      turnaround: '2–6 Weeks',
      ownership: '100% Source Code & Data Warehouse Schema Ownership',
    },
    pricingTiers: [
      {
        name: 'BI Dashboard Sprint',
        price: '$900',
        timeline: '1–2 Weeks',
        description: 'Single-source interactive executive dashboard connecting your database, Stripe, or CRM with 5 core KPI visual widgets.',
        deliverables: [
          'Single-source database / API connector',
          'Interactive dashboard with date & category filters',
          '5 core business KPI visual metric cards',
          'Automated daily / weekly email digest summary',
          'Production hosting & access control',
        ],
        isPopular: false,
        ctaText: 'Build BI Dashboard',
      },
      {
        name: 'Full Data Pipeline & BI',
        price: '$2,500',
        timeline: '2–4 Weeks',
        description: 'Multi-source ETL data pipeline aggregating CRM, ads, payments, and product usage into a unified executive BI portal.',
        deliverables: [
          'Multi-source data aggregation (Postgres, Stripe, Ads, CRM)',
          'Automated ETL data ingestion pipeline',
          'Multi-view executive and operational dashboards',
          'Export to PDF / CSV & scheduled Slack alerts',
          'Role-based permissions & viewer access',
        ],
        isPopular: true,
        ctaText: 'Build Full BI Pipeline',
      },
      {
        name: 'Enterprise Data Intelligence',
        price: '$6,500+',
        timeline: '4–8 Weeks',
        description: 'Warehouse-scale analytics platform with Snowflake/BigQuery, predictive analytics, automated anomaly detection, and custom dashboards.',
        deliverables: [
          'Enterprise data warehouse modeling & schema design',
          'Real-time streaming ingestion & event processing',
          'Predictive modeling & churn/revenue forecasting',
          'Automated anomaly detection alerts',
          'Comprehensive SLA & ongoing pipeline monitoring',
        ],
        isPopular: false,
        ctaText: 'Consult Data Architect',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'mobile-app-development': {
    mainSalesPitch: 'A mobile app keeps your business closer to customers every day.',
    supportingLine:
      'We build fast, clean mobile experiences that improve access, engagement, and retention.',
    proofMicroLine:
      'Google: 53% of mobile visits are likely abandoned if loading takes over 3 seconds.',
    primaryCta: 'Build My Mobile App',
    abVariant: 'If mobile feels slow or confusing, users leave before they see your value.',
    useCaseHeading: 'Use this when the customer journey needs to work smoothly from the first tap.',
    useCases: [
      'Customers need faster access than a website can provide.',
      'Your app needs login, profiles, notifications, booking, payments, or real-time updates.',
      'You want one mobile experience that feels clean across iOS and Android.',
    ],
    outcomes: [
      {
        title: 'Mobile-first UX',
        description: 'Navigation, touch targets, states, and speed are designed for phone use.',
      },
      {
        title: 'Reliable app flow',
        description:
          'Core journeys are built around authentication, data sync, and app store readiness.',
      },
      {
        title: 'Retention support',
        description: 'Notifications, analytics, and post-launch improvements are planned early.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'You need repeated customer engagement.',
        'The service depends on location, notifications, or fast access.',
        'You want a polished app store launch.',
      ],
      notFor: [
        'A website wrapped as an app without mobile value.',
        'A vague app idea without core user journeys.',
        'A build with no plan for updates after launch.',
      ],
    },
    definitionBlock:
      'Megicode builds cross-platform iOS and Android mobile applications for consumer brands and B2B platforms using React Native and Flutter. We deliver native device integrations, offline data synchronization, push notifications, and App Store submission readiness in 4 to 8 weeks, achieving sub-2-second startup speeds and 99.8% crash-free user sessions.',
    answerCapsule: {
      definition:
        'Megicode builds cross-platform iOS and Android mobile applications for consumer brands and B2B platforms using React Native and Flutter. We deliver native device integrations, offline data synchronization, push notifications, and App Store submission readiness in 4 to 8 weeks, achieving sub-2-second startup speeds and 99.8% crash-free user sessions.',
      targetAudience: 'Consumer brands, B2B services, and startups seeking high-performance iOS and Android mobile applications.',
      deliveryScope: 'Cross-platform mobile codebase (React Native / Flutter), REST API sync, biometric auth, push notifications, and App Store/Play Store deployment.',
      roiBenchmark: '<2s launch speed, 99.8% crash-free sessions, 50% cost savings with unified single codebase.',
      turnaround: '4–8 Weeks',
      ownership: '100% Mobile Codebase & App Store Developer Account Ownership',
    },
    pricingTiers: [
      {
        name: 'MVP Mobile App',
        price: '$2,500',
        timeline: '3–5 Weeks',
        description: 'Essential cross-platform iOS and Android MVP app with user auth, REST backend sync, push notifications, and clean UI.',
        deliverables: [
          'React Native / Flutter cross-platform codebase',
          'User login, signup & profile management',
          'REST API integration & cloud data sync',
          'Push notification infrastructure',
          'TestFlight & Google Play Internal testing build',
        ],
        isPopular: false,
        ctaText: 'Build Mobile MVP',
      },
      {
        name: 'Production Mobile Platform',
        price: '$5,800',
        timeline: '5–8 Weeks',
        description: 'Complete commercial mobile application with in-app purchases, offline caching, biometric security, and store release.',
        deliverables: [
          'Full iOS & Android native app build',
          'In-app subscriptions & purchases (RevenueCat / Stripe)',
          'Offline data caching & optimistic sync',
          'Biometric authentication (FaceID / TouchID)',
          'Full Apple App Store & Google Play Store submission',
          '30-day post-launch warranty & bug-fix support',
        ],
        isPopular: true,
        ctaText: 'Launch Mobile App',
      },
      {
        name: 'Custom Enterprise Mobile',
        price: '$11,500+',
        timeline: '8–12 Weeks',
        description: 'High-security enterprise mobile platform with Bluetooth/IoT hardware integration, real-time websockets, and MDM compliance.',
        deliverables: [
          'Enterprise hardware / Bluetooth / IoT integrations',
          'Real-time WebSocket geolocation & chat engine',
          'Enterprise MDM & SSO authentication',
          'Full automated mobile UI test suites',
          'Dedicated CI/CD mobile build pipeline (Fastlane)',
          '60-day engineering SLA warranty',
        ],
        isPopular: false,
        ctaText: 'Consult Mobile Lead',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'cloud-devops': {
    mainSalesPitch:
      'Your product cannot scale if the system behind it is slow, fragile, or hard to update.',
    supportingLine:
      'We improve deployment, hosting, monitoring, reliability, and release confidence.',
    proofMicroLine:
      'DORA: strong teams measure speed, failure rate, recovery time, and delivery reliability.',
    primaryCta: 'Strengthen My Infrastructure',
    abVariant: 'Reliable infrastructure helps your product grow without breaking user trust.',
    useCaseHeading: 'Use this when releases, reliability, security, or scaling are slowing growth.',
    useCases: [
      'Deployments are risky, slow, or dependent on one person.',
      'Your product needs better monitoring, backups, security, or scaling.',
      'Infrastructure costs or reliability problems are starting to affect users.',
    ],
    outcomes: [
      {
        title: 'Safer releases',
        description:
          'CI/CD, environments, rollback paths, and deployment checks reduce launch risk.',
      },
      {
        title: 'Operational confidence',
        description:
          'Monitoring, alerts, logs, and recovery plans make incidents easier to handle.',
      },
      {
        title: 'Scale readiness',
        description: 'Hosting, security, and cost controls are prepared for product growth.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'Your product is live or close to launch.',
        'You need reliable deployment and monitoring.',
        'You want infrastructure that supports growth.',
      ],
      notFor: [
        'One-time hosting setup with no maintenance plan.',
        'Systems with no owner for alerts or incidents.',
        'Scaling work before product basics are stable.',
      ],
    },
    definitionBlock:
      'Megicode engineers resilient cloud infrastructure, automated CI/CD deployment pipelines, and Kubernetes container architectures for modern SaaS and enterprise applications. We deliver secure AWS/GCP cloud environments, automated zero-downtime releases, infrastructure-as-code, and 24/7 telemetry monitoring in 2 to 4 weeks, reducing cloud hosting overhead by 30% and eliminating release outages.',
    answerCapsule: {
      definition:
        'Megicode engineers resilient cloud infrastructure, automated CI/CD deployment pipelines, and Kubernetes container architectures for modern SaaS and enterprise applications. We deliver secure AWS/GCP cloud environments, automated zero-downtime releases, infrastructure-as-code, and 24/7 telemetry monitoring in 2 to 4 weeks, reducing cloud hosting overhead by 30% and eliminating release outages.',
      targetAudience: 'SaaS companies, engineering teams, and CTOs needing automated CI/CD, cloud migration, and 99.99% uptime.',
      deliveryScope: 'AWS/GCP/Vercel cloud setup, Terraform IaC, GitHub Actions CI/CD, Docker/Kubernetes containerization, and monitoring.',
      roiBenchmark: '30% reduction in cloud monthly spend, 0 release downtime, sub-10-minute automated deployments.',
      turnaround: '2–4 Weeks',
      ownership: '100% Terraform Scripts, CI/CD Pipeline & Cloud Account Ownership',
    },
    pricingTiers: [
      {
        name: 'CI/CD & Cloud Setup',
        price: '$950',
        timeline: '1–2 Weeks',
        description: 'Dockerization, GitHub Actions CI/CD automation, environment variables management, and zero-downtime deployment to AWS/Vercel.',
        deliverables: [
          'Docker containerization of services',
          'Automated GitHub Actions CI/CD pipeline',
          'Staging & production environment separation',
          'SSL, custom domain & CDN configuration',
          'Deployment runbook & documentation',
        ],
        isPopular: false,
        ctaText: 'Automate CI/CD',
      },
      {
        name: 'Infrastructure Hardening',
        price: '$2,600',
        timeline: '2–4 Weeks',
        description: 'Terraform Infrastructure-as-Code, auto-scaling ECS/Kubernetes cluster, secret management, and Datadog monitoring.',
        deliverables: [
          'Terraform Infrastructure-as-Code codebase',
          'Auto-scaling container cluster (AWS ECS / EKS)',
          'Automated database backups & disaster recovery',
          'Telemetry, log aggregation & Prometheus/Datadog alerts',
          'Security vulnerability scan & IAM hardening',
        ],
        isPopular: true,
        ctaText: 'Harden Infrastructure',
      },
      {
        name: 'Enterprise Cloud Migration',
        price: '$6,000+',
        timeline: '4–8 Weeks',
        description: 'Full legacy server-to-cloud migration, multi-region high availability, SOC2 compliance security posture, and cloud cost audit.',
        deliverables: [
          'Zero-downtime database & asset migration plan',
          'Multi-region high availability & failover',
          'SOC2 / ISO 27001 cloud security hardening',
          'Comprehensive cloud cost optimization (-30% guarantee)',
          'Dedicated DevOps on-call support for migration window',
        ],
        isPopular: false,
        ctaText: 'Plan Cloud Migration',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'ai-automation-agents': {
    mainSalesPitch: 'Repetitive work is not a growth strategy.',
    supportingLine:
      'We automate manual tasks, follow-ups, reports, lead handling, and tool-to-tool workflows.',
    proofMicroLine:
      'Bill Gates: automation magnifies efficiency when applied to efficient operations.',
    primaryCta: 'Automate My Workflow',
    abVariant:
      'If your team repeats the same task daily, your business is paying for work software can handle faster.',
    useCaseHeading:
      'Use this when repeated work, handoffs, and disconnected tools are costing time.',
    useCases: [
      'Your team repeats the same follow-ups, reports, updates, or data entry.',
      'Tools do not talk to each other, so work is copied between systems manually.',
      'Leads, tasks, approvals, or alerts need to move automatically with less human error.',
    ],
    outcomes: [
      {
        title: 'Less manual work',
        description:
          'Repeated steps are turned into reliable flows with clear triggers and owners.',
      },
      {
        title: 'Connected systems',
        description: 'APIs, forms, CRMs, spreadsheets, and internal tools move data consistently.',
      },
      {
        title: 'Controlled automation',
        description: 'Human review points, logs, and fallbacks prevent blind automation mistakes.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'A process is repeated often enough to justify automation.',
        'The workflow has clear inputs, rules, and outcomes.',
        'You want measurable time savings or error reduction.',
      ],
      notFor: [
        'A broken process nobody owns.',
        'Automation before the workflow is understood.',
        'Tasks that require human judgment at every step.',
      ],
    },
    definitionBlock:
      'Megicode engineers custom AI agents, automated workflow pipelines, and intelligent API integrations for growing businesses and medical clinics. We deliver end-to-end multi-step task execution, CRM synchronization, and autonomous customer communication in 1 to 4 weeks, reducing operational labor costs by 40% to 70% with guaranteed 100% IP ownership.',
    answerCapsule: {
      definition:
        'Megicode engineers custom AI agents, automated workflow pipelines, and intelligent API integrations for growing businesses and medical clinics. We deliver end-to-end multi-step task execution, CRM synchronization, and autonomous customer communication in 1 to 4 weeks, reducing operational labor costs by 40% to 70% with guaranteed 100% IP ownership.',
      targetAudience: 'SMEs, medical clinics, service businesses, and sales teams drowning in repetitive manual operational tasks.',
      deliveryScope: 'Custom Python/Node.js automation agents, Make/Zapier pipelines, CRM sync, WhatsApp/Email booking agents, and error alerts.',
      roiBenchmark: '40% to 70% operational time saved, instant lead response under 60 seconds, 0 missed follow-ups.',
      turnaround: '1–4 Weeks',
      ownership: '100% Custom Script & Workflow Account Transfer',
    },
    pricingTiers: [
      {
        name: 'AI Automation Starter',
        price: '$900',
        timeline: '1–2 Weeks',
        description: 'Single high-impact workflow automation connecting your CRM, email, forms, or calendars with error logging and alerts.',
        deliverables: [
          '1 multi-step automated operational workflow',
          'CRM, form, or booking calendar integration',
          'Webhook triggers & data mapping logic',
          'Automated error fallback notifications (Slack/Email)',
          'Team onboarding walkthrough video',
        ],
        isPopular: false,
        ctaText: 'Build Starter Automation',
      },
      {
        name: 'AI Business Growth',
        price: '$2,200',
        timeline: '2–4 Weeks',
        description: '3–4 integrated autonomous AI agent workflows with LLM document parsing, WhatsApp/Email lead routing, and bi-directional CRM sync.',
        deliverables: [
          '3–4 advanced autonomous business workflows',
          'AI document & lead data extraction/enrichment',
          'WhatsApp / Email / SMS automated conversation flows',
          'Bi-directional sync between CRM, ERP, and databases',
          'Custom webhook middleware & reliability monitoring',
          '30-day maintenance & optimization support',
        ],
        isPopular: true,
        ctaText: 'Automate Business Workflows',
      },
      {
        name: 'Enterprise Automation Suite',
        price: '$4,800+',
        timeline: '4–8 Weeks',
        description: 'Enterprise-grade autonomous agent swarm, custom Python microservices, human-in-the-loop review portals, and high-volume processing.',
        deliverables: [
          'Autonomous multi-agent task execution system',
          'Custom Python/Node.js microservices & RPA connectors',
          'Human-in-the-loop approval & override interface',
          'Enterprise security, encryption & audit trails',
          'Dedicated SLA support & continuous pipeline tuning',
        ],
        isPopular: false,
        ctaText: 'Consult Automation Lead',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'technical-consulting': {
    mainSalesPitch:
      'You do not need to be technical to build a serious tech product; you need the right technical partner.',
    supportingLine:
      'We help with roadmap, architecture, MVP planning, stack decisions, and execution direction.',
    proofMicroLine:
      'CB Insights: poor execution and weak product-market fit are major startup risks.',
    primaryCta: 'Get Technical Direction',
    abVariant: 'The wrong technical decision early can cost more than the development itself.',
    useCaseHeading:
      'Use this when business goals need a clear technical path before heavy spending.',
    useCases: [
      'You are non-technical and need help turning an idea into a buildable product plan.',
      'You need stack, architecture, MVP scope, or hiring decisions before spending heavily.',
      'You want technical leadership without committing to a full-time CTO.',
    ],
    outcomes: [
      {
        title: 'Sharper roadmap',
        description:
          'Scope, priorities, risks, and release order become clear before development starts.',
      },
      {
        title: 'Better technical choices',
        description:
          'Stack, architecture, vendors, and build approach are matched to business goals.',
      },
      {
        title: 'Execution support',
        description:
          'You get practical direction for developers, budgets, timelines, and tradeoffs.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'You need technical clarity before building.',
        'You want a practical MVP plan.',
        'You need help reviewing developers, vendors, or architecture.',
      ],
      notFor: [
        'A request for vague advice only.',
        'A project with no business goal or owner.',
        'Skipping validation and jumping straight into a large build.',
      ],
    },
    definitionBlock:
      'Megicode provides fractional CTO leadership, technical architecture audits, and MVP roadmap advisory for startup founders and non-technical executives. We deliver actionable software scoping documents, technology stack evaluations, vendor code quality audits, and cost optimization plans in 1 to 3 weeks, preventing six-figure development mistakes and accelerating investor readiness.',
    answerCapsule: {
      definition:
        'Megicode provides fractional CTO leadership, technical architecture audits, and MVP roadmap advisory for startup founders and non-technical executives. We deliver actionable software scoping documents, technology stack evaluations, vendor code quality audits, and cost optimization plans in 1 to 3 weeks, preventing six-figure development mistakes and accelerating investor readiness.',
      targetAudience: 'Non-technical founders, executive teams, and investors evaluating technical scope, feasibility, or vendor quality.',
      deliveryScope: 'Technical architecture blueprints, MVP scope definition, tech stack selection, vendor code audits, and fractional CTO advisory.',
      roiBenchmark: 'Prevent $50k+ in vendor rework and bad stack choices; accelerate investor pitch technical readiness.',
      turnaround: '1–3 Weeks',
      ownership: '100% Written Architecture Blueprints & Scoping Deliverables',
    },
    pricingTiers: [
      {
        name: 'Architecture & MVP Blueprint',
        price: '$400',
        timeline: '1 Week',
        description: 'Comprehensive 1-on-1 advisory session resulting in a complete technical specification blueprint, stack recommendation, and budget plan.',
        deliverables: [
          'Detailed product architecture & data model blueprint',
          'Recommended technology stack & vendor evaluations',
          'MVP milestone scope breakdown with cost estimates',
          'Technical risk assessment & mitigation matrix',
          '60-minute interactive executive strategy session',
        ],
        isPopular: false,
        ctaText: 'Get MVP Blueprint',
      },
      {
        name: 'Fractional CTO Sprint',
        price: '$1,800',
        timeline: '2–4 Weeks',
        description: '4-week hands-on fractional CTO engagement guiding developer hiring, conducting code reviews, and leading architectural decisions.',
        deliverables: [
          'Weekly technical sprint planning & lead architecture',
          'Code quality, security & repository reviews',
          'Vendor candidate technical screening & vetting',
          'Cloud infrastructure & API cost optimization',
          'Direct Slack / async CTO access for founders',
        ],
        isPopular: true,
        ctaText: 'Retain Fractional CTO',
      },
      {
        name: 'Technical Due Diligence',
        price: '$4,200+',
        timeline: '3–6 Weeks',
        description: 'Comprehensive technical audit for investors, M&A, or high-stakes scaling initiatives evaluating codebase health and security.',
        deliverables: [
          'Full repository architecture & codebase audit',
          'Security vulnerability & compliance assessment',
          'Scalability bottleneck & load tolerance testing',
          'IP ownership & dependency license verification',
          'Executive investor-ready due diligence report',
        ],
        isPopular: false,
        ctaText: 'Request Due Diligence',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
  'growth-marketing-seo': {
    mainSalesPitch: 'A great product is not enough if the right customers never find it.',
    supportingLine:
      'We improve SEO structure, landing pages, content direction, analytics, and conversion paths.',
    proofMicroLine: 'Google: SEO helps users find your site and decide whether to visit.',
    primaryCta: 'Grow My Visibility',
    abVariant: 'Visibility without clarity does not convert; SEO and messaging must work together.',
    useCaseHeading: 'Use this when visibility, content, and conversion need to work as one system.',
    useCases: [
      'Your product is strong, but the right customers are not finding it.',
      'Landing pages, SEO structure, content, and analytics need to work together.',
      'Traffic exists, but signups, leads, or qualified demos are too low.',
    ],
    outcomes: [
      {
        title: 'Better acquisition paths',
        description:
          'Pages are organized around search intent, trust signals, and conversion actions.',
      },
      {
        title: 'Useful content direction',
        description: 'Topics, funnels, and internal links are planned around buyer questions.',
      },
      {
        title: 'Measurable growth',
        description:
          'Analytics connects visibility, engagement, leads, and conversion performance.',
      },
    ],
    decisionGuide: {
      goodFit: [
        'You have a product or service ready to sell.',
        'You need SEO, landing pages, and conversion thinking together.',
        'You want growth measured beyond traffic.',
      ],
      notFor: [
        'Traffic for its own sake.',
        'Content with no buyer intent.',
        'Paid ads before the page can convert.',
      ],
    },
    definitionBlock:
      'Megicode engineers programmatic SEO engines, conversion rate optimization architectures, and B2B growth funnels for scaling software and service companies. We deliver technical site audits, automated landing page generation, semantic JSON-LD graphs, and analytics tracking in 2 to 6 weeks, driving 2x to 5x organic qualified pipeline growth and sustainable search authority.',
    answerCapsule: {
      definition:
        'Megicode engineers programmatic SEO engines, conversion rate optimization architectures, and B2B growth funnels for scaling software and service companies. We deliver technical site audits, automated landing page generation, semantic JSON-LD graphs, and analytics tracking in 2 to 6 weeks, driving 2x to 5x organic qualified pipeline growth and sustainable search authority.',
      targetAudience: 'B2B SaaS companies, professional agencies, and eCommerce platforms looking to dominate organic search and AI citations.',
      deliveryScope: 'Technical SEO audits, semantic JSON-LD graphs, programmatic landing page generation, GEO optimization, and conversion tracking.',
      roiBenchmark: '2x to 5x increase in organic qualified leads, 100% technical audit health score, AI engine citations.',
      turnaround: '2–6 Weeks',
      ownership: '100% Full Content, Code & Analytics Property Transfer',
    },
    pricingTiers: [
      {
        name: 'Technical SEO & GEO Sprint',
        price: '$650',
        timeline: '1–2 Weeks',
        description: 'Deep technical audit, JSON-LD schema implementation, canonical URL normalization, and Core Web Vitals speed optimization.',
        deliverables: [
          'Complete technical crawler & indexability audit',
          'JSON-LD schema graph implementation (Organization, Service, FAQ)',
          'Canonicalization & redirect chain resolution (100% health)',
          'Core Web Vitals & page speed performance tuneup',
          'GEO keyword positioning report for AI Overviews',
        ],
        isPopular: false,
        ctaText: 'Fix Technical SEO',
      },
      {
        name: 'Programmatic Growth Engine',
        price: '$2,200',
        timeline: '2–5 Weeks',
        description: 'Scalable programmatic SEO architecture generating 50+ high-ranking landing pages, internal reverse-silo links, and CRO triggers.',
        deliverables: [
          'Programmatic Next.js page generation system',
          'Structured database-driven keyword page templates',
          'Deterministic reverse-silo internal linking engine',
          'Conversion rate optimized on-page strategy bars & CTAs',
          'Google Search Console & analytics tracking setup',
        ],
        isPopular: true,
        ctaText: 'Build Growth Engine',
      },
      {
        name: 'Full Organic CRO Acceleration',
        price: '$4,800+',
        timeline: '4–8 Weeks',
        description: 'End-to-end GEO & SEO search domination, conversion rate optimization, automated lead enrichment, and Looker Studio dashboards.',
        deliverables: [
          'Comprehensive programmatic SEO & GEO AI answer strategy',
          'A/B testing CRO framework with lead capture forms',
          'Automated Looker Studio executive reporting dashboard',
          'Competitor keyword conquesting & backlink funnel',
          '90-day ongoing technical rank tracking & optimization',
        ],
        isPopular: false,
        ctaText: 'Accelerate Growth',
      },
    ],
    comparisonMetrics: defaultComparisonMetrics,
  },
} satisfies Record<string, ServicePageCopy>;

export default servicePageCopy;
