# AMO listing: Valkyrja Night for claude.ai (unofficial)

| Field | Text |
|---|---|
| Name | Valkyrja Night for claude.ai (unofficial) |
| Add-on URL slug | valkyrja-night-claude |
| Summary (≤250) | Unofficial true-black neon restyle for claude.ai. Not affiliated with or endorsed by Anthropic. CSS only: no scripts, no network requests, no data collected. |
| Categories | Appearance |
| Tags | dark mode, claude, theme, oled |
| Licence | Mozilla Public License 2.0 |
| Privacy policy | Not needed: collects no data (state "This add-on collects no data" in the description) |
| Homepage | https://github.com/HrafnaValkyrja/valkyrja-night-claude |
| Support site | https://github.com/HrafnaValkyrja/valkyrja-night-claude/issues |

## Description
Not affiliated with or endorsed by Anthropic. "Claude" is a trademark of Anthropic; it is used here only to name the website this add-on restyles.

Valkyrja Night restyles claude.ai in true black, for OLED screens and late nights:
• True-black backgrounds, with depth from faint indigo layers instead of grey.
• One cyan accent for buttons, links, focus and selection.
• Hot pink only where it carries meaning: errors and destructive actions.
• Readable code blocks; a single angular cut on code cards, dialogs and menus.
• Barlow, Chakra Petch and IBM Plex Mono fonts, bundled (SIL Open Font License).
• Works whether claude.ai is set to light or dark.

How it works: one stylesheet that sets claude.ai's own colour tokens. No JavaScript, no network requests, access to claude.ai only. This add-on collects no data.

Open source (MPL-2.0): https://github.com/HrafnaValkyrja/valkyrja-night-claude

## Notes to reviewer
Static CSS content script plus unmodified OFL font files (github.com/google/fonts). No build step, no minification, no third-party code: the submitted files are the source. `web_accessible_resources` exposes only `fonts/*.ttf` to https://claude.ai/* so the bundled fonts can load.

## Screenshots (upload in this order, with these captions)
1. `docs/screenshots/1-chat-1280x800.png`: "Chat view (preview on a sample page using claude.ai's stylesheet)"
2. `docs/screenshots/2-delete-dialog-1280x800.png`: "Pink is reserved for destructive actions (preview on a sample page)"
3. `docs/screenshots/3-phone-width.png`: "Narrow window (preview on a sample page)"
Replace with real claude.ai screenshots once taken in a logged-in Firefox; keep captions honest either way.
