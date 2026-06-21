import { ObjectId, type Collection, type Document, type Filter } from 'mongodb';

import { getMongoDb } from './mongodb';
import type { BlogPost, BlogPostInput, BlogStatus } from './types';

const COLLECTION = 'blog_posts';
let indexesReady: Promise<void> | null = null;

type BlogPostDocument = Omit<BlogPost, '_id' | 'id'> & {
  _id?: ObjectId;
  slug: string;
};

function postsCollection(): Promise<Collection<BlogPostDocument>> {
  return getMongoDb().then((db) => db.collection<BlogPostDocument>(COLLECTION));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePost(doc: BlogPostDocument & { _id: ObjectId }): BlogPost {
  const id = doc._id.toString();
  return {
    ...doc,
    _id: id,
    id,
  };
}

function toPayloadShape(post: BlogPost) {
  return {
    ...post,
    summary: post.excerpt,
    coverImage: post.coverImage,
    populatedAuthors: [{ name: post.authorName || 'Megicode Team' }],
    content: {
      root: {
        children: [
          {
            children: [{ text: stripHtml(post.contentHtml) }],
          },
        ],
      },
    },
  };
}

async function ensureIndexes(collection: Collection<BlogPostDocument>) {
  if (!indexesReady) {
    indexesReady = Promise.all([
      collection.createIndex({ slug: 1 }, { unique: true }),
      collection.createIndex({ status: 1, publishedAt: -1 }),
      collection.createIndex({ updatedAt: -1 }),
    ]).then(() => undefined);
  }
  await indexesReady;
}

async function uniqueSlug(baseSlug: string, ignoreId?: string) {
  const collection = await postsCollection();
  const safeBase = baseSlug || 'untitled-post';
  let candidate = safeBase;
  let suffix = 2;

  while (true) {
    const filter: Filter<BlogPostDocument> = { slug: candidate };
    if (ignoreId && ObjectId.isValid(ignoreId)) {
      filter._id = { $ne: new ObjectId(ignoreId) } as Document;
    }
    const existing = await collection.findOne(filter);
    if (!existing) return candidate;
    candidate = `${safeBase}-${suffix}`;
    suffix += 1;
  }
}

function buildPostInput(input: BlogPostInput, slug: string): BlogPostDocument {
  const now = new Date().toISOString();
  const cleanExcerpt = input.excerpt?.trim() || stripHtml(input.contentHtml).slice(0, 180);
  const publishedAt =
    input.status === 'published'
      ? input.publishedAt || now
      : input.publishedAt || null;

  return {
    title: input.title.trim(),
    slug,
    excerpt: cleanExcerpt,
    contentHtml: input.contentHtml,
    coverImage: input.coverImage?.trim() || '',
    coverImageAlt: input.coverImageAlt?.trim() || '',
    coverImageFit: input.coverImageFit || 'cover',
    authorName: input.authorName?.trim() || 'Megicode Team',
    tags: Array.isArray(input.tags) ? input.tags.map((tag) => tag.trim()).filter(Boolean) : [],
    categories: Array.isArray(input.categories)
      ? input.categories.map((category) => category.trim()).filter(Boolean)
      : [],
    status: input.status,
    publishedAt,
    seoTitle: input.seoTitle?.trim() || input.title.trim(),
    seoDescription: input.seoDescription?.trim() || cleanExcerpt,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listBlogPosts(options: { includeDrafts?: boolean; status?: BlogStatus } = {}) {
  const collection = await postsCollection();
  await ensureIndexes(collection);

  const filter: Filter<BlogPostDocument> = {};
  if (options.status) {
    filter.status = options.status;
  } else if (!options.includeDrafts) {
    filter.status = 'published';
  }

  const docs = await collection
    .find(filter)
    .sort({ publishedAt: -1, updatedAt: -1 })
    .toArray();

  return docs.map((doc) => normalizePost(doc as BlogPostDocument & { _id: ObjectId }));
}

export async function listBlogPostsPayload() {
  const posts = await listBlogPosts();
  return {
    docs: posts.map(toPayloadShape),
    totalDocs: posts.length,
    limit: posts.length,
    totalPages: 1,
    page: 1,
  };
}

export async function getBlogPost(idOrSlug: string, options: { includeDrafts?: boolean } = {}) {
  const collection = await postsCollection();
  await ensureIndexes(collection);

  const candidates: Filter<BlogPostDocument>[] = [{ slug: idOrSlug }];
  if (ObjectId.isValid(idOrSlug)) candidates.push({ _id: new ObjectId(idOrSlug) });

  const filter: Filter<BlogPostDocument> = { $or: candidates };
  if (!options.includeDrafts) filter.status = 'published';

  const doc = await collection.findOne(filter);
  return doc ? normalizePost(doc as BlogPostDocument & { _id: ObjectId }) : null;
}

export async function getBlogPostPayload(idOrSlug: string) {
  const post = await getBlogPost(idOrSlug);
  return post ? { doc: toPayloadShape(post) } : null;
}

export async function createBlogPost(input: BlogPostInput) {
  const collection = await postsCollection();
  await ensureIndexes(collection);

  const slug = await uniqueSlug(slugify(input.slug || input.title));
  const doc = buildPostInput(input, slug);
  const result = await collection.insertOne(doc);
  return normalizePost({ ...doc, _id: result.insertedId });
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await postsCollection();
  await ensureIndexes(collection);

  const existing = await collection.findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  const slug = await uniqueSlug(slugify(input.slug || input.title), id);
  const next = buildPostInput(input, slug);
  const update = {
    ...next,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
  return getBlogPost(id, { includeDrafts: true });
}

export async function deleteBlogPost(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const collection = await postsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
