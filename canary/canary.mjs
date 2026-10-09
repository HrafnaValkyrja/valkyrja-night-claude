// Canary: load claude.ai/login logged out in a throwaway Firefox profile with the theme CSS injected.
// Reports which --cds-* vars the theme overrides exist on :root, and screenshots at 400/1280.
import { firefox } from 'playwright';
import fs from 'node:fs';
const css = fs.readFileSync(new URL('../ext/claude.css', import.meta.url), 'utf8');
const vars = [...new Set(css.match(/--cds-[a-z0-9-]+(?=\s*:)/g))];
const out = new URL('../shots/', import.meta.url).pathname;
fs.mkdirSync(out, { recursive: true });
const browser = await firefox.launch({ headless: true, executablePath: process.env.FX || undefined }); // fresh temp profile each launch
let missing = [], present = [];
for (const w of [400, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto('https://claude.ai/login', { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('goto:', e.message));
  await page.addStyleTag({ content: css });
  await page.waitForTimeout(1500);
  if (w === 1280) {
    const r = await page.evaluate(vs => {
      const cs = getComputedStyle(document.documentElement);
      // "exists" = defined by the site's own sheets; check with the injected sheet disabled
      const st = [...document.querySelectorAll('style')].pop(); st.disabled = true;
      const base = getComputedStyle(document.documentElement);
      const o = vs.map(v => [v, base.getPropertyValue(v).trim() !== '']);
      st.disabled = false; return o;
    }, vars);
    present = r.filter(x => x[1]).map(x => x[0]); missing = r.filter(x => !x[1]).map(x => x[0]);
  }
  await page.screenshot({ path: `${out}login-${w}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
const ok = missing.length === 0;
console.log(`vars overridden: ${vars.length}, present on :root: ${present.length}, missing: ${missing.join(', ') || 'none'}`);
console.log(ok ? 'CANARY PASS' : 'CANARY FAIL');
process.exit(ok ? 0 : 1);
