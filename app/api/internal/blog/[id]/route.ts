import { NextResponse } from 'next/server';

import { deleteBlogPost, updateBlogPost } from '@/lib/blog/posts';
import { requireInternalApiSession } from '@/lib/internal/auth';
import type { BlogPostInput } from '@/lib/blog/types';

function isValidInput(input: Partial<BlogPostInput>) {
  return Boolean(
    input.title?.trim() &&
      input.contentHtml?.trim() &&
      (input.status === 'draft' || input.status === 'published')
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireInternalApiSession();
    const { id } = await params;
    const input = (await request.json()) as BlogPostInput;

    if (!isValidInput(input)) {
      return NextResponse.json({ error: 'Title, content, and status are required.' }, { status: 400 });
    }

    const post = await updateBlogPost(id, input);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    const status = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireInternalApiSession();
    const { id } = await params;
    const deleted = await deleteBlogPost(id);
    if (!deleted) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status });
  }
}
