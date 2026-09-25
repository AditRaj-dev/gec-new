import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Default share card for every route (routes may add their own opengraph-image later).
export const alt = 'Galgotias Entrepreneurship Cell — Ideas begin here. Builders grow here.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logo = await readFile(join(process.cwd(), 'public/gec-logo-512.png'));
  const src = `data:image/png;base64,${logo.toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#FCF8ED', borderBottom: '24px solid #A3040F' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 520, background: '#FFFFFF' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img src={src} width={420} height={420} alt="" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px', flex: 1 }}>
          <div style={{ fontSize: 26, letterSpacing: 4, color: '#A3040F', fontWeight: 700 }}>GALGOTIAS UNIVERSITY · E-CELL</div>
          <div style={{ fontSize: 58, lineHeight: 1.08, color: "#222222", fontWeight: 800, marginTop: 20 }}>Ideas begin here.</div>
          <div style={{ fontSize: 58, lineHeight: 1.08, color: "#222222", fontWeight: 800 }}>Builders grow here.</div>
          <div style={{ fontSize: 24, color: "#6E655F", marginTop: 28 }}>Startup Development Program · Pitching · Incubation</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
