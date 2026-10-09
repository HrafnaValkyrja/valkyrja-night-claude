// 2x zoomed corner renders (FIXTURE RENDER) of the angular cuts: code card, dialog, menu, composer.
import { firefox } from 'playwright';
import fs from 'node:fs';
const root = new URL('../', import.meta.url).pathname, out = root + 'shots/corners/';
fs.mkdirSync(out, { recursive: true });
const css = fs.readFileSync(root + 'ext/claude.css', 'utf8');
const b = await firefox.launch({ headless: true, executablePath: process.env.FX || undefined });
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto('file://' + root + 'fixture/index.html');
await p.addStyleTag({ content: css }); await p.waitForTimeout(400);
const shots0 = { code: ':has(> pre code):not(.prose)', dialog: '[role=dialog]', menu: '[role=menu]', composer: '[data-testid=composer]' };
for (const modal of [false, true]) {
  await p.evaluate(m => m ? document.body.setAttribute('data-show-modal', '') : document.body.removeAttribute('data-show-modal'), modal); await p.waitForTimeout(200);
  if (modal && process.env.HIDE_BANNERS) await p.evaluate(() => document.querySelectorAll('[style*=cds-bg-danger],[style*=cds-bg-warning]').forEach(e => e.style.visibility = 'hidden'));
  const shots = modal ? { dialog: shots0.dialog } : { code: shots0.code, menu: shots0.menu, composer: shots0.composer };
for (const [n, sel] of Object.entries(shots)) {
  const r = await p.evaluate(s => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, sel);
  for (const [c, x, y] of [['tl', r.x - 12, r.y - 12], ['br', r.x + r.w - 52, r.y + r.h - 52]]) {
    const f = `${out}${n}-${c}${modal && process.env.HIDE_BANNERS ? '-nobanners' : ''}.png`; await p.screenshot({ path: f, clip: { x, y, width: 64, height: 64 } }); console.log(f);
  }
}
}
await p.screenshot({ path: out + 'context-2x.png' });
await b.close();
