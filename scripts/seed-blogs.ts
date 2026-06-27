/// <reference types="node" />

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const fs = require('fs');
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

// Source markdown directory. Override with BLOG_SOURCE_DIR if needed.
const SOURCE_DIR =
  process.env.BLOG_SOURCE_DIR || path.join(process.cwd(), 'content', 'blog-source', 'blogs');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Align source content ("MegiCode") to the live brand spelling ("Megicode").
function brand(value: string) {
  return typeof value === 'string' ? value.replace(/MegiCode/g, 'Megicode') : value;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

const RELATED_LABELS: Record<string, string> = {
  '/services': 'Explore Megicode Services',
  '/services/ai-saas-mvp-development': 'AI & Machine Learning',
  '/services/web-development': 'Web Development',
  '/services/mobile-app-development': 'Mobile App Development',
  '/services/cloud-devops': 'Cloud & DevOps',
  '/services/ui-ux-design': 'UI/UX Design',
  '/services/data-analytics': 'Data & Analytics',
  '/projects': 'Our Projects',
  '/contact': 'Contact Megicode',
  '/about': 'About Megicode',
  '/reviews': 'Client Reviews',
};

function labelForPath(p: string) {
  if (RELATED_LABELS[p]) return RELATED_LABELS[p];
  const seg = p.replace(/\/+$/, '').split('/').filter(Boolean).pop() || p;
  return seg
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Inline markdown -> HTML (bold, links, inline code / internal paths)
function inline(text: string) {
  let out = escapeHtml(text);
  // links [label](url)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
    const external = /^https?:\/\//i.test(url);
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${rel}>${label}</a>`;
  });
  // inline code / internal paths
  out = out.replace(/`([^`]+)`/g, (_m, code) => {
    const c = code.trim();
    if (/^\/[a-z0-9-/]*$/i.test(c)) {
      return `<a href="${c}">${labelForPath(c)}</a>`;
    }
    return `<code>${code}</code>`;
  });
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic (single * or _) - conservative
  out = out.replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g, '$1<em>$2</em>$3');
  return out;
}

// Block-level markdown -> HTML. Returns html plus collected headings (h2/h3).
function blocksToHtml(md: string) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  const headings: { id: string; text: string; level: number }[] = [];
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    if (!buf.length) return;
    html.push(`<p>${inline(buf.join(' ').trim())}</p>`);
  };

  while (i < lines.length) {
    const line = lines[i];

    // blank
    if (!line.trim()) {
      i++;
      continue;
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const rawText = h[2].trim();
      if (level === 1) {
        i++;
        continue; // skip H1 (rendered separately)
      }
      const tag = level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
      const id = slugifyHeading(rawText);
      if (level === 2 || level === 3)
        headings.push({ id, text: rawText.replace(/\*\*/g, ''), level });
      html.push(`<${tag} id="${id}">${inline(rawText)}</${tag}>`);
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      html.push(`<blockquote><p>${inline(buf.join(' ').trim())}</p></blockquote>`);
      continue;
    }

    // table
    if (
      /^\|/.test(line) &&
      i + 1 < lines.length &&
      /^\|?[\s:|-]+\|/.test(lines[i + 1].trim()) &&
      lines[i + 1].includes('-')
    ) {
      const headerCells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      i += 2; // skip header + separator
      const bodyRows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        bodyRows.push(
          lines[i]
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );
        i++;
      }
      const thead = `<thead><tr>${headerCells.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
        .join('')}</tbody>`;
      html.push(`<div class="tableWrap"><table>${thead}${tbody}</table></div>`);
      continue;
    }

    // unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, '').trim())}</li>`);
        i++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, '').trim())}</li>`);
        i++;
      }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // horizontal rule
    if (/^---+$/.test(line.trim())) {
      i++;
      continue;
    }

    // paragraph
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^\|/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    flushParagraph(buf);
  }

  return { html: html.join('\n'), headings };
}

// Parse YAML-ish frontmatter (handles scalars + simple inline arrays)
function parseFrontmatter(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {} as Record<string, unknown>, body: raw };
  const data: Record<string, unknown> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const rawVal = kv[2].trim();
    let val: string | string[];
    if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
      val = rawVal
        .slice(1, -1)
        .split(',')
        .map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      val = rawVal.replace(/^["']|["']$/g, '');
    }
    data[key] = val;
  }
  return { data, body: m[2] };
}

function parseBlog(raw: string) {
  const { data, body } = parseFrontmatter(raw);

  // Cut everything from the "Optional structured data" section onward.
  let working = body;
  const schemaIdx = working.search(/^##\s+Optional structured data/im);
  if (schemaIdx !== -1) working = working.slice(0, schemaIdx);

  // Sentinel guarantees a trailing "## " boundary for section matching.
  const SENTINEL = '\n## __END__\n';
  working = working + SENTINEL;

  // Extract FAQ section
  const faqs: { question: string; answer: string }[] = [];
  const faqMatch = working.match(/^##\s+FAQ[^\n]*\n([\s\S]*?)(?=\n##\s)/im);
  if (faqMatch) {
    const faqBlock = faqMatch[1] + '\n### __END__\n';
    const qRegex = /^###\s+([^\n]+)\n([\s\S]*?)(?=\n###\s)/gim;
    let q;
    while ((q = qRegex.exec(faqBlock)) !== null) {
      const question = q[1].trim();
      const answer = q[2].replace(/\s+/g, ' ').trim();
      if (question && answer) faqs.push({ question, answer });
    }
    // remove FAQ section from body
    working = working.replace(faqMatch[0], '');
  }

  // Extract & remove "Recommended internal links" section
  const relatedLinks: { label: string; href: string }[] = [];
  const relMatch = working.match(/^##\s+Recommended internal links[^\n]*\n([\s\S]*?)(?=\n##\s)/im);
  if (relMatch) {
    const relBlock = relMatch[1];
    const re = /`(\/[a-z0-9-/]+)`/gi;
    let r;
    const seen = new Set<string>();
    while ((r = re.exec(relBlock)) !== null) {
      const href = r[1];
      if (seen.has(href)) continue;
      seen.add(href);
      relatedLinks.push({ label: labelForPath(href), href });
    }
    working = working.replace(relMatch[0], '');
  } else if (Array.isArray(data.recommended_internal_links)) {
    for (const href of data.recommended_internal_links) {
      relatedLinks.push({ label: labelForPath(href), href });
    }
  }

  // strip the sentinel boundary heading before conversion
  working = working.replace(/\n?##\s+__END__\s*$/m, '').replace(/##\s+__END__/g, '');

  const { html, headings } = blocksToHtml(working.trim());

  const plain = working
    .replace(/[#>*`|_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));

  return { data, html, headings, faqs, relatedLinks, readingMinutes, words };
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Blog source directory not found: ${SOURCE_DIR}`);
  }

  if (process.env.DRY_RUN) {
    const files = fs
      .readdirSync(SOURCE_DIR)
      .filter((f: string) => f.endsWith('.md'))
      .sort();
    const file = files[0];
    const parsed = parseBlog(fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8'));
    console.log('=== FRONTMATTER ===');
    console.log(JSON.stringify(parsed.data, null, 2));
    console.log('\n=== HEADINGS ===');
    console.log(
      parsed.headings
        .map((h: { level: number; text: string }) => `${'  '.repeat(h.level - 2)}- ${h.text}`)
        .join('\n')
    );
    console.log('\n=== FAQS ===', parsed.faqs.length);
    parsed.faqs.forEach((f: { question: string; answer: string }) =>
      console.log(`Q: ${f.question}\nA: ${f.answer.slice(0, 80)}...`)
    );
    console.log('\n=== RELATED ===', JSON.stringify(parsed.relatedLinks));
    console.log('\n=== READING ===', parsed.readingMinutes, 'min,', parsed.words, 'words');
    console.log('\n=== HTML STATS ===');
    console.log('length:', parsed.html.length);
    console.log('tables:', (parsed.html.match(/<table>/g) || []).length);
    console.log('uls:', (parsed.html.match(/<ul>/g) || []).length);
    console.log('ols:', (parsed.html.match(/<ol>/g) || []).length);
    console.log('h2s:', (parsed.html.match(/<h2/g) || []).length);
    console.log('blockquotes:', (parsed.html.match(/<blockquote>/g) || []).length);
    console.log('contains __END__:', parsed.html.includes('__END__'));
    console.log('contains Optional structured:', parsed.html.includes('Optional structured'));
    console.log('\n=== FIRST TABLE ===');
    console.log(
      (parsed.html.match(/<div class="tableWrap">[\s\S]*?<\/table><\/div>/) || ['(none)'])[0].slice(
        0,
        700
      )
    );
    return;
  }

  if (!uri) {
    throw new Error(
      'Missing MongoDB connection string. Set MONGODB_URI in .env.local before running.'
    );
  }

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f: string) => f.endsWith('.md'))
    .sort();

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 15000,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('blog_posts');

    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ status: 1, publishedAt: -1 });
    await collection.createIndex({ updatedAt: -1 });

    // Remove the older demo-seeded posts so only the executive blog set remains.
    const DEMO_SLUGS = [
      'how-ai-automation-helps-growing-businesses',
      'building-scalable-saas-platforms-architecture',
      'custom-software-vs-off-the-shelf',
      'web-application-security-guide-2025',
      'data-analytics-business-decisions',
      'react-vs-nextjs-choosing-framework',
      'devops-best-practices-small-teams',
    ];
    if (process.env.KEEP_DEMOS !== '1') {
      const del = await collection.deleteMany({ slug: { $in: DEMO_SLUGS } });
      const uploads = db.collection('blog_uploads');
      await uploads.deleteMany({ filename: { $regex: '^blog-demo-' } }).catch(() => undefined);
      console.log(`  - removed ${del.deletedCount} demo post(s)\n`);
    }

    let created = 0;
    let updated = 0;
    const baseDate = new Date('2026-06-23T12:00:00.000Z').getTime();

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const raw = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
      const { data, html, faqs, relatedLinks, readingMinutes, words } = parseBlog(raw);

      const slug = (data.slug || file.replace(/^\d+-/, '').replace(/\.md$/, '')).trim();
      const now = new Date().toISOString();
      // Newest first: blog 01 most recent.
      const publishedAt = new Date(baseDate - idx * 36 * 60 * 60 * 1000).toISOString();

      const secondary = Array.isArray(data.secondary_keywords)
        ? data.secondary_keywords
        : data.secondary_keywords
          ? [data.secondary_keywords]
          : [];
      const tags = [data.primary_keyword, ...secondary].filter(Boolean);

      const doc = {
        title: brand((data.title as string) || slug),
        slug,
        excerpt: brand((data.meta_description as string) || ''),
        contentHtml: brand(html),
        coverImage: fs.existsSync(
          path.join(process.cwd(), 'public', 'images', 'blog', `${slug}.png`)
        )
          ? `/images/blog/${slug}.png`
          : `/images/blog/${slug}.webp`,
        coverImageAlt: brand(
          (data.image_alt_text as string) ||
            `Megicode illustration for ${(data.title as string) || slug}`
        ),
        coverImageFit: 'cover',
        authorName: 'Megicode Team',
        tags,
        categories: data.category ? [data.category as string] : ['Megicode Insights'],
        status: 'published',
        publishedAt,
        seoTitle: brand((data.seo_title as string) || (data.title as string) || slug),
        seoDescription: brand((data.meta_description as string) || ''),
        primaryKeyword: (data.primary_keyword as string) || '',
        keywords: secondary,
        funnelStage: (data.funnel_stage as string) || '',
        audience: (data.target_audience as string) || '',
        readingMinutes,
        ctaLabel: brand((data.recommended_cta as string) || 'Book a strategy call with Megicode'),
        ctaText: brand(
          (data.conversion_goal as string) ||
            'Get a practical next-step plan for your product, platform, or automation idea.'
        ),
        faqs: faqs.map((f: { question: string; answer: string }) => ({
          question: brand(f.question),
          answer: brand(f.answer),
        })),
        relatedLinks,
        updatedAt: now,
      };

      const result = await collection.updateOne(
        { slug },
        { $set: doc, $setOnInsert: { createdAt: now } },
        { upsert: true }
      );

      if (result.upsertedCount) {
        created++;
        console.log(`  + ${slug}  (${words} words, ${readingMinutes} min, ${faqs.length} FAQ)`);
      } else {
        updated++;
        console.log(`  ~ ${slug}  (${words} words, ${readingMinutes} min, ${faqs.length} FAQ)`);
      }
    }

    console.log(`\nDone. ${created} created, ${updated} updated, ${files.length} total.`);
  } finally {
    await client.close();
  }
}

seed().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
