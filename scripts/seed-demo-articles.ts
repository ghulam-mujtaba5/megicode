/// <reference types="node" />

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');
const sharp = require('sharp');
const { Binary, MongoClient } = require('mongodb');

export {};

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env.vercel.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URI;
const dbName = process.env.MONGODB_DB || process.env.MONGO_DB || 'megicode';

const now = new Date().toISOString();

const demoCovers = [
  {
    filename: 'blog-demo-ai-automation.webp',
    title: 'AI Automation',
    subtitle: 'Workflow intelligence for growing teams',
    colors: ['#0f172a', '#2563eb', '#38bdf8'],
  },
  {
    filename: 'blog-demo-saas-architecture.webp',
    title: 'SaaS Architecture',
    subtitle: 'Reliable systems built to scale',
    colors: ['#111827', '#4f46e5', '#22c55e'],
  },
  {
    filename: 'blog-demo-custom-software.webp',
    title: 'Custom Software',
    subtitle: 'Business workflows without workarounds',
    colors: ['#172554', '#0ea5e9', '#f8fafc'],
  },
  {
    filename: 'blog-demo-web-security.webp',
    title: 'Web Security',
    subtitle: 'Modern protection for digital products',
    colors: ['#020617', '#dc2626', '#f97316'],
  },
  {
    filename: 'blog-demo-data-analytics.webp',
    title: 'Data Analytics',
    subtitle: 'Dashboards that drive decisions',
    colors: ['#0f172a', '#7c3aed', '#06b6d4'],
  },
  {
    filename: 'blog-demo-react-nextjs.webp',
    title: 'React & Next.js',
    subtitle: 'Choosing the right frontend foundation',
    colors: ['#082f49', '#0284c7', '#67e8f9'],
  },
  {
    filename: 'blog-demo-devops.webp',
    title: 'DevOps',
    subtitle: 'Simple delivery systems for small teams',
    colors: ['#111827', '#16a34a', '#facc15'],
  },
];

function coverUrl(filename: string) {
  return `/api/uploads/${filename}`;
}

function xmlText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function coverSvg(cover: (typeof demoCovers)[number]) {
  const [dark, primary, accent] = cover.colors;
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${dark}"/>
          <stop offset="56%" stop-color="${primary}"/>
          <stop offset="100%" stop-color="${accent}"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#020617" flood-opacity="0.32"/>
        </filter>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="1000" cy="95" r="210" fill="#ffffff" opacity="0.12"/>
      <circle cx="108" cy="548" r="165" fill="#ffffff" opacity="0.1"/>
      <path d="M760 150h230c72 0 130 58 130 130v130c0 72-58 130-130 130H760c-72 0-130-58-130-130V280c0-72 58-130 130-130Z" fill="#ffffff" opacity="0.14"/>
      <g filter="url(#shadow)">
        <rect x="84" y="118" width="620" height="394" rx="34" fill="#ffffff" opacity="0.95"/>
        <text x="134" y="246" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800">${xmlText(cover.title)}</text>
        <text x="136" y="322" fill="#334155" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="500">${xmlText(cover.subtitle)}</text>
        <rect x="136" y="386" width="178" height="14" rx="7" fill="${primary}"/>
        <rect x="330" y="386" width="92" height="14" rx="7" fill="${accent}"/>
        <text x="136" y="452" fill="#475569" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">MEGICODE INSIGHTS</text>
      </g>
    </svg>
  `;
}

const articles = [
  {
    title: 'How AI Automation Helps Growing Businesses Work Faster',
    slug: 'how-ai-automation-helps-growing-businesses',
    excerpt: 'A practical guide to using AI automation, integrations, and custom dashboards to reduce manual work and improve customer response times.',
    contentHtml: `<p>Growing businesses often lose time to repeated manual work: copying lead details, following up late, updating spreadsheets, checking project status, and preparing routine reports. AI automation helps by connecting those workflows into one reliable system.</p><h2>Start With Repetitive Work</h2><p>The best automation opportunities are usually easy to spot. Look for tasks your team repeats every week, tasks that depend on the same data, and tasks where delays create missed sales or slower delivery.</p><h2>Connect Your Existing Tools</h2><p>A strong automation setup does not always require replacing your current software. It can connect forms, CRM records, email, dashboards, and internal tools so information moves without manual copying.</p><h2>Use AI Where It Adds Judgment</h2><p>AI is useful when the workflow needs classification, summarization, prioritization, or personalized messaging. For example, AI can score new leads, draft first replies, summarize support requests, or flag project risks before they become expensive.</p><h2>Measure The Impact</h2><p>Track time saved, response speed, conversion rate, and error reduction. These metrics show whether the automation is creating real business value instead of just adding another tool.</p><p>Megicode builds custom web platforms, AI workflows, and business dashboards that help teams move faster while keeping control of their data and operations.</p>`.replace(/\n\s+/g, ' ').trim(),
    coverImage: coverUrl('blog-demo-ai-automation.webp'),
    coverImageAlt: 'AI robot working on automation tasks',
    coverImageFit: 'cover',
    authorName: 'Megicode Team',
    tags: ['AI automation', 'business systems', 'workflow automation', 'custom software'],
    categories: ['AI & Automation'],
    status: 'published',
    seoTitle: 'How AI Automation Helps Growing Businesses Work Faster | Megicode',
    seoDescription: 'Learn how growing businesses can use AI automation, integrations, and dashboards to reduce manual work and respond faster.',
  },
  {
    title: 'Building Scalable SaaS Platforms: Architecture Best Practices',
    slug: 'building-scalable-saas-platforms-architecture',
    excerpt: 'Key architectural decisions that make SaaS platforms maintainable, performant, and ready to scale from 10 to 10,000 users.',
    contentHtml: `<p>Building a SaaS product that works for 10 users is easy. Building one that works for 10,000 requires deliberate architecture from day one. Here are the patterns we use at Megicode to build platforms that scale.</p><h2>Choose the Right Database Strategy</h2><p>Start with a single database but design your schema with clear boundaries. Use database-per-tenant isolation only when you have strong compliance requirements. For most SaaS products, row-level isolation with proper indexing is sufficient and far simpler to maintain.</p><h2>Separate Read and Write Paths</h2><p>As your application grows, read operations will vastly outnumber writes. Implement read replicas early and route queries accordingly. This single change can handle 80% of scaling issues before they appear.</p><h2>Cache Strategically</h2><p>Not everything needs caching. Focus on expensive queries that run frequently and don't change often. User session data, dashboard summaries, and configuration lookups are prime candidates. Avoid caching user-specific real-time data.</p><h2>Design for Failure</h2><p>Every external service call should have a timeout, retry logic, and a graceful fallback. If your payment processor is down, users should still be able to access their existing data. Circuit breakers prevent cascading failures.</p><h2>Monitor Everything</h2><p>You cannot fix what you cannot see. Instrument your application from day one with structured logging, distributed tracing, and alerting on key business metrics like signup rate, feature usage, and error rates.</p>`,
    coverImage: coverUrl('blog-demo-saas-architecture.webp'),
    coverImageAlt: 'Server room with scalable infrastructure',
    coverImageFit: 'cover',
    authorName: 'Ghulam Mujtaba',
    tags: ['SaaS', 'architecture', 'scalability', 'software engineering'],
    categories: ['Engineering'],
    status: 'published',
    seoTitle: 'Building Scalable SaaS Platforms: Architecture Best Practices | Megicode',
    seoDescription: 'Key architectural decisions that make SaaS platforms maintainable, performant, and ready to scale.',
  },
  {
    title: 'Why Custom Software Beats Off-the-Shelf Solutions for Growing Companies',
    slug: 'custom-software-vs-off-the-shelf',
    excerpt: 'When generic tools start costing you more in workarounds than a custom solution would, it is time to build your own.',
    contentHtml: `<p>Off-the-shelf software is a great starting point. But as your company grows, you will hit walls where generic tools force your team into workarounds, manual processes, and integrations that break. Here is when to consider custom software.</p><h2>When Workarounds Cost More Than Building</h2><p>If your team spends hours each week moving data between tools, rewriting reports, or duplicating information, the hidden cost of the off-the-shelf solution has already exceeded what a custom build would cost. Track the time first, then decide.</p><h2>When Your Process Is Your Competitive Advantage</h2><p>If your workflow gives you an edge, you should not be running it on the same tool your competitors use. Custom software lets you codify your unique process into a system that scales without leaking your advantage.</p><h2>When Compliance Demands Control</h2><p>Industries like healthcare, finance, and legal require strict data handling. When your compliance requirements outgrow what a SaaS tool can offer, a custom solution gives you full control over data storage, access, and audit trails.</p><h2>The Hybrid Approach</h2><p>You do not have to replace everything at once. Start with the highest-impact workflow, build a custom solution for that, and expand gradually. Most successful custom software projects begin as focused tools that solve one painful problem extremely well.</p><p>Megicode helps companies identify the right workflows to automate and builds custom platforms that integrate with existing tools rather than replacing them overnight.</p>`,
    coverImage: coverUrl('blog-demo-custom-software.webp'),
    coverImageAlt: 'Team collaborating on custom software development',
    coverImageFit: 'cover',
    authorName: 'Megicode Team',
    tags: ['custom software', 'business strategy', 'digital transformation', 'SaaS'],
    categories: ['Strategy'],
    status: 'published',
    seoTitle: 'Custom Software vs Off-the-Shelf: When to Build Your Own | Megicode',
    seoDescription: 'When generic tools start costing you more in workarounds than a custom solution would.',
  },
  {
    title: 'The Complete Guide to Web Application Security in 2025',
    slug: 'web-application-security-guide-2025',
    excerpt: 'From OWASP Top 10 to zero-trust architecture, everything you need to know about securing modern web applications.',
    contentHtml: `<p>Web application security is not optional. With increasing regulatory requirements, sophisticated attacks, and customer expectations around data protection, every web application needs a security-first approach. Here is our comprehensive guide.</p><h2>Start With the OWASP Top 10</h2><p>The OWASP Top 10 remains the baseline for web application security. Injection attacks, broken authentication, cross-site scripting, and insecure deserialization are still the most common vulnerabilities. Address these first before moving to advanced threats.</p><h2>Implement Zero-Trust Authentication</h2><p>Trust nothing by default. Every request should be authenticated and authorized, even internal ones. Use short-lived tokens, refresh token rotation, and session invalidation. For sensitive operations, require step-up authentication like MFA.</p><h2>Secure Your API Layer</h2><p>APIs are the backbone of modern web apps but also the biggest attack surface. Rate limiting, input validation, output encoding, and proper CORS configuration are non-negotiable. Use API keys for service-to-service communication and OAuth for user-facing APIs.</p><h2>Encrypt Everything</h2><p>Data should be encrypted in transit (TLS 1.3 minimum) and at rest (AES-256). Never store sensitive data in logs. Use envelope encryption for API keys and secrets. Rotate encryption keys on a regular schedule.</p><h2>Automate Security Testing</h2><p>Integrate SAST, DAST, and dependency scanning into your CI/CD pipeline. Run automated security scans on every pull request. Use tools like Snyk, OWASP ZAP, and Semgrep to catch vulnerabilities before they reach production.</p>`,
    coverImage: coverUrl('blog-demo-web-security.webp'),
    coverImageAlt: 'Cybersecurity shield protecting web applications',
    coverImageFit: 'cover',
    authorName: 'Megicode Team',
    tags: ['web security', 'OWASP', 'zero trust', 'cybersecurity'],
    categories: ['Engineering'],
    status: 'published',
    seoTitle: 'Web Application Security Guide 2025 | Megicode',
    seoDescription: 'From OWASP Top 10 to zero-trust architecture, everything about securing modern web applications.',
  },
  {
    title: 'How to Use Data Analytics to Drive Business Decisions',
    slug: 'data-analytics-business-decisions',
    excerpt: 'Turn raw data into actionable insights with the right metrics, dashboards, and decision-making frameworks.',
    contentHtml: `<p>Data without context is just noise. The companies that win are not the ones with the most data, but the ones that know which data to act on. Here is how to build a data-driven decision-making culture.</p><h2>Define Metrics That Matter</h2><p>Start with your business model. If you are a SaaS company, focus on MRR, churn rate, CAC, and LTV. If you are in e-commerce, track conversion rate, average order value, and customer acquisition cost. Vanity metrics like page views rarely drive decisions.</p><h2>Build Dashboards for Action, Not Display</h2><p>A good dashboard answers a question and suggests a next step. If a metric is green, nothing needs to happen. If it turns yellow or red, the dashboard should indicate what changed and who should investigate. Design dashboards around decision workflows, not data tables.</p><h2>Use Cohort Analysis</h2><p>Aggregate numbers hide important patterns. Break your data into cohorts by signup date, user type, geography, or feature usage. Cohort analysis reveals whether your product is actually improving for specific user segments, even when overall metrics look flat.</p><h2>Automate Reporting</h2><p>Manual reports get delayed, contain errors, and waste analyst time. Automate your key reports with scheduled data pipelines. Send weekly summaries to stakeholders automatically so they can focus on analysis instead of data collection.</p><h2>Create Feedback Loops</h2><p>The best data teams work closely with product and business teams. Hold regular data review sessions where insights are presented and decisions are made. The goal is to reduce the time between data collection and business action.</p>`,
    coverImage: coverUrl('blog-demo-data-analytics.webp'),
    coverImageAlt: 'Analytics dashboard showing business metrics',
    coverImageFit: 'cover',
    authorName: 'Megicode Team',
    tags: ['data analytics', 'business intelligence', 'dashboards', 'decision making'],
    categories: ['Strategy'],
    status: 'published',
    seoTitle: 'How to Use Data Analytics to Drive Business Decisions | Megicode',
    seoDescription: 'Turn raw data into actionable insights with the right metrics, dashboards, and decision-making frameworks.',
  },
  {
    title: 'React vs Next.js: Choosing the Right Framework for Your Project',
    slug: 'react-vs-nextjs-choosing-framework',
    excerpt: 'A practical comparison of React and Next.js to help you pick the right foundation for your next web application.',
    contentHtml: `<p>React and Next.js are often discussed together, but they serve different purposes. React is a library for building user interfaces. Next.js is a full framework built on top of React that adds routing, rendering strategies, and developer experience improvements. Here is how to decide.</p><h2>When to Use Plain React</h2><p>Choose plain React when you need maximum flexibility, are building a single-page application with complex client-side state, or are integrating into an existing non-React codebase. React gives you full control over routing, data fetching, and rendering without framework opinions.</p><h2>When to Use Next.js</h2><p>Next.js is the better choice for most new projects. It gives you file-based routing, server-side rendering, static generation, API routes, image optimization, and built-in SEO support out of the box. These features would take weeks to implement manually with plain React.</p><h2>Server Components Change Everything</h2><p>Next.js App Router with React Server Components lets you render components on the server by default, sending only the interactive parts to the client. This reduces JavaScript bundle size, improves initial load performance, and simplifies data fetching patterns.</p><h2>Deployment Complexity</h2><p>React apps need a build step and a hosting provider. Next.js apps can be deployed to Vercel, Netlify, or any Node.js hosting with zero configuration. The deployment story is significantly simpler with Next.js.</p><h2>The Verdict</h2><p>For most web applications in 2025, Next.js is the default choice. It gives you the flexibility of React with sensible defaults for routing, rendering, and performance. Only choose plain React if you have a specific reason to avoid framework conventions.</p>`,
    coverImage: coverUrl('blog-demo-react-nextjs.webp'),
    coverImageAlt: 'React and Next.js code on developer screen',
    coverImageFit: 'cover',
    authorName: 'Ghulam Mujtaba',
    tags: ['React', 'Next.js', 'frontend', 'web development'],
    categories: ['Engineering'],
    status: 'published',
    seoTitle: 'React vs Next.js: Choosing the Right Framework | Megicode',
    seoDescription: 'A practical comparison of React and Next.js to help you pick the right foundation for your project.',
  },
  {
    title: 'DevOps Best Practices for Small Development Teams',
    slug: 'devops-best-practices-small-teams',
    excerpt: 'How small teams can implement effective DevOps practices without enterprise-level resources or complexity.',
    contentHtml: `<p>DevOps is not just for large teams with dedicated platform engineers. Small teams can implement effective DevOps practices that save time, reduce errors, and improve delivery speed. Here is our pragmatic guide.</p><h2>Start With Version Control Hygiene</h2><p>Use a branching strategy that matches your team size. For teams under 5 developers, trunk-based development with short-lived feature branches works best. Merge to main daily, deploy from main, and use feature flags for incomplete features instead of long-lived branches.</p><h2>Automate Your Build and Test</h2><p>Set up a CI pipeline that runs on every pull request. It should install dependencies, run linting, execute tests, and build the application. This takes 30 minutes to set up and saves hours of manual testing every week. GitHub Actions is free for public repositories and generous for private ones.</p><h2>Deploy With One Command</h2><p>If deploying your application requires more than one command, something is wrong. Use infrastructure-as-code tools like Terraform or Pulumi for cloud resources, and containerization with Docker for consistent environments. The goal is that any team member can deploy to production safely.</p><h2>Monitor From Day One</h2><p>Add logging, error tracking, and basic metrics before you launch. Sentry for error tracking, a simple health check endpoint, and structured logging with a service like Axiom or Datadog give you visibility without complexity.</p><h2>Keep It Simple</h2><p>The best DevOps setup is the simplest one your team will actually use. Kubernetes is overkill for most small projects. A single VPS with Docker Compose, a CI pipeline, and proper logging handles 90% of small team needs. Upgrade only when you have a specific reason to.</p>`,
    coverImage: coverUrl('blog-demo-devops.webp'),
    coverImageAlt: 'DevOps pipeline with automated deployment',
    coverImageFit: 'cover',
    authorName: 'Megicode Team',
    tags: ['DevOps', 'CI/CD', 'automation', 'small teams'],
    categories: ['Engineering'],
    status: 'published',
    seoTitle: 'DevOps Best Practices for Small Development Teams | Megicode',
    seoDescription: 'How small teams can implement effective DevOps practices without enterprise-level resources.',
  },
];

function slugToId(slug: string) {
  return slug;
}

async function seedDemoArticles() {
  if (!uri) {
    throw new Error('Missing MONGODB_URI, MONGODB_URL, MONGO_URI, MONGO_URL, or DATABASE_URI');
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('blog_posts');
    const uploadsCollection = db.collection('blog_uploads');

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ status: 1, publishedAt: -1 });
    await collection.createIndex({ updatedAt: -1 });
    await uploadsCollection.createIndex({ filename: 1 }, { unique: true });
    await uploadsCollection.createIndex({ createdAt: -1 });

    for (const cover of demoCovers) {
      const buffer = await sharp(Buffer.from(coverSvg(cover)))
        .webp({ quality: 88, effort: 4 })
        .toBuffer();
      const metadata = await sharp(buffer).metadata();

      await uploadsCollection.updateOne(
        { filename: cover.filename },
        {
          $set: {
            filename: cover.filename,
            originalName: cover.filename.replace(/\.webp$/, '.svg'),
            contentType: 'image/webp',
            data: new Binary(buffer),
            size: buffer.length,
            width: metadata.width,
            height: metadata.height,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );
      console.log(`  Seeded cover: ${cover.filename}`);
    }

    let created = 0;
    let updated = 0;

    for (const article of articles) {
      const publishedAt = now;
      const doc = {
        ...article,
        publishedAt,
        updatedAt: now,
      };

      const result = await collection.updateOne(
        { slug: article.slug },
        {
          $set: doc,
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );

      if (result.upsertedCount) {
        created++;
        console.log(`  Created: ${article.title}`);
      } else {
        updated++;
        console.log(`  Updated: ${article.title}`);
      }
    }

    console.log(`\nDone! ${created} created, ${updated} updated.`);
    console.log(`\nArticle URLs:`);
    for (const article of articles) {
      console.log(`  /article/${article.slug}`);
    }
  } finally {
    await client.close();
  }
}

seedDemoArticles().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
