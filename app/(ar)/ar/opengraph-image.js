import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

const COBALT = '#3D7BFF';
const INK = '#0B1320';

export default async function Image() {
  const fontsDir = join(process.cwd(), 'assets', 'fonts');
  const [regular, bold] = await Promise.all([
    readFile(join(fontsDir, 'Cairo-Regular.ttf')),
    readFile(join(fontsDir, 'Cairo-Bold.ttf')),
  ]);

  // satori (the renderer behind ImageResponse) doesn't handle CSS `direction: rtl`
  // well — it was justify-spreading the Arabic words apart instead of flowing them
  // normally. Arabic glyphs shape correctly regardless (that's Unicode bidi, not
  // CSS), so the fix is to lay out LTR-style but anchor everything to the right
  // edge, and use row-reverse where DOM order needs to visually flip.
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          background: INK,
          padding: '90px',
          position: 'relative',
          fontFamily: 'Cairo',
        }}
      >
        <div style={{ display: 'flex', position: 'absolute', right: 90, top: 0, width: 1, height: 84, background: COBALT }} />
        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <svg width="34" height="34" viewBox="14 8 100 100">
            <rect x="24" y="18" width="80" height="22" fill="#FFFFFF" />
            <rect x="24" y="18" width="22" height="80" fill="#FFFFFF" />
            <rect x="24" y="76" width="46" height="22" fill="#FFFFFF" />
            <path d="M82,18 L104,18 L104,49 L89,64 L82,64 Z" fill="#FFFFFF" />
            <rect x="81" y="75" width="23" height="23" fill={COBALT} />
          </svg>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#FFFFFF' }}>byldTEK</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-end', gap: 20, fontSize: 72, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
          {/* satori mis-measures the space glyph in this Arabic font, spreading
              words apart when left as one text run — so each word is its own
              flex child with an explicit gap instead. */}
          {['نبني', 'أفكارًا', 'تعمل'].map((word, i) => (
            <div key={i} style={{ display: 'flex' }}>{word}</div>
          ))}
          <span style={{ display: 'flex', width: 16, height: 16, background: COBALT, marginBottom: 22 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 10, fontSize: 26, fontWeight: 400, color: '#9BA6BC', marginTop: 28, maxWidth: 900 }}>
          {['هندسة', 'البرمجيات،', 'الذكاء', 'الاصطناعي', 'والأتمتة،', 'منتجات', 'الويب', 'والهاتف.'].map((word, i) => (
            <div key={i} style={{ display: 'flex' }}>{word}</div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cairo', data: regular, weight: 400, style: 'normal' },
        { name: 'Cairo', data: bold, weight: 700, style: 'normal' },
      ],
    }
  );
}
