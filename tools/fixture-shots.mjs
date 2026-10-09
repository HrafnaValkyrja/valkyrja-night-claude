// Screenshot fixture/index.html (FIXTURE RENDER, not live claude.ai) with and without ext/claude.css.
// node tools/fixture-shots.mjs [tag]  -> shots/fixture-<tag>-<mode>-<width>[-modal].png
// file:// only, no server, no network beyond nothing; throwaway Firefox profile.
import { firefox } from 'playwright';
import fs from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const tag = process.argv[2] || 'after';
const css = tag === 'before' ? null : fs.readFileSync(root + 'ext/claude.css', 'utf8');
const b = await firefox.launch({ headless: true, executablePath: process.env.FX || undefined });
for (const mode of ['dark', 'light']) for (const w of [400, 1280]) for (const modal of [false, true]) {
  if (modal && w === 400) continue;
  const ctx = await b.newContext({ viewport: { width: w, height: w === 400 ? 860 : 800 } });
  const p = await ctx.newPage();
  await p.goto('file://' + root + 'fixture/index.html');
  await p.evaluate(([m, md]) => { document.documentElement.dataset.mode = m; if (md) document.body.setAttribute('data-show-modal', ''); }, [mode, modal]);
  if (css) await p.addStyleTag({ content: css });
  await p.waitForTimeout(300);
  const f = `${root}shots/fixture-${tag}-${mode}-${w}${modal ? '-modal' : ''}.png`;
  await p.screenshot({ path: f }); console.log(f);
  await ctx.close();
}
await b.close();
