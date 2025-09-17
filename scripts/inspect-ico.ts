import fs from 'fs';
import path from 'path';
import icojs from 'icojs';

(async () => {
  const ROOT = path.resolve(__dirname, '..');
  const metaIco = path.join(ROOT, 'public', 'meta', 'favicon.ico');
  const rootIco = path.join(ROOT, 'public', 'favicon.ico');

  for (const p of [metaIco, rootIco]) {
    try {
      const buf = fs.readFileSync(p);
      const images = await icojs.parse(buf, 'image/png');
      console.log(`ICO: ${p}`);
      for (const img of images) {
        console.log(` - ${img.width}x${img.height}, ${img.bpp || 'n/a'} bpp`);
      }
    } catch (e) {
      console.error(`Failed to read ${p}:`, (e as Error).message);
    }
  }
})();
