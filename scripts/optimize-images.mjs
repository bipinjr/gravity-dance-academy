// Makes 640w / 1280w webp copies of every photo in public/images/gravity. Run: npm run images
import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const dir = 'public/images/gravity';
for (const f of readdirSync(dir)) {
  if (!/\.(webp|jpe?g|png)$/i.test(f) || /-\d+\.webp$/.test(f) || f.startsWith('logo')) continue;
  const base = f.replace(/\.\w+$/, '');
  for (const w of [640, 1280]) {
    await sharp(`${dir}/${f}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`${dir}/${base}-${w}.webp`);
  }
}
await sharp(`${dir}/logo.jpeg`).resize(320).webp({ quality: 85 }).toFile(`${dir}/logo-320.webp`);
console.log('done');
