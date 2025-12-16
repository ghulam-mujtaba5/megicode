'use client';

import { useState } from 'react';
import { FilePreview } from '@/components/FilePreview';

interface AttachmentListProps {
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
    mimeType?: string | null;
    createdAt: Date;
    uploadedByUserId?: string | null;
    uploaderName?: string | null;
  }>;
  formatDateTime: (date: Date) => string;
  Icons: any;
}

export function AttachmentList({ attachments, formatDateTime, Icons }: AttachmentListProps) {
  const [previewFile, setPreviewFile] = useState<{ url: string; filename: string; mimeType?: string | null } | null>(null);

  if (attachments.length === 0) {
    return <p style={{ color: 'var(--int-text-muted)', marginBottom: '24px' }}>No attachments</p>;
  }

  return (
    <>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {attachments.map((attachment) => (
          <li key={attachment.id} style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', 
            padding: '12px', background: 'var(--int-bg-alt)', 
            borderRadius: 'var(--int-radius)', border: '1px solid var(--int-border)' 
          }}>
            <div style={{ color: 'var(--int-text-muted)' }}>{Icons.paperclip}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <button 
                onClick={() => setPreviewFile(attachment)}
                style={{ 
                  display: 'block', fontWeight: 500, color: 'var(--int-text)', 
                  textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', 
                  textOverflow: 'ellipsis', background: 'none', border: 'none', 
                  padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%'
                }}
              >
                {attachment.filename}
              </button>
              <div style={{ fontSize: '0.75rem', color: 'var(--int-text-muted)' }}>
                Added by {attachment.uploaderName || 'Unknown'} • {formatDateTime(attachment.createdAt)}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {previewFile && (
        <FilePreview
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          url={previewFile.url}
          filename={previewFile.filename}
          mimeType={previewFile.mimeType}
        />
      )}
    </>
  );
}
