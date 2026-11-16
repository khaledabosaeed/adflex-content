// Render comp.html frame by frame with Playwright Chromium, several pages in parallel.
// Usage: node build/render.cjs [--workers 4] [--from 0] [--to 600] [--only 15,60,120]
// Output: renders/out/f%05d.jpg (1-based, 30 fps). Encode with build/encode.sh.
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../../node_modules/playwright'));

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = 30, TOTAL = 600;
const workers = +arg('workers', 4), from = +arg('from', 0), to = +arg('to', TOTAL);
const only = arg('only', '') ? arg('only').split(',').map(Number) : null;
const OUT = path.resolve(__dirname, arg('out', '../renders/out'));
fs.mkdirSync(OUT, { recursive: true });
const frames = only || Array.from({ length: to - from }, (_, i) => from + i);

(async () => {
  const browser = await chromium.launch({
    args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=vulkan', '--enable-features=Vulkan',
      '--force-color-profile=srgb', '--hide-scrollbars', '--allow-file-access-from-files'],
  });
  const url = 'file://' + path.resolve(__dirname, 'comp.html');
  let next = 0, done = 0; const t0 = Date.now();
  async function work() {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => console.error('pageerror', e.message));
    await page.goto(url);
    await page.evaluate(() => window.ready);
    while (next < frames.length) {
      const f = frames[next++];
      await page.evaluate(t => window.renderAt(t), f / FPS);
      await page.screenshot({ path: path.join(OUT, 'f' + String(f + 1).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 95 });
      if (++done % 50 === 0) console.log(`${done}/${frames.length} frames, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    await page.close();
  }
  await Promise.all(Array.from({ length: Math.min(workers, frames.length) }, work));
  await browser.close();
  console.log(`done: ${frames.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s → ${OUT}`);
})().catch(e => { console.error(e); process.exit(1); });
