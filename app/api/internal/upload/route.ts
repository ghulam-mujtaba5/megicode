import { NextResponse } from 'next/server';
import { requireInternalApiSession } from '@/lib/internal/auth';
import sharp from 'sharp';

import { saveBlogUpload } from '@/lib/blog/uploads';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml'];

function buildFilename(originalName: string) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const safeName = originalName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return `${safeName || 'blog-image'}-${timestamp}-${randomStr}.webp`;
}

export async function POST(request: Request) {
  try {
    await requireInternalApiSession();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, AVIF.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const outputBuffer = await sharp(buffer, { animated: false })
      .rotate()
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toBuffer();
    const metadata = await sharp(outputBuffer).metadata();
    const filename = buildFilename(file.name);

    await saveBlogUpload({
      filename,
      originalName: file.name,
      contentType: 'image/webp',
      buffer: outputBuffer,
      width: metadata.width,
      height: metadata.height,
    });

    const url = `/api/uploads/${filename}`;

    return NextResponse.json({
      url,
      filename,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      mimeType: 'image/webp',
      size: outputBuffer.length,
    });
  } catch (error) {
    const status = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status }
    );
  }
}
