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
};

const servicePageCopy = {
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
  },
} satisfies Record<string, ServicePageCopy>;

export default servicePageCopy;
