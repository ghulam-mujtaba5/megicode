export type PricingPackage = {
  name: string;
  bestFor: string;
  price: string;
  timeline: string;
  includes: string[];
  note?: string;
  cta: string;
  href: string;
  featured?: boolean;
};

export type PricingCategory = {
  id: string;
  label: string;
  summary: string;
  packages: PricingPackage[];
};

export const pricingEntrypoints = [
  {
    title: 'MVP Roadmap',
    price: 'From $400',
    bestFor: 'Founders who need scope, architecture, timeline, and budget clarity before build.',
    bullets: ['Feature scope', 'Tech architecture', 'Build plan'],
    cta: 'Start With Roadmap',
    href: '/contact?service=mvp-roadmap',
  },
  {
    title: 'AI Automation',
    price: 'From $900',
    bestFor: 'Teams losing leads, replies, bookings, follow-ups, or reporting to manual work.',
    bullets: ['Workflow mapping', 'Tool integrations', 'Launch handoff'],
    cta: 'Automate Workflow',
    href: '/services/ai-automation-agents',
  },
  {
    title: 'Clinic AI Receptionist',
    price: 'From $1,250 setup',
    bestFor: 'Clinics that need faster inquiry capture, booking, reminders, and staff handoff.',
    bullets: ['Patient intake logic', 'Booking flow', 'Support plans'],
    cta: 'Automate Clinic Bookings',
    href: '/contact?service=clinic-ai-receptionist',
  },
  {
    title: 'AI SaaS MVP',
    price: 'From $4,500',
    bestFor: 'Founders ready to build a focused AI product with auth, dashboard, and launch setup.',
    bullets: ['UX and build', 'AI features', 'Deployment'],
    cta: 'Plan My MVP',
    href: '/services/ai-saas-mvp-development',
  },
  {
    title: 'Custom Platform',
    price: 'From $3,500',
    bestFor: 'Businesses replacing spreadsheets, disconnected tools, and manual operations.',
    bullets: ['Admin portals', 'CRM or booking', 'Dashboards'],
    cta: 'Build My Platform',
    href: '/services/custom-web-development',
  },
];

export const pricingCategories: PricingCategory[] = [
  {
    id: 'roadmap',
    label: 'Roadmap',
    summary:
      'A fixed-scope planning sprint when the idea is real but the build scope is still risky.',
    packages: [
      {
        name: 'MVP Roadmap Basic',
        bestFor: 'Early founders who need the smallest useful build plan.',
        price: '$400',
        timeline: '5-7 business days',
        includes: ['Core feature scope', 'Recommended stack', 'Timeline and budget logic'],
        note: '100% upfront.',
        cta: 'Start With Roadmap',
        href: '/contact?service=mvp-roadmap-basic',
      },
      {
        name: 'MVP Roadmap Advanced',
        bestFor: 'Founders who need deeper architecture, launch plan, and risk review.',
        price: '$800',
        timeline: '7-10 business days',
        includes: [
          'Product architecture',
          'User flow and milestones',
          'Build estimate and launch plan',
        ],
        note: '100% upfront.',
        cta: 'Plan My MVP',
        href: '/contact?service=mvp-roadmap-advanced',
        featured: true,
      },
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    summary:
      'Practical AI workflows for lead capture, CRM updates, replies, booking, and reporting.',
    packages: [
      {
        name: 'AI Automation Starter',
        bestFor: 'One painful workflow that needs to stop wasting time.',
        price: '$900',
        timeline: '1-2 weeks',
        includes: ['1 automated workflow', 'Core integration', 'Testing and handoff'],
        note: 'Tool and API costs billed separately.',
        cta: 'Automate Workflow',
        href: '/contact?service=automation-starter',
      },
      {
        name: 'AI Automation Growth',
        bestFor: 'Teams losing leads, time, and follow-ups across manual tools.',
        price: '$1,800',
        timeline: '2-4 weeks',
        includes: [
          '2-3 automated workflows',
          'CRM, form, email, or WhatsApp logic',
          '14-day launch support',
        ],
        note: 'Tool and API costs billed separately.',
        cta: 'See What We Can Automate',
        href: '/contact?service=automation-growth',
        featured: true,
      },
      {
        name: 'AI Automation Advanced',
        bestFor: 'Operations with several handoffs, conditions, and reporting needs.',
        price: '$3,200',
        timeline: '3-5 weeks',
        includes: ['4-6 workflows', 'Advanced branching', 'Reporting and team handoff'],
        note: 'Tool and API costs billed separately.',
        cta: 'Scope Advanced Automation',
        href: '/contact?service=automation-advanced',
      },
    ],
  },
  {
    id: 'clinic',
    label: 'Clinic',
    summary:
      'Setup plus monthly care for clinic inquiry capture, intake, reminders, and booking handoff.',
    packages: [
      {
        name: 'Clinic Starter',
        bestFor: 'Clinics starting with one inquiry or booking flow.',
        price: '$1,250 setup + $150/mo',
        timeline: '2-3 weeks',
        includes: ['Intake script', 'Booking handoff', 'Basic support'],
        note: 'Telephony, WhatsApp, and AI usage billed separately.',
        cta: 'Automate Clinic Bookings',
        href: '/contact?service=clinic-starter',
      },
      {
        name: 'Clinic Growth',
        bestFor:
          'Clinics handling inquiries across WhatsApp, forms, missed calls, and staff handoffs.',
        price: '$2,250 setup + $350/mo',
        timeline: '2-4 weeks',
        includes: ['Booking flow', 'Reminders and routing', 'Reporting basics'],
        note: 'Telephony, WhatsApp, and AI usage billed separately.',
        cta: 'Choose Clinic Growth',
        href: '/contact?service=clinic-growth',
        featured: true,
      },
      {
        name: 'Clinic Premium',
        bestFor: 'Clinics that need deeper logic, reporting, and managed improvement.',
        price: '$3,750 setup + $650/mo',
        timeline: '3-5 weeks',
        includes: ['Advanced intake logic', 'Multi-channel handoff', 'Managed support'],
        note: 'Telephony, WhatsApp, and AI usage billed separately.',
        cta: 'Scope Clinic Premium',
        href: '/contact?service=clinic-premium',
      },
    ],
  },
  {
    id: 'mvp',
    label: 'SaaS MVP',
    summary:
      'AI SaaS MVP builds with public starting prices and flexible scope for larger products.',
    packages: [
      {
        name: 'Lean MVP',
        bestFor: 'A focused first version with the smallest useful feature set.',
        price: 'From $4,500',
        timeline: '4-8 weeks',
        includes: ['Core product flow', 'Auth and dashboard', 'Deployment'],
        note: 'Third-party services billed separately.',
        cta: 'Plan My MVP',
        href: '/contact?service=lean-ai-saas-mvp',
      },
      {
        name: 'Core MVP',
        bestFor: 'Founders who need a stronger product with payments, admin, and AI features.',
        price: '$6,500-$12,000',
        timeline: '6-10 weeks',
        includes: ['UX and development', 'AI feature integration', 'Admin and launch support'],
        note: 'Third-party services billed separately.',
        cta: 'Start Core MVP',
        href: '/contact?service=core-ai-saas-mvp',
        featured: true,
      },
      {
        name: 'Advanced MVP',
        bestFor: 'Products with complex roles, integrations, AI logic, or multi-tenant needs.',
        price: '$12,000-$22,000+',
        timeline: '8-14+ weeks',
        includes: ['Advanced architecture', 'Complex integrations', 'Scale-ready launch plan'],
        note: 'Third-party services billed separately.',
        cta: 'Scope Advanced MVP',
        href: '/contact?service=advanced-ai-saas-mvp',
      },
    ],
  },
  {
    id: 'platforms',
    label: 'Platforms',
    summary: 'Custom portals, CRMs, booking systems, dashboards, and internal operating platforms.',
    packages: [
      {
        name: 'Starter Platform',
        bestFor: 'One focused internal or customer-facing platform workflow.',
        price: 'From $3,500',
        timeline: '4-8 weeks',
        includes: ['Core portal', 'Admin basics', 'Launch setup'],
        note: 'Hosting and paid tools billed separately.',
        cta: 'Build My Platform',
        href: '/contact?service=starter-business-platform',
      },
      {
        name: 'Growth Platform',
        bestFor: 'Teams replacing scattered tools with a stronger operating system.',
        price: '$5,500-$11,000',
        timeline: '6-10 weeks',
        includes: ['User roles', 'Integrations', 'Dashboards and workflows'],
        note: 'Hosting and paid tools billed separately.',
        cta: 'Start Growth Platform',
        href: '/contact?service=growth-business-platform',
        featured: true,
      },
      {
        name: 'Advanced Platform',
        bestFor: 'Multi-role, integration-heavy platforms with reporting and scale needs.',
        price: '$11,000-$20,000+',
        timeline: '8-14+ weeks',
        includes: ['Advanced workflows', 'API integrations', 'Reporting and scale support'],
        note: 'Hosting and paid tools billed separately.',
        cta: 'Scope Advanced Platform',
        href: '/contact?service=advanced-business-platform',
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    summary:
      'Monthly care for products that need steady improvements, monitoring, and growth support.',
    packages: [
      {
        name: 'Launch Care',
        bestFor: 'Post-launch fixes, monitoring, and small improvements.',
        price: '$200/mo',
        timeline: 'Ongoing',
        includes: ['Bug fixes', 'Minor updates', 'Monthly check-in'],
        note: 'Billed monthly in advance.',
        cta: 'Plan Launch Care',
        href: '/contact?service=launch-care',
      },
      {
        name: 'Growth Support',
        bestFor: 'Products that need ongoing features, automation, and conversion improvements.',
        price: '$450/mo',
        timeline: 'Ongoing',
        includes: ['Priority improvements', 'Automation support', 'Performance review'],
        note: 'Billed monthly in advance.',
        cta: 'Choose Growth Support',
        href: '/contact?service=growth-support',
        featured: true,
      },
      {
        name: 'Product Partner',
        bestFor: 'Teams that need a steady technical partner after launch.',
        price: '$900+/mo',
        timeline: 'Ongoing',
        includes: ['Product planning', 'Feature delivery', 'Technical guidance'],
        note: 'Billed monthly in advance.',
        cta: 'Discuss Product Partner',
        href: '/contact?service=product-partner',
      },
    ],
  },
];

export const pricingFaqs = [
  {
    question: 'Do you charge hourly or fixed price?',
    answer:
      'We use fixed prices for clear packages and milestone pricing for larger builds. Hourly estimates stay internal so buyers can focus on scope, outcomes, and delivery risk.',
  },
  {
    question: 'Are hosting, WhatsApp, telephony, and AI usage included?',
    answer:
      'No. Third-party tools, hosting, telephony, WhatsApp, model/API usage, and paid software licenses are billed separately at provider rates.',
  },
  {
    question: 'What if I am not ready to build yet?',
    answer:
      'Start with an MVP Roadmap. It gives you feature scope, architecture, timeline, and budget logic before you commit to a larger build.',
  },
  {
    question: 'Can we launch a smaller version first?',
    answer:
      'Yes. We prefer the smallest useful version when scope is uncertain, then expand after real users and business signals are clearer.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Yes. Megicode is Lahore-based and works remote-first with founders, clinics, and growing businesses in multiple countries.',
  },
  {
    question: 'How do payments work?',
    answer:
      'Small roadmap packages are paid upfront. Automation and clinic setups usually use upfront plus handoff payments. Larger builds use milestone payments.',
  },
];
