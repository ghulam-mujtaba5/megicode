import { NextResponse } from 'next/server';

import { createBlogPost, listBlogPosts } from '@/lib/blog/posts';
import { requireInternalApiSession } from '@/lib/internal/auth';
import type { BlogPostInput } from '@/lib/blog/types';

function isValidInput(input: Partial<BlogPostInput>) {
  return Boolean(
    input.title?.trim() &&
      input.contentHtml?.trim() &&
      (input.status === 'draft' || input.status === 'published')
  );
}

export async function GET() {
  try {
    await requireInternalApiSession();
    const posts = await listBlogPosts({ includeDrafts: true });
    return NextResponse.json({ posts });
  } catch (error) {
    const status = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireInternalApiSession();
    const input = (await request.json()) as BlogPostInput;

    if (!isValidInput(input)) {
      return NextResponse.json({ error: 'Title, content, and status are required.' }, { status: 400 });
    }

    const post = await createBlogPost(input);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status });
  }
}
