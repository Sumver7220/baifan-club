# Coding Conventions

**Analysis Date:** 2026-04-17

## Naming Patterns

**Files:**

- Page-specific styles use numeric filenames such as `css/page-0.scss`, `css/page-3-modal.scss`, and matching compiled outputs in `css/*.css` and `css/*.css.map`.
- Shared styles are split by concern: `css/base.scss`, `css/pages.scss`, and `css/nav.scss`.
- Script entry points use short purpose-based names such as `js/nav.js`.

**Functions:**

- JavaScript uses camelCase for function names, including `goToPage`, `openClerkModal`, and `closeClerkModal` in `js/nav.js`.
- Global helpers exposed through `globalThis` are reserved for UI actions that must be callable from inline handlers in `index.html`.

**Variables:**

- JavaScript variables use camelCase, such as `currentPage`, `touchStartX`, and `isHorizontalSwipe` in `js/nav.js`.
- Dataset hooks use kebab-case in markup and camelCase in JS access, such as `data-nav-target` -> `dataset.navTarget`.

**Types:**

- Not applicable; the repository is plain HTML/CSS/Vanilla JS with no TypeScript or type definitions detected.

## Code Style

**Formatting:**

- HTML uses consistent indentation and section grouping in `index.html`.
- CSS and SCSS use lowercase kebab-case selectors and custom properties in `:root`.
- Compiled CSS source maps are committed beside the generated CSS, indicating Sass output is part of the repository.

**Linting:**

- Not detected in the repository root. No ESLint, Prettier, Stylelint, or similar config files were found.
- The only editor-level styling signal is `.vscode/settings.json`, which configures Live Sass Compile output to `/css` with `expanded` formatting.

## Import Organization

**Order:**

1. Base document links in `index.html` load shared styles first: `css/base.css`, `css/pages.css`, then `css/nav.css`.
2. Page-specific CSS files follow the shared layers in numeric order from `css/page-0.css` through `css/page-8.css`.
3. The only script tag at the bottom of `index.html` loads `js/nav.js`.

**Path Aliases:**

- Not detected. The code uses relative paths such as `css/base.css`, `assets/images/about.png`, and `js/nav.js`.

## Error Handling

**Patterns:**

- JavaScript checks for missing elements before acting, for example `if (!clerkCard) return;` and `if (modal) { ... }` in `js/nav.js`.
- Modal and navigation actions are guarded by dataset lookups rather than hard-coded element references.

## Logging

**Framework:**

- None detected.

**Patterns:**

- No console logging pattern is present in the checked files.

## Comments

**When to Comment:**

- Comments are used as section dividers and intent markers, especially in CSS files such as `css/nav.scss`, `css/pages.scss`, `css/page-3.scss`, and `css/page-4.scss`.
- Some comments explain layout intent or temporary development placeholders, such as the placeholder page colors in `css/pages.scss`.
- Inline explanatory comments are present in `index.html` for page sections and modal markup.

**JSDoc/TSDoc:**

- Not detected.

## Function Design

**Size:**

- Functions are small and single-purpose in `js/nav.js`.
- Navigation logic, touch handling, and modal wiring are separated into distinct blocks rather than one monolithic handler.

**Parameters:**

- Functions accept primitive values only, such as the page index in `goToPage(index)` and clerk identifiers in `openClerkModal(clerkId)`.

**Return Values:**

- Most functions are imperative and return nothing; control flow relies on DOM updates and early returns.

## Module Design

**Exports:**

- There is no module system detected. `js/nav.js` is a standalone script.
- UI entry points that need HTML inline access are attached to `globalThis`.

**Barrel Files:**

- Not detected.

## Layout Conventions

**HTML Structure:**

- `index.html` uses a single fixed `.viewport` containing a horizontal `.track` with nine `.page` sections.
- Page navigation is wired through `data-target` and `data-nav-target` attributes instead of router state.
- Repeated page blocks use `id="page-N"` and `data-page="N"` for explicit page identity.

**CSS Structure:**

- Base layout lives in `css/base.scss` and `css/pages.scss`.
- Component-level styling uses feature files such as `css/nav.scss`, `css/page-3.scss`, and `css/page-3-modal.scss`.
- Selectors are mostly class-based, with occasional ID selectors for page-specific backgrounds like `#page-4`.

**Responsive Behavior:**

- Mobile breakpoints are centralized around `--bp-mobile-max` in `css/base.scss`.
- Page-specific mobile adjustments are handled inside each SCSS file with media queries near the component they affect.

---

_Convention analysis: 2026-04-17_
