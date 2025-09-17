import fs from 'fs';
import path from 'path';
import {Ico} from 'ico-extract';

(async () => {
  const ROOT = path.resolve(__dirname, '..');
  const metaIco = path.join(ROOT, 'public', 'meta', 'favicon.ico');
  const rootIco = path.join(ROOT, 'public', 'favicon.ico');

  for (const p of [metaIco, rootIco]) {
    try {
      const buf = fs.readFileSync(p);
      const ico = new Ico(buf);
      const images = ico.images;
      console.log(`ICO: ${p}`);
      images.forEach((img, idx) => {
        console.log(` - [${idx}] ${img.width}x${img.height}, bpp=${img.bpp}`);
      });
    } catch (e) {
      console.error(`Failed to read ${p}:`, (e as Error).message);
    }
  }
})();
