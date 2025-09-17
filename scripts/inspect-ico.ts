import fs from 'fs';
import path from 'path';

// Minimal ICO parser for directory entries (no external deps)
// ICO format: https://en.wikipedia.org/wiki/ICO_(file_format)
// Header (6 bytes): Reserved (2=0), Type (2=1), Count (2)
// Entries (16 bytes each):
// width(1), height(1), colorCount(1), reserved(1), planes(2), bitCount(2), bytesInRes(4), imageOffset(4)
function listIcoEntries(buf: Buffer) {
  if (buf.length < 6) throw new Error('Buffer too small to be an ICO');
  const reserved = buf.readUInt16LE(0);
  const type = buf.readUInt16LE(2);
  const count = buf.readUInt16LE(4);
  if (reserved !== 0 || (type !== 1 && type !== 2)) {
    throw new Error(`Not an ICO/CUR file (reserved=${reserved}, type=${type})`);
  }
  const entries = [] as Array<{width: number;height: number;colorCount: number;bitCount: number;bytesInRes: number;offset: number;}>;
  let ptr = 6;
  for (let i = 0; i < count; i++) {
    if (ptr + 16 > buf.length) throw new Error('Truncated ICO directory');
    let w = buf.readUInt8(ptr + 0);
    let h = buf.readUInt8(ptr + 1);
    const colorCount = buf.readUInt8(ptr + 2);
    // const reservedEntry = buf.readUInt8(ptr + 3);
    const planes = buf.readUInt16LE(ptr + 4);
    const bitCount = buf.readUInt16LE(ptr + 6);
    const bytesInRes = buf.readUInt32LE(ptr + 8);
    const offset = buf.readUInt32LE(ptr + 12);
    // In ICO, a value of 0 for width/height means 256
    if (w === 0) w = 256;
    if (h === 0) h = 256;
    entries.push({ width: w, height: h, colorCount, bitCount, bytesInRes, offset });
    ptr += 16;
  }
  return { type, count, entries };
}

(async () => {
  const ROOT = path.resolve(__dirname, '..');
  const metaIco = path.join(ROOT, 'public', 'meta', 'favicon.ico');
  const rootIco = path.join(ROOT, 'public', 'favicon.ico');

  for (const p of [metaIco, rootIco]) {
    try {
      const buf = fs.readFileSync(p);
      const parsed = listIcoEntries(buf);
      console.log(`ICO: ${p} (type=${parsed.type}, count=${parsed.count})`);
      parsed.entries.forEach((e, idx) => {
        console.log(` - [${idx}] ${e.width}x${e.height}, bpp=${e.bitCount}, bytes=${e.bytesInRes}`);
      });
    } catch (e) {
      console.error(`Failed to read ${p}:`, (e as Error).message);
    }
  }
})();
