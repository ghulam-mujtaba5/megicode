import { NextResponse } from 'next/server';

import { getBlogUpload } from '@/lib/blog/uploads';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!/^[a-z0-9][a-z0-9.-]*\.webp$/i.test(filename)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const upload = await getBlogUpload(filename);
  if (!upload) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const bytes = upload.data.buffer;
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);

  return new NextResponse(body, {
    headers: {
      'Content-Type': upload.contentType,
      'Content-Length': String(upload.size),
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
