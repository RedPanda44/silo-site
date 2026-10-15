# Silo — official website

A dependency-free, static marketing + documentation site for Silo.
Plain HTML, one CSS file, one JS file — no build step required.

```
site/
├── index.html          Home: hero (animated iPhone + Silo app scene), features, workflow, FAQ
├── features.html       Full feature breakdown
├── download.html       Download section: builds, checksums, requirements, release notes
├── docs.html           Documentation: guides, troubleshooting, build & changelog
├── about.html          Author, credits, license, Revolut tip link
├── assets/
│   ├── css/style.css   Design system (dark & light themes) + hero scene animation
│   ├── js/main.js      Theme toggle, mobile nav, scroll reveal, copy buttons, hero animation
│   └── img/            App icon (PNG + SVG)
└── downloads/
    ├── silo-installer.exe       Windows installer served by download.html (12.1 MB)
    ├── Silo.dmg                 Universal macOS image served by download.html (2.5 MB)
    └── Silo-1.5.0-x64.exe       Legacy portable build (kept for reference, nothing links to it)
```

## Repositories

- **This site:** <https://github.com/razvanhb/Silo>
- **Application source code (build it yourself):**
  <https://github.com/Lumid-Off/AirCard-Windows>

Both installers are served straight from this repo — no external CDN, so the buttons
never expire:

- `downloads/silo-installer.exe` — 12.1 MB, used by the two Windows buttons
- `downloads/Silo.dmg` — 2.5 MB, used by the macOS button

(An earlier revision pointed those buttons at Discord CDN attachment URLs, whose signed
`ex=` parameters lapse after ~24 h.)

Published SHA-256 hashes (shown on the download page):

```text
silo-installer.exe  D35E6B3A69C8E1FD0B0516DDCE28458CF2073794728DD031EA6A671FB52EC92D
Silo.dmg            576CF930836B68A75E5D5F963D5523E487681E64831FB82B4E18A9AC353D14C1
```

## Preview locally

```powershell
# Any static server works, e.g.:
python -m http.server 8080 --directory site
# then open http://localhost:8080
```

Opening `index.html` directly with `file://` also works.

## Deploy

Push the `site/` folder to a branch (for example `gh-pages`) or point GitHub Pages /
Netlify / Cloudflare Pages at it. No build command, no dependencies.

## Notes

- Dark-first design that mirrors the app's own egui palette
  (`#0a84ff` accent, `#161618` background, Apple system greens/reds).
- Colour theme respects `prefers-color-scheme`, is persisted in `localStorage`,
  and can be forced with `?theme=dark` / `?theme=light`.
- The hero shows a live preview: the Silo window and the iPhone swap card
  templates every 2.8 s (cross-fade + sync beam + status line). The loop is
  skipped entirely when the visitor prefers reduced motion.
- Donations go through a single Revolut link — `https://www.revolut.me/olix21/`
  (card on `about.html`, section `#support`).
- The download page serves `downloads/silo-installer.exe` and `downloads/Silo.dmg`
  directly from the repo. The SHA-256 values published on that page must be
  regenerated whenever either binary is rebuilt and re-uploaded:

  ```powershell
  (Get-FileHash site\downloads\silo-installer.exe -Algorithm SHA256).Hash
  (Get-FileHash site\downloads\Silo.dmg -Algorithm SHA256).Hash
  ```
