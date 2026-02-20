import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') || 'Megicode';
  const subtitle = searchParams.get('subtitle') || 'Modern Software Solutions';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          padding: '60px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Accent gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '500px',
            height: '100%',
            background: 'linear-gradient(135deg, transparent 30%, rgba(56, 189, 248, 0.12) 100%)',
            display: 'flex',
          }}
        />
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)',
            display: 'flex',
          }}
        />
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#38bdf8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}
          >
            Megicode
          </div>
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? '44px' : '54px',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.15,
            maxWidth: '950px',
            letterSpacing: '-0.03em',
            display: 'flex',
          }}
        >
          {title}
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: '#94a3b8',
            marginTop: '20px',
            maxWidth: '800px',
            lineHeight: 1.5,
            display: 'flex',
          }}
        >
          {subtitle}
        </div>
        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            right: '60px',
            fontSize: '16px',
            color: '#475569',
            display: 'flex',
          }}
        >
          megicode.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
