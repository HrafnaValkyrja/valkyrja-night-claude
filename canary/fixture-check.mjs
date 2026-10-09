// Fixture canary: theme on fixture/index.html (needs fixture/vendor from tools/grab-css.mjs) in claude.ai dark AND light mode.
// Asserts computed colours: bodies true black, brand/send fill cyan, danger fill pink, primary text not pure white.
import { firefox } from 'playwright';
import fs from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const css = fs.readFileSync(root + 'ext/claude.css', 'utf8');
const want = [
  ['body (bg-bg-100)', 'body', 'backgroundColor', 'rgb(0, 0, 0)'],
  ['chat (bg-page)', '.fx-main', 'backgroundColor', 'rgb(0, 0, 0)'],
  ['sidebar (bg-bg-200)', '.fx-side', 'backgroundColor', 'rgb(0, 0, 0)'],
  ['send (bg-fill-brand)', '[data-testid=composer] .bg-fill-brand', 'backgroundColor', 'rgb(79, 224, 255)'],
  ['danger (bg-fill-danger)', '.bg-fill-danger', 'backgroundColor', 'rgb(255, 61, 154)'],
  ['accent (bg-fill-accent)', '.fx-art .bg-fill-accent', 'backgroundColor', 'rgb(79, 224, 255)'],
  ['text primary', '.text-text-100', 'color', 'rgb(220, 232, 245)'],
];
const b = await firefox.launch({ headless: true, executablePath: process.env.FX || undefined });
let fail = 0;
for (const mode of ['dark', 'light']) {
  const p = await (await b.newContext()).newPage();
  await p.goto('file://' + root + 'fixture/index.html');
  await p.evaluate(m => document.documentElement.dataset.mode = m, mode);
  await p.addStyleTag({ content: css });
  for (const [name, sel, prop, exp] of want) {
    const got = await p.evaluate(([s, pr]) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[pr] : 'MISSING'; }, [sel, prop]);
    const ok = got === exp; if (!ok) fail++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${mode} ${name}: ${got}${ok ? '' : ' (want ' + exp + ')'}`);
  }
}
await b.close();
console.log(fail ? `FIXTURE CANARY FAIL (${fail})` : 'FIXTURE CANARY PASS'); process.exit(fail ? 1 : 0);
