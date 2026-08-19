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
  const [regular, extrabold] = await Promise.all([
    readFile(join(fontsDir, 'Manrope-Regular.ttf')),
    readFile(join(fontsDir, 'Manrope-ExtraBold.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: INK,
          padding: '90px',
          position: 'relative',
          fontFamily: 'Manrope',
        }}
      >
        <div style={{ display: 'flex', position: 'absolute', left: 90, top: 0, width: 1, height: 84, background: COBALT }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <svg width="34" height="34" viewBox="14 8 100 100">
            <rect x="24" y="18" width="80" height="22" fill="#FFFFFF" />
            <rect x="24" y="18" width="22" height="80" fill="#FFFFFF" />
            <rect x="24" y="76" width="46" height="22" fill="#FFFFFF" />
            <path d="M82,18 L104,18 L104,49 L89,64 L82,64 Z" fill="#FFFFFF" />
            <rect x="81" y="75" width="23" height="23" fill={COBALT} />
          </svg>
          <div style={{ display: 'flex', fontSize: 30, color: '#FFFFFF' }}>
            <span style={{ fontWeight: 400 }}>byld</span>
            <span style={{ fontWeight: 800 }}>TEK</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: '#FFFFFF', letterSpacing: -2, lineHeight: 1.05 }}>
          We make ideas work
          <span style={{ display: 'flex', width: 16, height: 16, background: COBALT, marginLeft: 10, marginTop: 46 }} />
        </div>
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 400, color: '#9BA6BC', marginTop: 28, maxWidth: 900 }}>
          Software engineering, AI &amp; automation, web and mobile products.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Manrope', data: regular, weight: 400, style: 'normal' },
        { name: 'Manrope', data: extrabold, weight: 800, style: 'normal' },
      ],
    }
  );
}
