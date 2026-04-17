# Testing Patterns

**Analysis Date:** 2026-04-18

## Test Framework

**Runner:**

- Not detected.
- No `package.json`, lockfile, Jest, Vitest, Playwright, Cypress, or similar test runner configuration found in repository root.

**Assertion Library:**

- Not detected.

**Run Commands:**

```bash
python -m http.server 8080   # Manual local preview when a static server is needed
```

## Test File Organization

**Location:**

- Not detected.
- No `*.test.*` or `*.spec.*` files found.

**Naming:**

- Not applicable.

**Structure:**

- Not applicable.

## Test Structure

**Suite Organization:**

- Not detected.
- Verification appears to be manual and page-driven rather than automated. Interaction surface concentrated in `index.html` and `js/nav.js`.

**Patterns:**

- Browser-level checks should cover page switching, touch swipe navigation, and modal open/close behavior.
- Manual verification steps documented in `docs/superpowers/plans/2026-04-08-bottom-nav-swipe-framework.md`.

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
- Closest equivalents: inline DOM fixtures in `index.html` and hard-coded `introData` map in `js/nav.js`.

**Location:**

- `index.html`: Page sections and modal markup
- `js/nav.js`: Clerk introduction strings in `introData` object (lines 115–126)

## Coverage

**Requirements:**

- Not detected.
- No enforced coverage tooling in repository.

**View Coverage:**

```bash
Not applicable
```

## Test Types

**Unit Tests:**

- Not detected.
- Small interaction blocks in `js/nav.js` (e.g., `goToPage()`, gesture detection) could be unitized later.
- No unit test harness present.

**Integration Tests:**

- Not detected.
- Closest validation is browser interaction across `index.html`, `css/*.css`, and `js/nav.js`.

**E2E Tests:**

- Not used.

## Common Patterns

**Async Testing:**

- Not detected.

**Error Testing:**

- Minimal defensive checks exist in runtime code (early returns in `js/nav.js`).
- No automated error assertions.

## Manual Verification

**Browser Testing Checklist:**

1. **Navigation and Page Switching**
   - Bottom navigation bar responds to clicks on each `.nav-item` in `js/nav.js`
   - Active nav item shows `aria-current="page"` attribute
   - Active nav item receives `.active` class styling
   - Page transition animates via `.track` transform in `css/pages.css`

2. **Touch Swipe Gestures**
   - Horizontal swipe (left/right) on `.viewport` advances/retreats page in `js/nav.js`
   - Vertical swipe is ignored (gesture detection in `touchmove` handler)
   - Swipe threshold is at least 50px (see `touchend` handler line 94)
   - Touch detection distinguishes between horizontal and vertical movement

3. **Keyboard Activation**
   - Elements with `data-nav-target` and `role="button"` respond to `Enter` key
   - Elements with `data-nav-target` and `role="button"` respond to `Space` key
   - Keyboard events prevented from default browser behavior (`e.preventDefault()`)

4. **Clerk Modal Open/Close**
   - Modal opens when clerk card `.nav-item` is clicked
   - Modal closes when close button is clicked or outside area is clicked
   - Modal shows correct clerk name (`clerkModalName`) from `data-clerk-name`
   - Modal shows correct introduction text from `introData` map in `js/nav.js`
   - Modal shows correct clerk image from `img` src inside clerk card
   - Modal has `aria-hidden="false"` when open, `aria-hidden="true"` when closed
   - Modal class `.open` applied/removed on open/close

5. **Responsive Behavior (Mobile)**
   - Media query breakpoint at `--bp-mobile-max: 47.9375rem` (767px)
   - Navigation icons shrink on mobile (`--nav-icon-size-mobile: 1rem`)
   - Navigation labels shrink on mobile (`--font-xs: 0.5625rem`)
   - Page sections adapt layout on mobile via page-specific CSS media queries
   - Touch swipe still works on mobile devices

6. **Accessibility (a11y)**
   - Page sections marked with `<section>` tags (semantic)
   - Interactive elements have `tabindex="0"` or `role="button"`
   - Active navigation item has `aria-current="page"`
   - Modal has appropriate `aria-hidden` state
   - Font sizes use `clamp()` for responsive typography
   - Color contrast meets WCAG AA (white on dark purple background)

7. **Visual Integrity**
   - Page background color matches `--color-bg: #0a0814`
   - Text color matches `--color-text: #ffffff`
   - Gold accents match `--color-gold: #c9a84c` where intended
   - Bottom navigation bar backdrop blur effect visible
   - Active nav item gradient background visible
   - All nine pages load and display correctly

**Where to Verify:**

- Static browser preview of `index.html` with linked assets in `css/` and `js/`.
- Test on Chrome/Edge (latest), Firefox, Safari.
- Test on mobile browsers (iOS Safari, Chrome Mobile).

## Testing Gaps

**Critical Gaps:**

- No automated page loading or DOM state verification
- No gesture simulation framework (manual touch testing required)
- No visual regression testing (design consistency relies on manual inspection)
- No accessibility auditing tools integrated (WAVE, axe, Lighthouse only available via browser extensions)

**Recommendation:**

- Consider adding Playwright or Cypress for browser automation of navigation, swipe, and modal interactions
- Add Axe Core or similar for continuous accessibility scanning
- Set up visual regression testing (Percy, Chromatic) if design fidelity is critical

---

_Testing analysis: 2026-04-18_
