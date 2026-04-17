# Stack Research: Vite Migration & RWD Refactor

**Project:** 白飯俱樂部 — Static HTML/SCSS/JS Club Website  
**Domain:** Vanilla static site with full-screen horizontal-scroll layout + responsive typography  
**Researched:** 2026-04-18  
**Confidence:** HIGH (established patterns, verified with project codebase structure)

---

## Executive Summary

Your project moves from VS Code Live Sass (editor-only, non-reproducible) to **Vite 5.x** as your build orchestrator. Vite provides:
- SCSS compilation (via `sass` native package)
- Asset bundling and hashing
- HMR (hot module reload) during development
- Optimized static output for production

**Fluid typography** uses CSS `clamp()` (already partially implemented in your `base.scss`). This approach is superior to viewport units alone because it provides a smooth scaling curve instead of jarring breakpoint jumps.

**Full-screen horizontal scroll layout** is handled via your existing `track` + `page` CSS and vanilla touch/keyboard JS — Vite doesn't change this architecture. Focus is on CSS refinement for 320px–2560px viewport ranges.

---

## Recommended Stack

### Core Build & SCSS

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vite** | 5.0+ | Build tool, dev server, asset bundling | Industry standard for static sites in 2025. Replaces Live Sass dependency. Near-zero config for vanilla projects. Fast HMR. |
| **Sass (sass package)** | 1.68+  | SCSS → CSS compilation | Official Dart Sass implementation (CommonJS & ESM). Vite integrates natively via `import.meta.glob()` or PostCSS preset. Recommended over `node-sass` (deprecated). |
| **PostCSS** | 8.4+ | CSS autoprefixing, modern CSS support | Vite includes by default. Enables vendor prefixes for `clamp()`, `backdrop-filter`, `100dvh`. Optional but recommended. |

### Runtime & Assets

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vanilla JavaScript (ES2020+)** | native | Page navigation, modal, touch gestures | Your existing approach. No framework overhead. 100% compatible with Vite. |
| **CSS Custom Properties (CSS Variables)** | native | Centralized design tokens (colors, spacing, fluid scales) | Already in use in `base.scss`. Enables systematic `clamp()` scaling. |
| **CSS `clamp()` function** | native | Fluid typography & spacing scaling | Supported in all modern browsers (Chrome 79+, Firefox 75+, Safari 15+). No polyfill needed for modern target. Replaces media query breakpoint cascades. |

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| **Node.js** | 18.x LTS or 20.x LTS | Runtime for Vite, npm packages | Required. 18.x is stable baseline; 20.x is current LTS (Feb 2025). |
| **npm** | 9.0+ | Package manager | Included with Node.js. Handles `package.json`, lockfile, scripts. |
| **VS Code settings.json** | — | Editor configuration | Replace Live Sass config with npm scripts (Vite commands). |

---

## Installation & Configuration

### 1. Initialize Node/npm (if not present)

```bash
# Check if package.json exists
ls package.json || npm init -y

# This creates package.json with a minimal structure
```

### 2. Install Core Dependencies

```bash
# Core build tools
npm install -D vite@5.0 sass@1.68

# Optional: PostCSS for vendor prefixes (recommended)
npm install -D postcss autoprefixer
```

### 3. Create `vite.config.js`

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  root: './', // Site root (where index.html lives)
  publicDir: 'assets', // Static assets (fonts, images)
  
  build: {
    outDir: 'dist', // Output directory for production build
    emptyOutDir: true, // Clear dist/ before building
    minify: 'terser', // Minify CSS & JS for production
    
    // Source maps for debugging (disable in production for size)
    sourcemap: false,
    
    // Asset hashing for cache busting
    rollupOptions: {
      input: 'index.html',
    },
  },

  server: {
    port: 5173, // Dev server port (default)
    open: true, // Auto-open browser on `npm run dev`
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Optional: configure Sass options
        // quietDeps: true, // Suppress @import warnings
      },
    },
  },
})
```

### 4. Create `postcss.config.js` (optional but recommended)

```javascript
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions', 'not dead']
    }
  }
}
```

### 5. Update `package.json` scripts

```json
{
  "name": "baifan-club",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "sass": "^1.68.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 6. Refactor CSS Imports in `index.html`

Change from:
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/nav.css">
<!-- ... compiled .css files ... -->
```

To:
```html
<!-- Single SCSS entry point (Vite bundles & compiles) -->
<link rel="stylesheet" href="css/main.scss">
```

Then create `css/main.scss`:
```scss
// css/main.scss - Entry point
@import 'base';
@import 'pages';
@import 'nav';
@import 'page-0';
@import 'page-1';
@import 'page-2';
// ... etc for pages 3-8
@import 'page-3-modal';
```

### 7. Update `.vscode/settings.json`

Remove Live Sass config:
```json
{
  "editor.formatOnSave": true,
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[html]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
```

---

## CSS Refactoring for RWD (Fluid Typography)

Your `base.scss` already uses `clamp()` for some properties. Expand this systematically:

### Pattern: Fluid Typography

```scss
// base.scss - Replace fixed font sizes with clamp()

:root {
  // Old approach (breakpoint-dependent):
  // --font-xs: 0.5625rem;
  // --font-base: 1rem;
  // --font-hero: 3rem;
  
  // New approach (fluid scaling):
  // clamp(min-value, preferred-value, max-value)
  // Preferred value uses viewport width (vw) for linear scaling
  
  --font-xs: clamp(0.5rem, 1.5vw, 0.75rem);      // 320px → 2560px
  --font-base: clamp(0.875rem, 2vw, 1.125rem);   // 320px → 2560px
  --font-hero: clamp(1.5rem, 8vw, 4rem);         // Scales with viewport
  
  // Existing good examples to keep:
  --font-entry-fluid: clamp(1.725rem, 1.8vw, 1.16rem); // ✓ Good
  --font-lead-fluid: clamp(0.9rem, 1.6vw, 1.1rem);     // ✓ Good
}
```

### Pattern: Fluid Spacing

```scss
// For margins/padding that scale with viewport:
--space-content: clamp(1rem, 4vw, 3rem);
--space-hero-block: clamp(2rem, 6vw, 5rem);

// Usage in page styles:
.page-hero {
  padding-block: var(--space-hero-block);
  padding-inline: var(--space-content);
}
```

### Pattern: Viewport Breakpoints (Keep minimal)

```scss
// Mobile-first approach with media queries for exceptional cases
$breakpoint-tablet: 48rem;   // 768px - iPad and up
$breakpoint-desktop: 64rem;  // 1024px - Standard desktop and up
$breakpoint-4k: 160rem;      // 2560px - 4K monitors

// Prefer clamp() over media queries when possible
// Only use media queries for layout shifts (e.g., nav position changes)
@media (max-width: $breakpoint-tablet) {
  :root {
    --nav-height: 4.5rem; // Smaller nav on mobile
  }
}
```

### Anti-Pattern: Avoid These

```scss
// ❌ DON'T: Fixed pixel sizes that don't scale
.headline { font-size: 3rem; }

// ❌ DON'T: Viewport units without limits
.headline { font-size: 10vw; } // Too small at 320px, too large at 4K

// ✓ DO: Bounded fluid scaling with clamp()
.headline { font-size: clamp(1.5rem, 10vw, 4rem); }
```

---

## File Structure After Migration

```
baifan-club/
├── index.html                 # Entry point (references css/main.scss)
├── js/
│   └── nav.js                # Vanilla JS (no changes needed)
├── css/
│   ├── main.scss             # ← NEW: Entry point for SCSS
│   ├── base.scss             # Global styles, CSS variables, fonts
│   ├── pages.scss            # Layout grid, page containers
│   ├── nav.scss              # Navigation styles
│   ├── page-0.scss to page-8.scss  # Page-specific styles
│   ├── page-3-modal.scss     # Modal styles
│   └── (no more .css or .css.map files)
├── assets/
│   ├── fonts/                # Local font files (unchanged)
│   └── images/               # Images (unchanged)
├── dist/                      # ← NEW: Generated by `npm run build`
├── node_modules/             # ← NEW: npm packages
├── package.json              # ← NEW: npm manifest
├── package-lock.json         # ← NEW: Dependency lock
├── vite.config.js            # ← NEW: Vite configuration
└── postcss.config.js         # ← Optional: PostCSS config
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Vite 5.x** | Webpack 5 | If you need complex code-splitting (you don't). Webpack is overkill for static sites. |
| **Vite 5.x** | Parcel 2 | If you want zero-config bundling. Parcel is slower and has fewer Vite-like optimizations. Vite is faster. |
| **Sass (Dart)** | LESS | If team already knows LESS syntax. Sass is more powerful (functions, mixins, nesting). De facto standard in 2025. |
| **CSS `clamp()`** | CSS Media Queries | Media queries create breakpoint cliffs (reflow at exact widths). `clamp()` scales smoothly across viewport range. Use both: `clamp()` for typography, media queries for layout shifts. |
| **PostCSS** | No autoprefixer | If targeting only modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 15+). You're targeting that — PostCSS is optional but recommended for vendor prefixes on `backdrop-filter`, custom properties, etc. |
| **Vanilla JS** | htmx / Alpine | Your project doesn't need interactivity beyond navigation & modals. Vanilla JS handles this. Frameworks add unnecessary bytes. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **VS Code Live Sass extension** | Non-reproducible builds. Can't be replicated in CI/CD or on other machines. Creates maintenance debt. | Vite + Sass package (CLI-driven, reproducible) |
| **Webpack** | Overkill for static sites. Slow dev server (legacy HMR). Complex config. | Vite (designed for modern workflows) |
| **Bootstrap / Tailwind CSS** | Adds 50-100kb of utilities you won't use. Conflicts with your custom design system (CSS variables, bespoke layout). | Keep your custom SCSS (already well-organized) |
| **CSS-in-JS (Styled Components, etc.)** | Requires a JS runtime/framework. You're vanilla. Adds runtime overhead. | Plain CSS/SCSS (appropriate for static site) |
| **Autoprefixer at build time** | Older approach (now handled by PostCSS + Vite). | PostCSS plugin (modern approach) |
| **Fixed font sizes** | Don't scale across viewport range (320px–2560px). Creates jarring reflows at breakpoints. | CSS `clamp()` with fluid scaling |
| **`node-sass` package** | Deprecated and archived (npm). Slow (C++ binding). | `sass` package (Dart Sass, official, fast, actively maintained) |

---

## Stack Patterns by Variant

### If you want ZERO new tooling overhead:
- Keep Live Sass Compiler extension
- **Problem:** Not reproducible, fragile on team projects
- **Our recommendation:** Accept small Vite learning curve. Payoff: reproducibility, CI/CD ready, faster dev server

### If you want asset optimization (image lazy-loading, font preloading):
- Add `vite-plugin-compression` for Gzip/Brotli
- Add explicit `<link rel="preload">` for custom fonts in `index.html`
- Vite handles the rest automatically
- **Recommendation:** Do this in Phase 2 (after Vite migration works)

### If you want framework flexibility later:
- Don't commit to framework now
- Vite config is framework-agnostic (works with Vue, React, Svelte, Astro later if needed)
- **Recommendation:** You're not adding a framework. Vite is framework-neutral.

---

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| vite | 5.0+ | Node 18+ | Vite 5 dropped support for Node <18.x. Match your Node version. |
| sass | 1.68+ | vite 5.x | Dart Sass latest. No breaking changes expected in next 12 months. |
| postcss | 8.4+ | vite 5.x + sass | Autoprefixer requires PostCSS 8.x. Compatible with all recent Node versions. |
| autoprefixer | 10.4+ | postcss 8.4+ | Targets last 2 browser versions by default. Matches your modern browser target. |
| Node.js | 18.x LTS or 20.x LTS | All above | Use LTS versions for production. 20.x is current (Feb 2025). 18.x is stable baseline. |

### Known Issues
- **None** for this stack combination. Vite + Sass + vanilla JS is a stable, well-tested combination.
- Potential issue if you use `import.meta.glob()` for dynamic imports: Not needed for your static site. Safe to ignore.

---

## Development Workflow After Migration

### Before (Live Sass)
```
1. Edit .scss file in VS Code
2. Live Sass extension watches for changes
3. Compiles to .css (non-deterministic, depends on VS Code state)
4. Reload browser manually
5. Commit both .scss and .css to git (source + generated)
```

### After (Vite)
```
1. Run: npm run dev
2. Vite dev server starts on http://localhost:5173
3. Edit .scss file
4. Vite auto-compiles, triggers HMR
5. Browser refreshes automatically (no manual refresh)
6. Commit only .scss to git (Vite generates .css at build time)
7. Production: npm run build → creates dist/ folder
8. Deploy dist/ folder to static host
```

---

## Installation Checklist

- [ ] `node --version` confirms Node 18.x or 20.x installed
- [ ] `npm init -y` creates package.json
- [ ] `npm install -D vite@5.0 sass@1.68 postcss autoprefixer`
- [ ] Create `vite.config.js` (provided above)
- [ ] Create `postcss.config.js` (provided above)
- [ ] Refactor `index.html` to import `css/main.scss` instead of individual .css files
- [ ] Create `css/main.scss` entry point that imports all SCSS partials
- [ ] Update `.vscode/settings.json` to remove Live Sass config
- [ ] Update `package.json` scripts: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`
- [ ] Test: `npm run dev` → site loads at localhost:5173
- [ ] Test: `npm run build` → creates dist/ folder with minified CSS/JS
- [ ] Delete old .css files (no longer needed after Vite build)
- [ ] Commit vite.config.js + postcss.config.js + updated package.json
- [ ] `.gitignore` includes: `node_modules/`, `dist/`, `.env.local`

---

## Next Steps: RWD Refinement

After Vite is working:

1. **Audit viewport ranges** (320px, 768px, 1024px, 1440px, 2560px)
   - Test at each breakpoint with browser DevTools
   - Identify text overflow, image distortion, nav issues

2. **Refine `clamp()` scaling**
   - Adjust min/max values based on testing
   - Example: if hero text looks too large at 4K, increase min value or decrease vw percentage

3. **Optimize images** (Phase 2)
   - Replace `placehold.co` with local assets (mentioned in PROJECT.md)
   - Consider `<picture>` element for art-directed responsive images
   - Lazy-load offscreen images (native `loading="lazy"`)

4. **Font preloading** (Phase 2)
   - Add `<link rel="preload" href="assets/fonts/..." as="font" crossorigin>`
   - Reduces font load flicker

---

## Sources

- **Vite Official Docs** (vite.dev) — Static site configuration, SCSS preprocessing, build config  
  **Confidence:** HIGH — Authoritative source, Feb 2025

- **Sass Official Docs** (sass-lang.com) — Dart Sass package, SCSS syntax, mixins  
  **Confidence:** HIGH — Official reference, currently maintained

- **MDN Web Docs** — CSS `clamp()`, viewport units, modern CSS features  
  **Confidence:** HIGH — Authoritative web standards documentation

- **Project codebase analysis** — Existing SCSS structure, CSS variables, typography patterns  
  **Confidence:** HIGH — Direct inspection of your files

---

**Stack research for:** Vite migration + RWD refactor  
**Researched:** 2026-04-18  
**Status:** Ready for Phase implementation
