import { NextResponse } from 'next/server';

import { listBlogPostsPayload } from '@/lib/blog/posts';

export async function GET() {
  try {
    return NextResponse.json(await listBlogPostsPayload());
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
