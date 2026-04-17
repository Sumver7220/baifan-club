# Testing Patterns

**Analysis Date:** 2026-04-17

## Test Framework

**Runner:**

- Not detected.
- No `package.json`, lockfile, Jest, Vitest, Playwright, Cypress, or similar test runner configuration was found in the repository root.

**Assertion Library:**

- Not detected.

**Run Commands:**

```bash
python -m http.server 8080   # Manual local preview when a static server is needed
```

## Test File Organization

**Location:**

- Not detected.
- No `*.test.*` or `*.spec.*` files were found.

**Naming:**

- Not applicable.

**Structure:**

- Not applicable.

## Test Structure

**Suite Organization:**

- Not detected.
- Verification appears to be manual and page-driven rather than automated. The interaction surface is concentrated in `index.html` and `js/nav.js`.

**Patterns:**

- Browser-level checks should cover page switching, touch swipe navigation, and modal open/close behavior.
- Manual verification steps are documented in `docs/superpowers/plans/2026-04-08-bottom-nav-swipe-framework.md`.

## Mocking

**Framework:**

- Not detected.

**Patterns:**

- Not detected.

**What to Mock:**

- Not applicable.

**What NOT to Mock:**

- Not applicable.

## Fixtures and Factories

**Test Data:**

- Not detected.
- The closest equivalents are inline DOM fixtures in `index.html` and the hard-coded `introData` map in `js/nav.js`.

**Location:**

- `index.html`
- `js/nav.js`

## Coverage

**Requirements:**

- Not detected.
- There is no enforced coverage tooling in the repository.

**View Coverage:**

```bash
Not applicable
```

## Test Types

**Unit Tests:**

- Not detected.
- Small interaction blocks in `js/nav.js` could be unitized later, but no unit test harness is present now.

**Integration Tests:**

- Not detected.
- The closest validation is browser interaction across `index.html`, `css/*.css`, and `js/nav.js`.

**E2E Tests:**

- Not used.

## Common Patterns

**Async Testing:**

- Not detected.

**Error Testing:**

- Minimal defensive checks exist in runtime code, such as early returns in `js/nav.js`, but there are no automated error assertions.

## Manual Verification

**What to check:**

- Bottom navigation state changes and `aria-current` updates in `js/nav.js`.
- Horizontal sliding behavior driven by `.track` and `.viewport` in `css/pages.scss` and `js/nav.js`.
- Keyboard activation on elements with `data-nav-target` in `index.html`.
- Clerk modal open/close behavior in `index.html` and `js/nav.js`.
- Responsive layout behavior controlled by `css/base.scss`, `css/nav.scss`, and page-specific SCSS files.

**Where to verify:**

- Static browser preview of `index.html` with linked assets in `css/` and `js/`.

---

_Testing analysis: 2026-04-17_
