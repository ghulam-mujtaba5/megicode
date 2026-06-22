import { Binary, type Collection } from 'mongodb';

import { getMongoDb } from './mongodb';

const COLLECTION = 'blog_uploads';

export type BlogUploadDocument = {
  filename: string;
  originalName: string;
  contentType: string;
  data: Binary;
  size: number;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  updatedAt: string;
};

let indexesReady: Promise<void> | null = null;

async function uploadsCollection(): Promise<Collection<BlogUploadDocument>> {
  const db = await getMongoDb();
  const collection = db.collection<BlogUploadDocument>(COLLECTION);

  if (!indexesReady) {
    indexesReady = Promise.all([
      collection.createIndex({ filename: 1 }, { unique: true }),
      collection.createIndex({ createdAt: -1 }),
    ]).then(() => undefined);
  }

  await indexesReady;
  return collection;
}

export async function saveBlogUpload(input: {
  filename: string;
  originalName: string;
  contentType: string;
  buffer: Buffer;
  width?: number | null;
  height?: number | null;
}) {
  const collection = await uploadsCollection();
  const now = new Date().toISOString();
  const doc: BlogUploadDocument = {
    filename: input.filename,
    originalName: input.originalName,
    contentType: input.contentType,
    data: new Binary(input.buffer),
    size: input.buffer.length,
    width: input.width,
    height: input.height,
    createdAt: now,
    updatedAt: now,
  };

  await collection.updateOne(
    { filename: input.filename },
    {
      $set: doc,
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  return doc;
}

export async function getBlogUpload(filename: string) {
  const collection = await uploadsCollection();
  return collection.findOne({ filename });
}
