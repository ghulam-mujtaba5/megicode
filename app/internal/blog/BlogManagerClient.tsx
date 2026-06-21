'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';
import type { BlogPost, BlogPostInput, BlogStatus } from '@/lib/blog/types';

import styles from './blog.module.css';

const emptyForm: BlogPostInput = {
  title: '',
  slug: '',
  excerpt: '',
  contentHtml: '',
  coverImage: '',
  coverImageAlt: '',
  coverImageFit: 'cover',
  authorName: 'Megicode Team',
  tags: [],
  categories: [],
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatDate(value?: string | null) {
  if (!value) return 'Not published';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogManagerClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogPostInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadPosts() {
    setLoading(true);
    const res = await fetch('/api/internal/blog', { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load posts');
    setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts().catch((error) => {
      setMessage(error.message);
      setLoading(false);
    });
  }, []);

  const previewText = useMemo(() => {
    return form.excerpt?.trim() || stripHtml(form.contentHtml).slice(0, 180) || 'Your post preview will appear here.';
  }, [form.contentHtml, form.excerpt]);

  function updateField<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function editPost(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      contentHtml: post.contentHtml,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt,
      coverImageFit: post.coverImageFit || 'cover',
      authorName: post.authorName,
      tags: post.tags || [],
      categories: post.categories || [],
      status: post.status,
      publishedAt: post.publishedAt,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
    });
    setMessage('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
  }

  async function savePost(status: BlogStatus) {
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...form, status };
      const res = await fetch(editingId ? `/api/internal/blog/${editingId}` : '/api/internal/blog', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save post');
      setMessage(status === 'published' ? 'Post published.' : 'Draft saved.');
      setEditingId(data.post.id);
      setForm({
        title: data.post.title,
        slug: data.post.slug,
        excerpt: data.post.excerpt,
        contentHtml: data.post.contentHtml,
        coverImage: data.post.coverImage,
        coverImageAlt: data.post.coverImageAlt,
        coverImageFit: data.post.coverImageFit || 'cover',
        authorName: data.post.authorName,
        tags: data.post.tags || [],
        categories: data.post.categories || [],
        status: data.post.status,
        publishedAt: data.post.publishedAt,
        seoTitle: data.post.seoTitle,
        seoDescription: data.post.seoDescription,
      });
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"?`)) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/internal/blog/${post.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete post');
      if (editingId === post.id) resetForm();
      await loadPosts();
      setMessage('Post deleted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete post');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Blog CMS</h1>
          <p>Manage Megicode blog posts from the portal with MongoDB storage.</p>
        </div>
        <Link href="/article" className={styles.secondaryButton} target="_blank">
          View blog
        </Link>
      </header>

      {message && <div className={styles.message}>{message}</div>}

      <section className={styles.layout}>
        <div className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <h2>{editingId ? 'Edit post' : 'New post'}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className={styles.textButton}>
                New post
              </button>
            )}
          </div>

          <div className={styles.formGrid}>
            <label>
              Title
              <input
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Article title"
              />
            </label>
            <label>
              Slug
              <input
                value={form.slug || ''}
                onChange={(event) => updateField('slug', event.target.value)}
                placeholder="auto-generated-from-title"
              />
            </label>
            <label>
              Author
              <input
                value={form.authorName || ''}
                onChange={(event) => updateField('authorName', event.target.value)}
                placeholder="Megicode Team"
              />
            </label>
            <label>
              Cover image URL
              <input
                value={form.coverImage || ''}
                onChange={(event) => updateField('coverImage', event.target.value)}
                placeholder="https://..."
              />
            </label>
            <label>
              Cover image alt
              <input
                value={form.coverImageAlt || ''}
                onChange={(event) => updateField('coverImageAlt', event.target.value)}
                placeholder="Describe the cover image"
              />
            </label>
            <label>
              Cover fit
              <select
                value={form.coverImageFit || 'cover'}
                onChange={(event) => updateField('coverImageFit', event.target.value as BlogPostInput['coverImageFit'])}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="none">None</option>
                <option value="scale-down">Scale down</option>
              </select>
            </label>
            <label>
              Tags
              <input
                value={(form.tags || []).join(', ')}
                onChange={(event) =>
                  updateField(
                    'tags',
                    event.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                  )
                }
                placeholder="Next.js, SEO, CMS"
              />
            </label>
            <label>
              Categories
              <input
                value={(form.categories || []).join(', ')}
                onChange={(event) =>
                  updateField(
                    'categories',
                    event.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                  )
                }
                placeholder="Engineering, Growth"
              />
            </label>
          </div>

          <label className={styles.fullField}>
            Excerpt
            <textarea
              value={form.excerpt || ''}
              onChange={(event) => updateField('excerpt', event.target.value)}
              placeholder="Short preview for cards and SEO"
            />
          </label>

          <div className={styles.editorBlock}>
            <span className={styles.label}>Content</span>
            <RichTextEditor
              key={editingId || 'new'}
              content={form.contentHtml}
              onChange={(html) => updateField('contentHtml', html)}
              placeholder="Write the full article..."
            />
          </div>

          <details className={styles.seoBox}>
            <summary>SEO fields</summary>
            <label>
              SEO title
              <input
                value={form.seoTitle || ''}
                onChange={(event) => updateField('seoTitle', event.target.value)}
                placeholder="Defaults to title"
              />
            </label>
            <label>
              SEO description
              <textarea
                value={form.seoDescription || ''}
                onChange={(event) => updateField('seoDescription', event.target.value)}
                placeholder="Defaults to excerpt"
              />
            </label>
          </details>

          <div className={styles.actions}>
            <button type="button" onClick={() => savePost('draft')} disabled={saving} className={styles.secondaryButton}>
              Save draft
            </button>
            <button type="button" onClick={() => savePost('published')} disabled={saving} className={styles.primaryButton}>
              Publish
            </button>
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <h2>Card preview</h2>
          <article className={styles.previewCard}>
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt={form.coverImageAlt || ''}
                style={{ objectFit: form.coverImageFit || 'cover' }}
              />
            )}
            <div className={styles.previewBody}>
              <span className={styles.statusBadge}>{form.status}</span>
              {Boolean(form.categories?.length) && (
                <div className={styles.chipRow}>
                  {form.categories?.map((category) => <span key={category}>{category}</span>)}
                </div>
              )}
              <h3>{form.title || 'Article title'}</h3>
              <p>{previewText}</p>
              {Boolean(form.tags?.length) && (
                <div className={styles.tagRow}>
                  {form.tags?.slice(0, 4).map((tag) => <span key={tag}>#{tag}</span>)}
                </div>
              )}
              <small>{form.authorName || 'Megicode Team'} - {formatDate(form.publishedAt)}</small>
            </div>
          </article>

          <h2>All posts</h2>
          <div className={styles.postList}>
            {loading ? (
              <p className={styles.muted}>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className={styles.muted}>No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className={styles.postItem}>
                  <button type="button" onClick={() => editPost(post)}>
                    <strong>{post.title}</strong>
                    <span>{post.status} - {formatDate(post.publishedAt || post.updatedAt)}</span>
                  </button>
                  <div className={styles.postActions}>
                    {post.status === 'published' && (
                      <Link href={`/article/${post.slug}`} target="_blank">
                        Open
                      </Link>
                    )}
                    <button type="button" onClick={() => deletePost(post)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
