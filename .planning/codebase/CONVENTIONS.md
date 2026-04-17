# Coding Conventions

**Analysis Date:** 2026-04-18

## Naming Patterns

**Files:**

- Page-specific styles use numeric filenames such as `css/page-0.css`, `css/page-3-modal.css`, compiled from SCSS sources.
- Shared styles split by concern: `css/base.css`, `css/pages.css`, `css/nav.css`.
- Script entry points use short purpose-based names such as `js/nav.js`.
- HTML uses a single `index.html` entry point.

**Functions:**

- JavaScript uses camelCase for function names: `goToPage()`, `openClerkModal()`, `closeClerkModal()` in `js/nav.js`.
- Global helpers exposed via `globalThis` are reserved for UI actions callable from inline HTML handlers, such as `globalThis.openClerkModal` and `globalThis.closeClerkModal`.
- Event listener callbacks are anonymous functions or arrow functions bound within addEventListener blocks.

**Variables:**

- JavaScript variables use camelCase: `currentPage`, `touchStartX`, `touchStartY`, `isHorizontalSwipe`, `clerkCard`, `clerkName`, `introData` in `js/nav.js`.
- Dataset hooks use kebab-case in markup and camelCase in JS access: `data-nav-target` → `dataset.navTarget`, `data-clerk-id` → `dataset.clerkId`, `data-page` → `dataset.page`.
- CSS custom properties use kebab-case: `--color-bg`, `--color-gold`, `--bp-mobile-max`, `--nav-height`, `--space-lg`, `--duration-fast`.

**Types:**

- Not applicable; the repository uses plain HTML/CSS/Vanilla JavaScript with no TypeScript or type definitions.

## Code Style

**Formatting:**

- HTML: Consistent indentation with meaningful section grouping in `index.html`. Semantic tags (`<section>`, `<div>`, `<button>`) used appropriately.
- CSS: Generated from SCSS sources using Live Sass Compile. Lowercase kebab-case selectors, custom properties centralized in `:root` of `css/base.css`.
- Compiled CSS source maps committed alongside generated CSS (e.g., `css/page-0.css.map`), indicating full Sass output pipeline is preserved.

**Linting:**

- Not detected in repository root. No ESLint, Prettier, Stylelint, or similar configuration files found.
- Code style enforced through manual review and consistent patterns observed in committed files.
- Only editor-level signal: `.vscode/settings.json` configures Live Sass Compile to output `/css` with `expanded` formatting.

## Import Organization

**Order:**

1. Shared styles loaded first in `index.html`: `css/base.css`, `css/pages.css`, `css/nav.css`.
2. Page-specific CSS files follow shared layer in numeric order: `css/page-0.css` through `css/page-8.css`.
3. Special overlays (e.g., `css/page-3-modal.css`) loaded immediately after their parent page.
4. Single script tag at bottom of `index.html` loads `js/nav.js` to ensure DOM is ready.

**Path Aliases:**

- Not detected. Code uses relative paths: `css/base.css`, `assets/images/about.png`, `js/nav.js`.

## Error Handling

**Patterns:**

- Defensive null checks before DOM manipulation: `if (!clerkCard) return;` in `js/nav.js`.
- Early returns guard against missing elements: `if (modal) { ... }` in `closeClerkModal()`.
- Dataset lookups prefer existence checks over try-catch for attribute access.
- Touch gesture detection uses null initialization to detect direction ambiguity: `isHorizontalSwipe = null` until threshold crossed.

## Logging

**Framework:**

- None detected in production code.

**Patterns:**

- No console logging present in checked files.
- Debugging performed manually through browser DevTools inspection.

## Comments

**When to Comment:**

- Section dividers in CSS (e.g., `/* ─── 底部導覽列容器 ─────────────────────────────── */` in `css/nav.css`).
- Intent markers for layout choices (e.g., gradient border technique in `css/nav.css`).
- Temporary development notes (e.g., placeholder color explanations in SCSS sources).
- Inline explanatory comments in `index.html` for page sections and modal markup.

**JSDoc/TSDoc:**

- Not detected; not applicable for vanilla JS.

## Function Design

**Size:**

- Functions are small and single-purpose: `goToPage()` handles page index calculation and nav state, `openClerkModal()` populates modal content and opens it, `closeClerkModal()` closes and resets.
- Touch handler logic separated into `touchstart`, `touchmove`, `touchend` event listeners rather than one monolithic block.

**Parameters:**

- Functions accept primitive values only: `goToPage(index)` takes a number, `openClerkModal(clerkId)` takes a number.
- No complex object destructuring; parameters are intentionally minimal.

**Return Values:**

- Most functions are imperative (void) and rely on DOM side effects.
- Control flow uses early returns to guard against missing elements: `if (!element) return;`.

## Module Design

**Exports:**

- No module system (ES6 modules, CommonJS) detected.
- `js/nav.js` wrapped in IIFE: `(function () { "use strict"; ... })()` for scope isolation.
- UI entry points exposed via `globalThis` for inline HTML access.

**Barrel Files:**

- Not detected.

## Accessibility (WCAG)

**ARIA Attributes:**

- `aria-current="page"` dynamically set on active navigation item in `goToPage()` function; removed from inactive items.
- `aria-hidden="false"` toggled on modals during open/close in `openClerkModal()` and `closeClerkModal()`.
- `aria-label="閱讀顧客守則"` applied to page-jump buttons with descriptive intent in `index.html`.

**Keyboard Navigation:**

- All interactive elements receive `tabindex="0"` or `role="button"` (e.g., `.home-entry`, `.about-cta`, page-jump buttons).
- Keyboard event listeners handle `Enter` and `Space` key presses for button-like divs: `if (e.key === "Enter" || e.key === " ")` in `js/nav.js`.
- Focus management handled by native browser default (tab order follows DOM).

**Semantic HTML:**

- Page sections marked with `<section>` tags; page identity stored in `id="page-N"` and `data-page="N"`.
- Modal markup uses semantic dialog-like structure with explicit close button.
- Icon elements use `stroke` and `fill` properties with `currentColor` for semantic color inheritance.

**Text & Color Contrast:**

- Primary text uses `--color-text: #ffffff` on `--color-bg: #0a0814` for high contrast.
- Secondary decorative gold (`--color-gold: #c9a84c`) used for accents, not primary content.
- Font sizes scale responsively via CSS variables (e.g., `--font-entry-fluid: clamp(1.725rem, 1.8vw, 1.16rem)`).

## Layout Conventions

**HTML Structure:**

- Single fixed `.viewport` containing horizontal `.track` with nine `.page` sections (IDs `page-0` through `page-8`).
- Page navigation via `data-target` and `data-nav-target` attributes instead of router state.
- Repeated page blocks use `id="page-N"` and `data-page="N"` for explicit page identity.

**CSS Structure:**

- Base layout in `css/base.css` and `css/pages.css`.
- Component-level styling in feature files: `css/nav.css`, `css/page-3.css`, `css/page-3-modal.css`.
- Selectors mostly class-based; occasional ID selectors for page-specific backgrounds (`#page-4`).

**Responsive Behavior:**

- Mobile breakpoint centralized: `--bp-mobile-max: 47.9375rem` in `css/base.css`.
- Page-specific mobile adjustments via media queries near affected component in each CSS file.
- Touch and scroll behavior controlled via JavaScript gesture detection in `js/nav.js`.

---

_Convention analysis: 2026-04-18_
