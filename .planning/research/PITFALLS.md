# Pitfalls Research: RWD Refactor + Vite Migration

**Domain:** Static site RWD refactor, Vite build tool migration, responsive typography
**Researched:** 2026-04-18
**Confidence:** MEDIUM (training data + codebase analysis; WebSearch unavailable for current verification)

## Critical Pitfalls

### Pitfall 1: Horizontal Scrolling Trapped by `overflow: hidden` in RWD

**What goes wrong:**
Your site uses `overflow: hidden` on the viewport to prevent vertical scroll and maintain the "no-scroll" desktop experience. When adding RWD, mobile users may pinch-zoom or have larger default font sizes, causing content to overflow — but `overflow: hidden` silently clips or crushes content without warning. Users see cut-off text, buttons, or images; on some mobile browsers, the hidden overflow also prevents the browser from reporting proper viewport dimensions.

**Why it happens:**
The current design assumes a consistent aspect ratio and fixed-height pages (9 full-screen slides). Responsive design introduces variable content heights and zoom expectations. Developers often forget that `overflow: hidden` was a layout constraint, not a responsive feature.

**How to avoid:**
1. **Audit overflow cascade:** Before RWD, explicitly decide per breakpoint whether `overflow: hidden` is needed. Desktop may need it; mobile might benefit from `overflow: auto` or no overflow rule.
2. **Use CSS containment:** Consider `contain: layout` for performance; it doesn't force hidden overflow.
3. **Test pinch-zoom:** On iOS and Android, zoom to 200% and verify all content is reachable. Text should reflow, not clip.
4. **Height flexibility:** Replace fixed `height` with `min-height` or use flexbox/grid `flex: 1` so content can grow.
5. **Mobile-first breakpoint:** Set `overflow: visible` as the default (mobile), then `overflow: hidden` only on `@media (min-width: 769px)` if needed for desktop.

**Warning signs:**
- Text or button labels truncated on mobile with no scroll hint
- Pinch-zoom reveals clipped content (sign that `overflow: hidden` is too aggressive)
- WCAG accessibility validator flags "content not reachable" on mobile
- Android users report cut-off navigation or footer on certain screen sizes

**Phase to address:**
Phase 2 (RWD Implementation) — Must test overflow behavior at all breakpoints before visual polish. This is a blocking issue for desktop and mobile layouts.

---

### Pitfall 2: Vite SCSS Module Boundary `@use` vs `@import` Confusion

**What goes wrong:**
Live Sass Compiler (your current tool) compiles each SCSS file independently and doesn't enforce Sass 2020+ module semantics. When you migrate to Vite (which uses Dart Sass by default), **every `@import` in a file scope triggers re-evaluation of that module's dependencies**. This means:
- Variables, mixins, and functions defined in one file may shadow or conflict in another
- `!default` flags on variables no longer work as expected (they conflict across module boundaries)
- Global mixins applied to all subsequent imports can cause style bloat or specificity wars
- CSS custom properties (which *are* global) get mixed with Sass variables (which should be local to modules), causing confusion about what's cascading

**Why it happens:**
Live Sass compiled files in isolation. Vite's Vite + Dart Sass treats `@import` as "copy-paste this file," which evaluates all nested imports in the new context. The migration feels like a simple upgrade, but the mental model shifts from "isolated compilation" to "module graph."

**How to avoid:**
1. **Migrate `@import` to `@use`:** Replace all `@import` with `@use ... as namespace`. This is mandatory for Dart Sass 1.0+.
   - Old: `@import 'variables';` 
   - New: `@use 'sass:color' as color;` or `@use './variables' as vars;`
2. **Audit variables for shadowing:** In `css/pages.scss` (lines 15, 34 reference page count), ensure no file redefines the same variable. Namespace them instead.
3. **Use `@forward` for re-exports:** If you need a shared variables file, use `@forward 'variables';` at barrel-file level instead of repeating imports.
4. **CSS custom properties for runtime:** Keep dynamic values (colors, spacing) as CSS custom properties (`:root { --color-gold: ... }`), not Sass variables. This survives the module boundary transition cleanly.
5. **Test each SCSS file in isolation first:** After migration, compile each page's SCSS and verify it still produces the same output. Use `vite build` and inspect generated CSS.

**Warning signs:**
- Variables change value between pages (e.g., `--space-lg` in page-0 is different from page-3)
- Duplicate CSS rules appear in the compiled output (sign of multiple `@import` evaluations)
- Vite build succeeds, but page colors or spacing are wrong in browser
- Mixins applied to unintended selectors across files

**Phase to address:**
Phase 1 (Vite Setup & Config) — Must resolve all SCSS imports before build succeeds. This is a blocking gate for any CSS work downstream.

---

### Pitfall 3: Vite Asset Path Resolution Breaks Image and Font Refs

**What goes wrong:**
Live Sass doesn't handle asset bundling. When you reference an image in CSS or HTML, the path is static: `url('assets/images/about.png')` just works. Vite, by contrast, **hashes and moves assets**, so a path like `assets/images/about.png` might become `assets/images/about-a3f2d8e.png`. 

If you:
1. Hardcode asset paths in CSS (`background-image: url('assets/...')`)
2. Use relative paths that don't account for build output structure
3. Don't configure Vite's `base` option for your deployment path

Then Vite will either fail to find the asset or produce a 404 at runtime.

**Why it happens:**
Live Sass is a pass-through compiler. Vite is a bundler that optimizes by hashing and reorganizing. Developers often assume "it compiles, so paths must be right," without understanding that Vite's final structure is different from the source structure.

**How to avoid:**
1. **Use Vite's import system for assets:**
   ```scss
   // Instead of url('assets/images/about.png')
   @import url('./assets/images/about.woff2'); // for fonts
   
   // In CSS, let Vite handle the path:
   background-image: url('./assets/images/about.png'); // relative from CSS file
   ```
2. **Configure `base` in `vite.config.js`:**
   ```javascript
   export default {
     base: process.env.PUBLIC_URL || '/',
     // ... rest of config
   }
   ```
3. **Test asset loading in dev and prod:** Run `vite dev` and verify images load; then `vite build` and check that the built HTML still finds images with hashed paths.
4. **Use import statements for critical assets:**
   ```javascript
   import aboutImage from './assets/images/about.png?url';
   // Now aboutImage contains the hashed, correct path
   ```

**Warning signs:**
- `vite build` succeeds but images show 404 in browser
- Dev server (`vite dev`) shows images, but production doesn't
- Vite console warnings: "Unable to find asset" or "build target not found"
- Image paths in built CSS don't match actual file locations in dist/

**Phase to address:**
Phase 1 (Vite Setup & Config) — Must configure asset paths correctly in `vite.config.js` and test before any content goes live. This is a deployment blocker.

---

### Pitfall 4: `clamp()` Typography Min/Max Bounds Too Aggressive for 320px Mobile

**What goes wrong:**
`clamp(min, preferred, max)` looks elegant in theory:
```css
font-size: clamp(1rem, 2vw, 2.5rem);
```
But if your "min" is too large for mobile, text becomes unreadable or overflows. Common mistakes:
1. **Min too high:** `clamp(1.2rem, ...)` on a 320px phone with body text = text larger than container width
2. **Preferred (vw) scales past breakpoints:** `2vw` on a 4K screen (2560px) = 51.2px, which is huge for body copy
3. **Max too low:** `clamp(..., 2rem)` caps all text, making 4K feel cramped

The site's current goal is to fix 4K being too small. If you set `clamp(..., 2.5rem)` as max, you've solved 4K but now mobile might be unreadable or overflow.

**Why it happens:**
`clamp()` requires three parameters with no built-in validation. Developers often pick "reasonable" values without testing at the actual extremes (320px, 2560px). The formula `preferred = viewport%` is tempting but doesn't account for font rendering quirks or container constraints.

**How to avoid:**
1. **Define a clamp matrix for your content:** For each text role (h1, body, nav, etc.), test at 320px, 768px, 1920px, and 2560px. Log actual computed sizes.
   ```
   h1: 320px → 1.8rem | 768px → 2.2rem | 1920px → 2.8rem | 2560px → 3.2rem
   body: 320px → 1rem | 768px → 1.1rem | 1920px → 1.15rem | 2560px → 1.25rem
   ```
2. **Use container queries for mobile-first clamp:** Instead of viewport-based `vw`, use `cqw` (container query width) if supported, or stick to CSS media queries.
3. **Test reading comfort, not just fit:** Does the text at 320px min actually render clearly? At 4K max, is it readable from a couch?
4. **Preserve zoom accessibility:** Verify that browser zoom (not pinch-zoom) still works. Some clamp formulas break when user zooms. Test `Ctrl++` / `Cmd++` in Chrome/Firefox.
5. **Avoid `clamp()` for line-height or letter-spacing:** These are more brittle. Stick to fixed values or media query breakpoints.

**Warning signs:**
- Text overlaps or overflows on 320px devices
- 4K text is still too small (clamp max is capped too low)
- User zoom at 150% causes text to collide with buttons
- Headings on mobile are taller than viewport height (sign of aggressive min)

**Phase to address:**
Phase 2 (RWD Implementation) — Typography must be finalized during breakpoint testing. Changing clamp() values later requires re-testing all breakpoints.

---

### Pitfall 5: Viewport Unit Chaos in SCSS: `100vh` vs `100dvh` vs `100%` in Mobile Context

**What goes wrong:**
Your site uses full-screen pages. In CSS, you might set:
```scss
.viewport {
  height: 100vh; // 100% of visual viewport
}
```
On desktop, this works. On mobile with a browser URL bar, `100vh` is **taller than the visible area**. When the URL bar hides (on scroll), the height changes, causing layout shift. Worse:
- iOS Safari: `100vh` includes the address bar even after it collapses, creating invisible overflow
- Android Chrome: `100vh` changes as the URL bar slides in/out, triggering reflows
- The new `100dvh` (dynamic viewport height) fixes this but is only ~90% supported as of 2025

Your horizontal-slide container with `overflow: hidden` + `height: 100vh` can create a situation where content is clipped unexpectedly on mobile, or the page "jumps" as the URL bar appears/disappears.

**Why it happens:**
`100vh` was standardized before browsers had collapsible address bars. The newer `100dvh` (and `dvh`, `dvw`, `dvi`) attempt to fix this, but not all browsers support them yet. Developers often code on desktop where the distinction doesn't matter, then ship to mobile where it breaks.

**How to avoid:**
1. **Use `100dvh` with fallback:**
   ```scss
   .viewport {
     height: 100dvh;
     // Fallback for older browsers
     @supports not (height: 100dvh) {
       height: 100vh;
     }
   }
   ```
2. **Prefer flexbox/grid instead of viewport units:** Let the layout adapt naturally:
   ```scss
   body {
     display: flex;
     flex-direction: column;
     min-height: 100svh; // 100% small viewport height (safe)
   }
   ```
3. **Test on real mobile devices:** Emulator URL bars don't always behave like real browsers. Test iOS Safari and Android Chrome with the actual address bar hiding/showing.
4. **Avoid `height: 100vh` on scroll containers:** Use `max-height` or `flex: 1` instead. For your horizontal scroll container, consider:
   ```scss
   .track {
     display: flex;
     width: 100%;
     min-height: 100dvh; // or use flex: 1 on parent
   }
   ```
5. **Use CSS custom properties to isolate the value:**
   ```scss
   :root {
     --viewport-height: 100dvh;
     --viewport-height-fallback: 100vh;
   }
   .viewport {
     height: var(--viewport-height);
     @supports not (height: 100dvh) {
       height: var(--viewport-height-fallback);
     }
   }
   ```

**Warning signs:**
- Mobile layout shifts when scrolling (URL bar hiding/showing causes reflow)
- Content appears clipped on mobile even with `overflow: hidden` off
- Horizontal scroll container jumps vertically when swiping
- iOS users report white space at bottom of page (sign of `100vh` being too tall)

**Phase to address:**
Phase 2 (RWD Implementation) — Must test viewport unit behavior on actual mobile devices during breakpoint validation. Cannot be deferred to later phases.

---

### Pitfall 6: Hard-Coded Page Count (9) Breaks When Refactoring Layout Structure

**What goes wrong:**
Your codebase has the page count hard-coded in multiple places:
- `css/pages.scss#L15` and `L34` (likely `width: calc(100% / 9)` or similar)
- `js/nav.js#L97` and `L100` (likely `pages.length` or manual `9` in bounds checks)

When you refactor the layout during RWD work (e.g., stacking pages on mobile instead of horizontal scroll, or dynamically loading pages), you'll need to update all these references. If you miss even one, the layout breaks silently:
- Navigation wraps to wrong page
- Swipe bounds are off
- CSS grid/flex layout miscalculates width

**Why it happens:**
The original site was built with a fixed 9-page assumption. During RWD refactor, developers focus on CSS media queries and forget to audit the JavaScript and SCSS for hard-coded values. By the time you notice, you've already committed code that references the wrong page count.

**How to avoid:**
1. **Extract page count to a single source of truth in Phase 1:**
   ```javascript
   // js/constants.js
   export const TOTAL_PAGES = document.querySelectorAll('[data-page]').length;
   // or, if using data attributes:
   export const TOTAL_PAGES = 9; // defined once, imported everywhere
   ```
2. **Replace all magic numbers:**
   - In `js/nav.js`: Replace `97` and `100` with `TOTAL_PAGES` from constants
   - In `css/pages.scss`: Use CSS custom properties:
     ```scss
     :root {
       --page-count: 9;
     }
     .page {
       width: calc(100% / var(--page-count));
     }
     ```
3. **Audit during code review:** Search codebase for hardcoded `9` before any refactoring. Flag each occurrence.
4. **Add a build-time assertion:** If using Vite, add a simple check:
   ```javascript
   const domPageCount = document.querySelectorAll('[data-page]').length;
   console.assert(domPageCount === TOTAL_PAGES, `Page count mismatch: DOM has ${domPageCount}, expected ${TOTAL_PAGES}`);
   ```

**Warning signs:**
- Navigation jumps to wrong page on some clicks
- Last page is unreachable or skips a page
- Horizontal scroll container width is incorrect (can see blank space or content overflow)
- Console error: "Cannot read property of undefined" when accessing page array

**Phase to address:**
Phase 1 (Vite Setup & Code Refactor) — Must extract page count before any RWD work. This is foundational and blocks navigation testing.

---

### Pitfall 7: Global Event Handlers (`globalThis`) Leak Into Closures During Refactor

**What goes wrong:**
Your site exposes `globalThis.openClerkModal` and `globalThis.closeClerkModal` for inline HTML handlers. When you refactor JavaScript during the Vite migration:
1. You might accidentally create a second instance of the handler (e.g., if two event listeners are set up)
2. The modal state (currently open/closed) gets out of sync with the DOM
3. Multiple modals might open simultaneously or one might not close
4. Keyboard event listeners (Enter, Space) conflict with the global handlers

This is especially dangerous because it works *sometimes* (single modal opens fine) but breaks when there's rapid user interaction.

**Why it happens:**
Global handlers are convenient initially but become fragile during refactoring. When you introduce Vite's module isolation, you're no longer guaranteed that `globalThis` modifications happen in a single scope. If a module redefines the handler or if multiple modules register listeners, you get unexpected behavior.

**How to avoid:**
1. **Migrate to delegated event listeners in Phase 1:**
   ```javascript
   // Old (fragile):
   globalThis.openClerkModal = (clerkId) => { /* ... */ };
   // In HTML: <button onclick="globalThis.openClerkModal(3)">Open</button>
   
   // New (robust):
   document.addEventListener('click', (e) => {
     const clerkButton = e.target.closest('[data-open-modal]');
     if (clerkButton) {
       const clerkId = clerkButton.dataset.clerkId;
       openClerkModal(clerkId); // module-scoped function
     }
   });
   ```
2. **Use a state manager (even minimal):** Track modal state in a single object:
   ```javascript
   const modal = {
     open: false,
     currentClerkId: null,
     toggle(clerkId) {
       if (this.open && this.currentClerkId === clerkId) {
         this.close();
       } else {
         this.open = true;
         this.currentClerkId = clerkId;
       }
     },
     close() {
       this.open = false;
       this.currentClerkId = null;
     }
   };
   ```
3. **Remove inline event handlers from HTML:** Replace `onclick="..."` with `data-*` attributes and JavaScript event delegation.
4. **Test state isolation:** Verify that opening one modal, then opening another, doesn't leave the first open.

**Warning signs:**
- Modal stays open after clicking close
- Two modals appear simultaneously
- Page freezes or is unresponsive after modal interaction
- Browser console: "handler is not a function" errors

**Phase to address:**
Phase 1 (Vite Setup & Code Refactor) — Must move away from `globalThis` handlers before Vite modularization. This is a pre-migration requirement.

---

### Pitfall 8: SCSS `$variable` Scope Collisions When Using `@use` Namespaces

**What goes wrong:**
Sass variables are module-scoped in `@use`. If your current SCSS uses `$color-gold`, `$spacing-lg`, etc., and you naively add `@use 'sass:color'` or `@use './variables' as vars`, you now have two ways to reference colors:
1. Your old `$color-gold` (from an old `@import`)
2. The new `vars.$color-gold` (from `@use ... as vars`)

This creates confusion and inconsistency:
- Some files use `$color-gold`, others use `vars.$color-gold`
- Build tools can't tell which is "correct"
- When you later delete the old import, half your files break

Worse, if a global import like `@import 'sass:color'` is included in every file, Sass will include the entire color module in your compiled CSS multiple times, bloating the final output.

**Why it happens:**
The migration from `@import` to `@use` is gradual in practice. You don't do it all at once. So you end up with a mix of old and new syntax in the same codebase, and it works (Sass is forgiving), but it's confusing.

**How to avoid:**
1. **Do a full `@import` → `@use` migration in one phase:** Don't do it file-by-file. Change the entire SCSS structure at once, then test.
2. **Create a barrel file for shared variables:**
   ```scss
   // scss/exports.scss
   @forward 'colors' as color-*;
   @forward 'spacing' as space-*;
   @forward 'typography' as type-*;
   
   // Now import once in every page:
   @use './exports' as *; // or @use './exports' as app-*;
   // Use: color-gold, space-lg, type-heading
   ```
3. **Establish a naming convention:** Decide early whether you're using `vars.$name` or `$name` style, then enforce it globally.
4. **Audit the compiled CSS:** After migration, look at the final `dist/style.css` (or page-specific CSS files) and verify there's no duplicate rules or oversized output.

**Warning signs:**
- SCSS compiler warnings about duplicate rules or unused variables
- Compiled CSS file size is larger than expected
- Some files use `$var` syntax, others use `vars.$var` (inconsistency)
- Color or spacing values are different between pages (e.g., gold is slightly different shades)

**Phase to address:**
Phase 1 (Vite Setup & Config) — Must standardize `@use` imports and namespaces before building. This prevents style inconsistencies downstream.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep all 9 pages in single HTML | Fast initial load, simple to reason about | Hard to refactor, slow on slow connections, hard to test individual pages | Only for this MVP (< 3K LOC) |
| Use `overflow: hidden` globally | Achieves "no scroll" desktop feel quickly | Breaks responsive design, requires complex workarounds for mobile | Never; must be breakpoint-aware |
| Hard-code page count (9) in CSS/JS | Avoids extra config, quicker to code | Can't add/remove pages without multiple edits; breaks during refactor | Never; extract to constant immediately |
| Inline `onclick="globalThis.fn()"` handlers | Quick to wire up interactivity, no build step needed | Breaks during module refactor, hard to test, breaks accessibility | Only for prototypes; must be removed before production |
| Mix old `@import` with new `@use` SCSS | Gradual migration, don't need to refactor all files at once | Creates style inconsistencies, bloats compiled output, confuses maintainers | Never; do full migration in one phase |
| Use `clamp()` without testing extremes | Elegant CSS, feels "responsive" without media queries | Text overflows on mobile, too small on 4K, breaks with zoom | Only if extensively tested at 320px, 2560px, and zoom levels |
| Asset paths relative to HTML instead of CSS | Works in simple projects, easy to reason about | Breaks in Vite (paths are hashed), requires build changes | Never; use proper asset import system from day one |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Vite + SCSS** | Assuming `@import` works the same as before | Must migrate to `@use` and manage namespaces; test compiled CSS output |
| **Vite + Asset Paths** | Hard-coding paths like `url('assets/images/...')` | Use relative paths from CSS file; let Vite's bundler handle hashing and placement |
| **Vite + HTML Inline Event Handlers** | Keeping `onclick="globalThis.fn()"` style handlers | Migrate to delegated event listeners and data attributes; test state isolation |
| **SCSS + CSS Custom Properties** | Mixing Sass variables (`$var`) with CSS vars (`--var`) inconsistently | Use CSS vars for runtime values (colors, spacing); Sass vars only for compile-time calculations |
| **RWD + Overflow Hidden** | Using `overflow: hidden` universally | Make it breakpoint-aware: mobile `overflow: visible`, desktop `overflow: hidden` only if needed |
| **Mobile + Viewport Units** | Using `100vh` without considering address bar | Use `100dvh` with fallback, or avoid viewport units; test on real devices |
| **Page Count + Templating** | Hard-coding `9` in HTML, CSS, JS | Use DOM queries (`querySelectorAll('[data-page]')`) as single source of truth |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Re-evaluating all SCSS imports on change** | Vite HMR slow, CSS takes 5+ seconds to update | Use `@use` correctly; avoid circular imports; structure imports as DAG (directed acyclic graph) | Projects with >20 SCSS files or deep import nesting |
| **Shipping large clamp() font rules** | CSS file larger than necessary; browser must calculate clamp at render time | Limit clamp() to 5-10 text roles; use media queries for large jumps | Sites with 50+ distinct font sizes |
| **Asset bundling without lazy-loading** | First paint slow, blocking images of all 9 pages | Use Vite's `?url` imports; lazy-load off-screen page images; use `<link rel="prefetch">` | Project with 30+ images across all pages |
| **Duplicated CSS across page-specific files** | `page-0.css` + `page-1.css` + ... + `page-8.css` share 50% of rules | Extract common styles to `base.css`; use SCSS `@mixin` for reusable blocks | Projects with repetitive page layouts |
| **No HMR during SCSS edits** | Full page reload on CSS change, loses navigation state | Configure Vite `hmr` correctly; verify SCSS watcher is active | After Vite setup if config is missed |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|-----------|
| Embedding `data-clerk-id` in HTML without validation | Attackers could craft URLs with fake clerk IDs; could expose unintended user data | Validate clerk IDs against a whitelist before rendering modal; use HTTPS only |
| Remote asset loading from `placehold.co` | Service could be compromised or removed; site breaks; XSS risk if service is hacked | Replace placeholders with local assets before shipping; use subresource integrity (SRI) if loading from CDN |
| Global handlers accessible via DevTools | Attackers could call `globalThis.openClerkModal(999)` from console and explore modal state | Move to delegated event listeners; don't expose sensitive functions globally; use CORS headers if API-backed |
| Hard-coded internal URLs or page numbers | If URL structure or page count changes, old bookmarks or shared links break; potential information disclosure | Use page IDs instead of numbers; use descriptive anchors; implement redirects for deprecated URLs |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Text or buttons clipped by `overflow: hidden` on mobile | Users can't read full content or click buttons; frustration and abandonment | Use breakpoint-aware overflow; test pinch-zoom at 2x; ensure all content is reachable |
| Layout shift when address bar hides/shows on mobile | Disorienting; horizontal scroll position resets; users lose place in 9-page navigation | Use `100dvh` or flexible height; avoid fixed viewport units; test on real devices |
| Font size unreadable on 4K or too large on mobile | 4K: text too small to read comfortably; Mobile: text overflows, requires scrolling | Test clamp() at 320px, 768px, 1920px, 2560px; include user zoom (150%); use comfortable line-height (1.5+) |
| Modal doesn't close or opens unexpectedly | Users trapped; can't interact with rest of site; perceived as broken | Use state manager to track modal visibility; test rapid open/close; ensure Escape key works |
| Horizontal swipe navigation doesn't work on mobile | Core interaction broken; site unusable on phone | Test touch handlers on real iOS/Android; verify swipe threshold is reasonable (50-100px); add tap-to-navigate fallback |
| Page 7 placeholder disrupts navigation flow | Users confused by empty page; unclear if site is broken or intentional | Hide page 7 from navigation until content is ready; or display a "coming soon" screen with clear messaging |

---

## "Looks Done But Isn't" Checklist

- [ ] **Vite Setup:** `vite.config.js` created with `base` option, SCSS preprocessor configured, asset paths verified with `vite build`
- [ ] **SCSS Migration:** All `@import` replaced with `@use`; no duplicate rules in compiled CSS; no style inconsistencies between pages
- [ ] **RWD Tested:** 320px, 768px, 1920px, 2560px breakpoints all tested; `overflow: hidden` behavior verified per breakpoint
- [ ] **Viewport Units:** `100vh` replaced with `100dvh` with fallback; tested on iOS Safari and Android Chrome with real address bar behavior
- [ ] **Typography Clamp:** All clamp() formulas tested at 320px min, 1920px nominal, 2560px max; zoom at 150% doesn't break; line-height and letter-spacing fixed
- [ ] **Hard-coded Page Count:** All references to `9` extracted to constant; SCSS uses CSS variable; no magic numbers remain
- [ ] **Global Handlers Removed:** No `globalThis.open/closeClerkModal`; all handlers are delegated event listeners with state manager
- [ ] **Asset Paths:** All image and font refs use relative paths or Vite imports; `vite build` produces correct asset hashes; no 404s in production
- [ ] **Modal State:** Modal can open/close multiple times; state doesn't leak between modal instances; Escape key dismisses modal
- [ ] **Touch Swipe:** 9-page horizontal scroll works on iOS and Android; swipe threshold is reasonable; no sticky states after rapid swiping
- [ ] **Performance:** First contentful paint < 2s on 3G; no layout shift on address bar hide/show; CSS file < 100KB uncompressed

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Overflow hidden breaks mobile layout** | MEDIUM | 1. Remove `overflow: hidden` globally 2. Add breakpoint-aware rule: `@media (max-width: 768px) { overflow: visible }` 3. Re-test all pages 4. Adjust height constraints if needed |
| **SCSS @use scope collision** | MEDIUM | 1. Create barrel file (`exports.scss`) 2. Update all files to use barrel 3. Delete old `@import` statements 4. Test compiled output for duplicates |
| **Vite asset paths 404** | MEDIUM | 1. Audit `vite.config.js` `base` option 2. Replace hard-coded paths with relative paths 3. Use `?url` imports for critical assets 4. Run `vite build` and inspect dist/ structure |
| **Clamp() typography broken on mobile** | HIGH | 1. Audit current clamp() formulas 2. Test at 320px, 2560px, zoom 150% 3. Recalculate min/max values 4. Replace with tested formula 5. Re-test all breakpoints |
| **Global handlers conflict after refactor** | HIGH | 1. Audit all `globalThis.*` references 2. Create state manager object 3. Migrate each handler to delegated listener 4. Test state isolation and rapid clicks 5. Remove all inline `onclick` from HTML |
| **Hard-coded page count breaks navigation** | MEDIUM | 1. Extract `TOTAL_PAGES = 9` to constant 2. Replace all magic numbers in JS/SCSS 3. Add DOM assertion: `querySelectorAll('[data-page]').length === TOTAL_PAGES` 4. Re-test navigation to each page |
| **100vh height issues on mobile** | LOW-MEDIUM | 1. Replace `100vh` with `100dvh` and `@supports` fallback 2. Test on iOS Safari and Android Chrome 3. Monitor address bar hide/show behavior 4. Adjust child element heights if layout shifts |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| **Overflow hidden traps layout** | Phase 2 (RWD Impl) | Test mobile at 320px, 768px; verify no content is clipped; pinch-zoom to 2x works |
| **SCSS @use scope confusion** | Phase 1 (Vite Setup) | Grep for all `@import`; verify replaced with `@use`; inspect compiled CSS for duplicates |
| **Vite asset paths break** | Phase 1 (Vite Setup) | Run `vite build`; inspect `dist/`; verify all image/font paths are correct; no 404s in browser |
| **Clamp() typography fails** | Phase 2 (RWD Impl) | Test at 320px, 1920px, 2560px; verify zoom 150% works; check line-height and reading comfort |
| **100vh/100dvh viewport issues** | Phase 2 (RWD Impl) | Test on real iOS Safari and Android Chrome; verify address bar hide/show doesn't cause shift; test zoom |
| **Hard-coded page count breaks nav** | Phase 1 (Code Refactor) | Extract to constant; search codebase for remaining magic `9`; add DOM assertion; test all 9 pages navigable |
| **Global handlers leak state** | Phase 1 (Code Refactor) | Audit all `globalThis.*`; migrate to delegated listeners; test modal open/close/open sequence |
| **SCSS variable scope collision** | Phase 1 (Vite Setup) | Create barrel file; migrate all to `@use`; verify consistent naming across files; test compiled CSS |

---

## Sources

- Training data on Vite migration best practices (2024-2025)
- CONCERNS.md and CONVENTIONS.md analysis of current codebase patterns
- PROJECT.md constraints (9-page layout, `overflow: hidden`, Vanilla JS, RWD 320px–4K)
- CSS specification for `clamp()`, viewport units (`dvh`, `dvw`), and media queries (W3C)
- Sass 2020+ module system documentation (Dart Sass 1.0+)
- Common RWD refactor mistakes from web platform evolution (2023-2026)

**Note:** WebSearch unavailable during research; findings based on training data and codebase analysis. Recommend verification with official Vite and Sass documentation during Phase 1 implementation.

---

*Pitfalls research for: White Rice Club static site RWD refactor + Vite migration*
*Researched: 2026-04-18*
*Next: Phase 1 roadmap should include Vite setup, SCSS migration, and page count extraction as blocking tasks.*
