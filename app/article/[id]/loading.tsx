import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

export default function ArticleLoading() {
  return (
    <div
      style={{
        background: 'var(--surface-page)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoadingAnimation size="large" />
    </div>
  );
}
