# Security profile: Valkyrja Night for claude.ai
Goal: the lightest possible footprint (as light as Dark Reader or lighter), so it can be installed from addons.mozilla.org on machines with strict extension policies.

## Manifest compared with Dark Reader
Dark Reader = its effective Firefox manifest (`src/manifest.json` + `src/manifest-firefox.json`, github.com/darkreader/darkreader, main, read 2026-10-08).

| Item | Dark Reader (Firefox) | Valkyrja Night |
|---|---|---|
| Manifest version | 2 | 3 |
| Host access | `<all_urls>` (every site) | `https://claude.ai/*` only, via the content-script `matches` |
| API permissions | `alarms`, `contextMenus`, `storage`, `tabs`, `theme` | **none** (no `permissions` key) |
| Optional permissions | none | none |
| Content scripts | JS (`inject/fallback.js`, `inject/index.js`) on all URLs, all frames, about:blank, one in the page's MAIN world | **CSS only** (`claude.css`), top frame of claude.ai only; **zero JavaScript in the package** |
| Background | persistent background page | none |
| Popup / options UI | yes | none |
| Keyboard commands | yes | none |
| Network requests | sync/remote config features | **none**: no `fetch`, no remote CSS/fonts, no `@import`, no `http` URLs (canary checks the CSS) |
| Remote code | none | none |
| Web-accessible resources | none | `fonts/*.ttf`, exposed to `https://claude.ai/*` only (so the bundled fonts can load; not a permission, not shown at install) |
| Data collection (`data_collection_permissions`) | n/a in its manifest | `required: ["none"]` |
| Minified / built code | yes (TypeScript build, source submitted) | **no build step**: the submitted files are the source |
| Install prompt shows | "Access your data for all websites", plus tabs, etc. | "Access your data for claude.ai" (only line) |

## What is in the package (dist zip)
`manifest.json`, `claude.css` (hand-written, commented), `fonts/*.ttf` (7 unmodified OFL files from github.com/google/fonts) + `fonts/OFL-*.txt`, `LICENSE` (MPL-2.0). `icons/` (the add-on icon). Nothing else: no scripts.

## Choices that keep it light
- One add-on. Browser-chrome colours are a separate, optional theme (repo valkyrja-night-firefox).
- No `storage`, so no settings. Turning it off = disable the add-on.
- Fonts: bundled locally, no Google Fonts requests. To drop even the web-accessible-resources entry, delete `fonts/` and the `@font-face` block: the theme then uses system fonts (Barlow etc. if installed, otherwise system sans/mono). One-line change.

## Checks (run by `npm test`)
- `web-ext lint`: 0 errors, 0 warnings, 0 notices.
- Zip contents audit: no `.js`, `.html`, `.json` other than manifest, no `http(s)://` or `@import` in CSS (tools/audit-package.sh).
