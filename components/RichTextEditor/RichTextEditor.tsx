'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import styles from './RichTextEditor.module.css';
import { useEffect } from 'react';

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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
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
      <EditorContent editor={editor} className={styles.content} />
      {name && <input type="hidden" name={name} value={editor?.getHTML() || ''} />}
    </div>
  );
}
