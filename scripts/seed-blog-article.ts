/// <reference types="node" />

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

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
const slug = 'how-ai-automation-helps-growing-businesses';

const article = {
  title: 'How AI Automation Helps Growing Businesses Work Faster',
  slug,
  excerpt:
    'A practical guide to using AI automation, integrations, and custom dashboards to reduce manual work and improve customer response times.',
  contentHtml: `
    <p>Growing businesses often lose time to repeated manual work: copying lead details, following up late, updating spreadsheets, checking project status, and preparing routine reports. AI automation helps by connecting those workflows into one reliable system.</p>
    <h2>Start With Repetitive Work</h2>
    <p>The best automation opportunities are usually easy to spot. Look for tasks your team repeats every week, tasks that depend on the same data, and tasks where delays create missed sales or slower delivery.</p>
    <h2>Connect Your Existing Tools</h2>
    <p>A strong automation setup does not always require replacing your current software. It can connect forms, CRM records, email, dashboards, and internal tools so information moves without manual copying.</p>
    <h2>Use AI Where It Adds Judgment</h2>
    <p>AI is useful when the workflow needs classification, summarization, prioritization, or personalized messaging. For example, AI can score new leads, draft first replies, summarize support requests, or flag project risks before they become expensive.</p>
    <h2>Measure The Impact</h2>
    <p>Track time saved, response speed, conversion rate, and error reduction. These metrics show whether the automation is creating real business value instead of just adding another tool.</p>
    <p>Megicode builds custom web platforms, AI workflows, and business dashboards that help teams move faster while keeping control of their data and operations.</p>
  `
    .replace(/\n\s+/g, ' ')
    .trim(),
  coverImage: '/meta/og-image.png',
  coverImageAlt: 'Megicode digital systems and automation preview',
  coverImageFit: 'cover',
  authorName: 'Megicode Team',
  tags: ['AI automation', 'business systems', 'workflow automation', 'custom software'],
  categories: ['AI & Automation'],
  status: 'published',
  publishedAt: now,
  seoTitle: 'How AI Automation Helps Growing Businesses Work Faster | Megicode',
  seoDescription:
    'Learn how growing businesses can use AI automation, integrations, and dashboards to reduce manual work and respond faster.',
  updatedAt: now,
};

async function seedBlogArticle() {
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
    const collection = client.db(dbName).collection('blog_posts');

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ status: 1, publishedAt: -1 });
    await collection.createIndex({ updatedAt: -1 });

    const result = await collection.updateOne(
      { slug },
      {
        $set: article,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    if (result.upsertedCount) {
      console.log(`Seeded article: ${article.title}`);
    } else {
      console.log(`Updated article: ${article.title}`);
    }
    console.log(`/article/${slug}`);
  } finally {
    await client.close();
  }
}

seedBlogArticle().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
