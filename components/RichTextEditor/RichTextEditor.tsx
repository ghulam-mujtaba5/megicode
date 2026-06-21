'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import styles from './RichTextEditor.module.css';
import { useEffect, useMemo, useState } from 'react';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  name?: string; // For form integration
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.active : ''}`}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.active : ''}`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${styles.toolbarButton} ${editor.isActive('strike') ? styles.active : ''}`}
        title="Strike"
      >
        <s>S</s>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`${styles.toolbarButton} ${editor.isActive('code') ? styles.active : ''}`}
        title="Code"
      >
        {'<>'}
      </button>
      
      <div style={{ width: 1, height: 20, background: 'var(--border-color, #e5e7eb)', margin: '0 4px' }} />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
        title="Heading 3"
      >
        H3
      </button>

      <div style={{ width: 1, height: 20, background: 'var(--border-color, #e5e7eb)', margin: '0 4px' }} />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.active : ''}`}
        title="Bullet List"
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.active : ''}`}
        title="Ordered List"
      >
        1.
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${styles.toolbarButton} ${editor.isActive('blockquote') ? styles.active : ''}`}
        title="Quote"
      >
        ""
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className={styles.toolbarButton}
        title="Undo"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className={styles.toolbarButton}
        title="Redo"
      >
        Redo
      </button>
    </div>
  );
};

export function RichTextEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Write something...', 
  editable = true,
  className,
  name
}: RichTextEditorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [codeText, setCodeText] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [sourceText, setSourceText] = useState(content);

  const markdownToHtml = useMemo(() => {
    return (markdown: string) => {
      if (!markdown.trim()) return '';
      let html = markdown
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${code}</code></pre>`;
      });
      html = html
        .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
        .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
        .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
      html = html.replace(/^(?:-\s+.+\n?)+/gm, (block) => {
        const items = block
          .trim()
          .split(/\n/)
          .map((item) => item.replace(/^-\s+/, ''));
        return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
      });

      return html
        .split(/\n{2,}/)
        .map((block) =>
          /<h\d|<ul|<pre/.test(block) ? block : `<p>${block.replace(/\n/g, '<br />')}</p>`
        )
        .join('');
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Update content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Only update if content is different to avoid cursor jumps
      // This is a simple check, for robust syncing you might need more complex logic
      if (editor.getText() === '' && content === '') return;
      // editor.commands.setContent(content); 
    }
  }, [content, editor]);

  return (
    <div className={`${styles.editor} ${className || ''}`}>
      {editable && <MenuBar editor={editor} />}
      {editable && (
        <div className={styles.utilityBar}>
          <details>
            <summary>Image</summary>
            <div className={styles.utilityPanel}>
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => {
                  if (!editor || !imageUrl.trim()) return;
                  editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
                  setImageUrl('');
                }}
              >
                Insert
              </button>
            </div>
          </details>
          <details>
            <summary>Code</summary>
            <div className={styles.utilityPanel}>
              <textarea
                rows={5}
                value={codeText}
                onChange={(event) => setCodeText(event.target.value)}
                placeholder="Paste code"
              />
              <button
                type="button"
                onClick={() => {
                  if (!editor || !codeText.trim()) return;
                  const safe = codeText
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                  editor.chain().focus().insertContent(`<pre><code>${safe}</code></pre>`).run();
                  setCodeText('');
                }}
              >
                Insert
              </button>
            </div>
          </details>
          <details>
            <summary>Markdown</summary>
            <div className={styles.utilityPanel}>
              <textarea
                rows={6}
                value={markdownText}
                onChange={(event) => setMarkdownText(event.target.value)}
                placeholder="# Heading"
              />
              <button
                type="button"
                onClick={() => {
                  if (!editor || !markdownText.trim()) return;
                  editor.chain().focus().insertContent(markdownToHtml(markdownText)).run();
                  setMarkdownText('');
                }}
              >
                Import
              </button>
            </div>
          </details>
          <details>
            <summary>Source</summary>
            <div className={styles.utilityPanel}>
              <textarea
                rows={7}
                value={sourceText}
                onFocus={() => setSourceText(editor?.getHTML() || '')}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="HTML source"
              />
              <button
                type="button"
                onClick={() => {
                  if (!editor) return;
                  editor.commands.setContent(sourceText || '', { emitUpdate: true });
                }}
              >
                Apply
              </button>
            </div>
          </details>
        </div>
      )}
      <EditorContent editor={editor} className={styles.content} />
      {name && <input type="hidden" name={name} value={editor?.getHTML() || ''} />}
    </div>
  );
}
