# Technology Stack

**Analysis Date:** 2026-04-17

## Languages

**Primary:**

- HTML - Application entry and page structure in `index.html`
- CSS / SCSS - Styling in `css/*.scss` with compiled CSS checked in alongside source files
- JavaScript - Navigation and modal behavior in `js/nav.js`

**Secondary:**

- JSON - Editor configuration in `.vscode/settings.json`
- Markdown - Project notes and planning docs in `docs/` and `.planning/`

## Runtime

**Environment:**

- Browser runtime only
- No Node.js, backend runtime, or package manifest detected in the repository root

**Package Manager:**

- Not detected
- Lockfile: missing

## Frameworks

**Core:**

- None detected - the site is built with vanilla HTML, CSS, and JavaScript

**Testing:**

- None detected

**Build/Dev:**

- VS Code Live Sass Compile extension - compiles `css/*.scss` into `css/*.css`
- Source maps are committed for the compiled stylesheet outputs (`css/*.css.map`)

## Key Dependencies

**Critical:**

- Browser DOM APIs - page switching, keyboard handling, touch gestures, and modal state in `js/nav.js`
- Native CSS features - custom properties, `backdrop-filter`, `100dvh`, flexbox, grid, and media queries across `css/*.scss`
- Local font files - bundled in `assets/fonts/` and declared in `css/base.scss`

**Infrastructure:**

- Local image assets - bundled in `assets/images/` and referenced from `index.html` and page styles
- Design reference assets - stored in `整體畫面圖/`
- Remote placeholder image host - `https://placehold.co/` for interim clerk images in `index.html`

## Configuration

**Environment:**

- Stylesheet compilation is configured in `.vscode/settings.json` for output to `/css`
- Fonts are loaded with `@font-face` from `assets/fonts/` in `css/base.scss`
- No environment variables, build scripts, or runtime config files were detected

**Build:**

- `.vscode/settings.json`
- `css/*.scss`
- `css/*.css`
- `css/*.css.map`

## Platform Requirements

**Development:**

- VS Code with the Live Sass Compile extension
- A browser that supports modern CSS layout and `touch*` events

**Production:**

- Static file hosting is sufficient
- No server-side runtime requirement was detected

---

_Stack analysis: 2026-04-17_
