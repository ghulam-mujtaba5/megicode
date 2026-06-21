import { NextResponse } from 'next/server';

import { getBlogPostPayload } from '@/lib/blog/posts';

export async function fetchPostById(id: string) {
  try {
    const data = await getBlogPostPayload(id);
    if (!data) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
