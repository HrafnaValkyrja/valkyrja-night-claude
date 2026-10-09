// Fetch claude.ai/login public stylesheets (logged out, temp profile) into a folder: node tools/grab-css.mjs fixture/vendor
import { firefox } from 'playwright';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await firefox.launch({ headless: true, executablePath: process.env.FX || undefined });
const p = await (await b.newContext()).newPage();
const css = [];
p.on('response', async r => { if (r.request().resourceType() === 'stylesheet') { try { css.push([r.url(), await r.text()]); } catch {} } });
await p.goto('https://claude.ai/login', { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log(e.message));
const inline = await p.evaluate(() => [...document.querySelectorAll('style')].map(s => s.textContent).join('\n'));
const html = await p.evaluate(() => ({ cls: document.documentElement.className, attrs: [...document.documentElement.attributes].map(a => a.name + '=' + a.value) }));
let i = 0; for (const [u, t] of css) { fs.writeFileSync(`${out}/claude-${i++}.css`, `/* source: ${u} */\n` + t); console.log(u, t.length); }
fs.writeFileSync(`${out}/claude-inline.css`, inline); console.log('inline', inline.length, JSON.stringify(html));
await b.close();
