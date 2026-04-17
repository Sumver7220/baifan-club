# Codebase Concerns

**Analysis Date:** 2026-04-18

## Tech Debt

**Static site with no visible automation surface:**

- Issue: No `package.json`, lockfile, lint config, or test runner config was detected in the repository root, so installs, builds, and verification are manual.
- Files: `index.html`, `js/nav.js`, `css/*.scss`, `css/*.css`, `css/*.css.map`
- Impact: Changes depend on local editor habits and do not have a repeatable validation path.
- Fix approach: Add a minimal build/test pipeline and document the command set in the repo.

**Source and compiled styles are committed side by side:**

- Issue: The repository keeps SCSS source files alongside generated CSS and source maps.
- Files: `css/base.scss`, `css/base.css`, `css/base.css.map`, `css/pages.scss`, `css/pages.css`, `css/pages.css.map`, `css/nav.scss`, `css/nav.css`, `css/nav.css.map`, `css/page-3-modal.scss`, `css/page-3-modal.css`, `css/page-3-modal.css.map`
- Impact: It is easy for source and output to drift, especially when edits happen outside a controlled compile step.
- Fix approach: Pick a single source of truth and generate the compiled assets consistently.

**Page count and layout assumptions are hard-coded in multiple places:**

- Issue: The page rail, background placeholders, and swipe bounds all assume exactly 9 pages.
- Files: `css/pages.scss#L15`, `css/pages.scss#L34`, `js/nav.js#L97`, `js/nav.js#L100`
- Impact: Adding, removing, or reordering pages requires coordinated edits in several files and is easy to break.
- Fix approach: Derive page count from the DOM or a shared constant instead of repeating the value.

## Fragile Areas

**Navigation and modal flow rely on global and inline handlers:**

- Files: `index.html#L428`, `index.html#L430`, `js/nav.js#L117`, `js/nav.js#L149`
- Why fragile: `globalThis.openClerkModal` and `globalThis.closeClerkModal` are coupled to inline `onclick` attributes, which makes refactoring and reuse harder.
- Safe modification: Move to delegated event listeners or module-scoped handlers with explicit bindings.
- Test coverage: No automated browser coverage detected.

**Clerk gallery depends on remote placeholder assets:**

- Files: `index.html#L155`, `index.html#L161`, `index.html#L167`, `index.html#L173`, `index.html#L187`, `index.html#L193`, `index.html#L199`, `index.html#L218`, `index.html#L224`, `index.html#L230`, `index.html#L236`, `index.html#L255`, `index.html#L261`, `index.html#L267`, `index.html#L273`
- Why fragile: The page 3 grid loads many images from `placehold.co`, so availability and performance depend on an external service.
- Safe modification: Replace placeholders with local assets or add explicit fallback handling.
- Test coverage: No image fallback or offline behavior checks detected.

**One section still ships as placeholder content:**

- Files: `index.html` (page 7), `css/page-7.scss`
- Why fragile: page 6 and page 8 have moved to production-like implementations, but page 7 remains a placeholder block, creating a noticeable UX discontinuity in the navigation flow.
- Safe modification: Implement page 7 layout and content, or temporarily hide page 7 entry from bottom navigation until complete.
- Test coverage: No page-completeness assertions detected.

## Test Coverage Gaps

**No repository-level automated verification detected:**

- What's not tested: Navigation state changes, modal open/close behavior, touch swipe logic, and responsive layout regressions.
- Files: `js/nav.js`, `index.html`
- Risk: Regressions can ship unnoticed because there is no visible test harness or CI gate in the repository.
- Priority: High

**Accessibility behavior is mostly manual:**

- What's not tested: Keyboard activation, focus movement, and modal dismissal behavior.
- Files: `index.html#L34`, `index.html#L71`, `index.html#L135`, `index.html#L428`, `index.html#L430`, `js/nav.js#L33`, `js/nav.js#L40`
- Risk: Interactive elements that are implemented with `p` tags plus keyboard handlers are easy to break during markup changes.
- Priority: Medium

## Performance Bottlenecks

**Multiple large local assets are loaded up front:**

- Problem: The site ships many image and font assets in `assets/images/` and `assets/fonts/` without visible lazy-loading or prioritization strategy.
- Files: `index.html`, `assets/images/*`, `assets/fonts/*`
- Cause: The page is optimized for visual richness but not for asset budgeting.
- Improvement path: Audit the heaviest assets, lazy-load noncritical imagery, and reduce duplicate font faces where possible.

---

_Concerns audit: 2026-04-18_
