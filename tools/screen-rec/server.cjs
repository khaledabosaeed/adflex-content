// Screen-recording helper for real AdFlex UI takes.
//
// Opens a headed Chromium with a persistent profile (so you sign in once),
// renders at 1920x1080 (1536x864 CSS px at 125 % zoom), and exposes a tiny
// HTTP control API on localhost so takes can be driven step by step.
// Recording uses the CDP screencast (JPEG frames + timestamps), assembled to
// a constant 30 fps H.264 file with ffmpeg. A fake cursor is drawn in-page so
// it shows up in the recording; the Next.js dev badge is hidden.
//
// Run:  node tools/screen-rec/server.cjs            (keep it running)
// Use:  curl 'localhost:9334/goto?url=http://localhost:3000/en/alfa'
//       curl 'localhost:9334/rec/start?dir=/abs/path/takeA'
//       curl 'localhost:9334/glide?x=700&y=780&ms=900'
//       curl 'localhost:9334/click?x=700&y=780'
//       curl --get --data-urlencode 'text=Hello' 'localhost:9334/type?delay=45'
//       curl 'localhost:9334/press?key=Enter'
//       curl 'localhost:9334/mark?label=sent'
//       curl 'localhost:9334/rec/stop'
//       curl 'localhost:9334/shot?out=/abs/path/now.png'
//       curl --data-binary @snippet.js 'localhost:9334/eval'
// Coordinates are CSS pixels in the 1536x864 viewport.

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const PORT = +(process.env.REC_PORT || 9334);
const PROFILE = process.env.REC_PROFILE || path.join(os.homedir(), '.cache/adflex-rec-profile');
const W = 1536, H = 864, DPR = 1.25;
const START_URL = process.env.REC_URL || 'http://localhost:3000/en/';

const INIT = `(() => {
  if (window.top !== window) return;
  const css = 'nextjs-portal{display:none!important}' +
    '#__rec_cursor{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;' +
    'opacity:0;transition:opacity .2s;will-change:transform;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}' +
    '#__rec_cursor.on{opacity:1}#__rec_cursor svg{transition:transform .12s}#__rec_cursor.down svg{transform:scale(.82)}';
  const add = () => {
    if (document.getElementById('__rec_cursor')) return;
    const st = document.createElement('style'); st.textContent = css; document.documentElement.appendChild(st);
    const c = document.createElement('div'); c.id = '__rec_cursor';
    c.innerHTML = '<svg viewBox="0 0 26 26" width="26" height="26"><path d="M4 2.5v19.2l5.1-4.6 3.3 7.4 3.4-1.5-3.3-7.3 6.9-.4z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(c);
    const p = window.__recPos; if (p) { c.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px)'; c.classList.add('on'); }
  };
  // The drawn cursor follows only positions the server sets, so a real mouse
  // passing over the window can't make it jump.
  window.__recCursor = (x, y, down) => {
    window.__recPos = [x, y];
    const c = document.getElementById('__rec_cursor'); if (!c) return;
    c.style.transform = 'translate(' + x + 'px,' + y + 'px)'; c.classList.add('on');
    c.classList.toggle('down', !!down);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  new MutationObserver(add).observe(document.documentElement, { childList: true });
})();`;

let ctx, page, cdp;
let rec = null;            // { dir, frames:[{file,ts}], marks:[], t0 }
let mouse = [W / 2, H / 2];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

async function attach(p) {
  page = p;
  p.on('load', () => drawCursor());
  p.on('framenavigated', f => { if (f === p.mainFrame()) setTimeout(() => drawCursor(), 300); });
  cdp = await ctx.newCDPSession(page);
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    try { await cdp.send('Page.screencastFrameAck', { sessionId }); } catch {}
    if (!rec) return;
    const file = path.join(rec.dir, 'frames', `f${String(rec.frames.length).padStart(6, '0')}.jpg`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    rec.frames.push({ file, ts: metadata.timestamp });
  });
}

async function glide(x, y, ms = 700) {
  const [x0, y0] = mouse;
  const n = Math.max(1, Math.round(ms / 16));
  for (let i = 1; i <= n; i++) {
    const k = ease(i / n);
    const px = x0 + (x - x0) * k, py = y0 + (y - y0) * k;
    await page.mouse.move(px, py);
    await page.evaluate(([a, b]) => window.__recCursor?.(a, b, false), [px, py]).catch(() => {});
    await sleep(10);
  }
  mouse = [x, y];
}

async function drawCursor(down = false) {
  await page.evaluate(([a, b, d]) => window.__recCursor?.(a, b, d), [mouse[0], mouse[1], down]).catch(() => {});
}

async function press() {
  await drawCursor(true); await page.mouse.down(); await sleep(90); await page.mouse.up(); await drawCursor(false);
}

async function startRec(dir) {
  if (rec) throw new Error('already recording');
  fs.mkdirSync(path.join(dir, 'frames'), { recursive: true });
  rec = { dir, frames: [], marks: [], t0: Date.now() / 1000 };
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  return { recording: dir };
}

async function stopRec() {
  if (!rec) throw new Error('not recording');
  const r = rec; const tEnd = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  rec = null;
  if (!r.frames.length) throw new Error('no frames captured');
  const lines = [];
  r.frames.forEach((f, i) => {
    const next = i + 1 < r.frames.length ? r.frames[i + 1].ts : tEnd;
    lines.push(`file '${f.file}'`, `duration ${Math.max(0.001, next - f.ts).toFixed(4)}`);
  });
  lines.push(`file '${r.frames[r.frames.length - 1].file}'`);
  const list = path.join(r.dir, 'frames.txt');
  fs.writeFileSync(list, lines.join('\n') + '\n');
  const out = path.join(r.dir, 'take.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list,
    '-vf', 'fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p', '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', out]);
  const first = r.frames[0].ts;
  const marks = r.marks.map(m => ({ ...m, t: +(m.wall - first).toFixed(3) }));
  fs.writeFileSync(path.join(r.dir, 'marks.json'), JSON.stringify({ duration: +(tEnd - first).toFixed(3), frames: r.frames.length, marks }, null, 2));
  return { out, frames: r.frames.length, duration: +(tEnd - first).toFixed(2), marks };
}

const routes = {
  async status() { return { url: page.url(), title: await page.title(), recording: !!rec, frames: rec?.frames.length || 0, mouse }; },
  async goto(q) { await page.goto(q.url, { waitUntil: 'domcontentloaded', timeout: 60000 }); return { url: page.url() }; },
  async shot(q) { await page.screenshot({ path: q.out, fullPage: q.full === '1' }); return { out: q.out }; },
  async 'rec/start'(q) { return startRec(q.dir); },
  async 'rec/stop'() { return stopRec(); },
  async mark(q) { if (rec) rec.marks.push({ label: q.label, wall: Date.now() / 1000 }); return { ok: !!rec }; },
  async glide(q) { await glide(+q.x, +q.y, +(q.ms || 700)); return { mouse }; },
  async click(q) {
    if (q.x != null) await glide(+q.x, +q.y, +(q.ms || 700));
    await press(); return { mouse };
  },
  // Drag: press at the current or given point, glide to (tx,ty), release.
  async drag(q) {
    if (q.x != null) await glide(+q.x, +q.y, +(q.ms || 500));
    await drawCursor(true); await page.mouse.down(); await sleep(120);
    await glide(+q.tx, +q.ty, +(q.dms || 900));
    await sleep(80); await page.mouse.up(); await drawCursor(false); return { mouse };
  },
  async rclick(q) {
    if (q.x != null) await glide(+q.x, +q.y, +(q.ms || 700));
    await drawCursor(true); await page.mouse.down({ button: 'right' }); await sleep(90);
    await page.mouse.up({ button: 'right' }); await drawCursor(false); return { mouse };
  },
  async clicksel(q) {
    const box = await page.locator(q.sel).first().boundingBox();
    if (!box) throw new Error('no box for ' + q.sel);
    await glide(box.x + box.width / 2, box.y + box.height / 2, +(q.ms || 700));
    await press(); return { mouse, box };
  },
  // Attach a file: glide to `sel`, click it, and answer the file chooser it opens
  // (no OS dialog appears in the recording). Without `sel`, sets the first file input.
  async choose(q) {
    if (!q.sel) { await page.locator('input[type=file]').first().setInputFiles(q.path); return { ok: true }; }
    const box = await page.locator(q.sel).first().boundingBox();
    if (!box) throw new Error('no box for ' + q.sel);
    await glide(box.x + box.width / 2, box.y + box.height / 2, +(q.ms || 700));
    const [fc] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 8000 }),
      press(),
    ]);
    await fc.setFiles(q.path); return { ok: true };
  },
  async box(q) { return { box: await page.locator(q.sel).first().boundingBox() }; },
  async type(q) { await page.keyboard.type(q.text, { delay: +(q.delay || 45) }); return { ok: true }; },
  async press(q) { await page.keyboard.press(q.key); return { ok: true }; },
  async wheel(q) { await page.mouse.wheel(+(q.dx || 0), +(q.dy || 0)); return { ok: true }; },
  async wait(q) { await sleep(+(q.ms || 1000)); return { ok: true }; },
  async eval(q, body) { const v = await page.evaluate(`(async () => { ${body} })()`); return { value: v }; },
};

(async () => {
  // REC_CHROME=/usr/bin/google-chrome uses the real Chrome, so a copied
  // profile's cookies decrypt with the system keyring (keeps an existing login).
  const CHROME = process.env.REC_CHROME;
  ctx = await chromium.launchPersistentContext(PROFILE, {
    headless: false,
    ...(CHROME ? { executablePath: CHROME } : {}),
    viewport: { width: W, height: H },
    deviceScaleFactor: DPR,
    locale: 'en-US',
    colorScheme: 'light',
    args: ['--hide-scrollbars', '--disable-infobars', '--force-color-profile=srgb'],
    ignoreDefaultArgs: ['--enable-automation', ...(CHROME ? ['--password-store=basic', '--use-mock-keychain'] : [])],
  });
  ctx.on('close', () => { console.log('browser closed, exiting'); process.exit(0); });
  for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, async () => { await ctx.close().catch(() => {}); process.exit(0); });
  await ctx.addInitScript(INIT);
  const p0 = ctx.pages()[0] || await ctx.newPage();
  await attach(p0);
  ctx.on('page', async p => { await attach(p); console.log('switched to new page', p.url()); });
  await page.goto(START_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.log('goto:', e.message));

  http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    const name = u.pathname.slice(1);
    const q = Object.fromEntries(u.searchParams);
    let body = '';
    for await (const chunk of req) body += chunk;
    res.setHeader('content-type', 'application/json');
    try {
      if (!routes[name]) throw new Error('unknown route ' + name);
      res.end(JSON.stringify(await routes[name](q, body)) + '\n');
    } catch (e) {
      res.statusCode = 500; res.end(JSON.stringify({ error: e.message }) + '\n');
    }
  }).listen(PORT, '127.0.0.1', () => console.log(`screen-rec ready on 127.0.0.1:${PORT}, profile ${PROFILE}`));
})();
