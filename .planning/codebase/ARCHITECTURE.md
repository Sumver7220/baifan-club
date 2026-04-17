# Architecture

**Analysis Date:** 2026-04-17

## Pattern Overview

**Overall:** Single-page horizontal slide gallery with fixed bottom navigation.

**Key Characteristics:**

- The entire experience is assembled in `index.html` and split into 9 full-screen sections inside a horizontal `.track`.
- Page changes are driven by vanilla JavaScript in `js/nav.js` through `transform: translateX(...)` on the track.
- Page styling is organized as a shared base plus per-page section styles in `css/*.scss` and compiled `css/*.css` outputs.

## Layers

**Document Shell:**

- Purpose: Defines the page sequence, bottom navigation, and clerk modal.
- Location: `index.html`
- Contains: 9 `.page` sections, `.bottom-nav`, `.clerk-modal`, script and stylesheet links.
- Depends on: `css/base.css`, `css/pages.css`, `css/nav.css`, `css/page-*.css`, `js/nav.js`.
- Used by: The browser as the only HTML entry point.

**Shared Style Layer:**

- Purpose: Provides reset rules, font faces, design tokens, and global page constraints.
- Location: `css/base.scss` and compiled `css/base.css`
- Contains: `@font-face`, CSS custom properties, full-viewport body rules.
- Depends on: Local fonts in `assets/fonts/`.
- Used by: All sections and navigation styles.

**Layout Layer:**

- Purpose: Defines the viewport/track/page sliding shell.
- Location: `css/pages.scss` and compiled `css/pages.css`
- Contains: `.viewport`, `.track`, `.page`, placeholder styling.
- Depends on: `--page-count`, `--transition-page`, `--nav-height` from `base.scss`.
- Used by: Every section in `index.html`.

**Navigation Layer:**

- Purpose: Renders and styles the fixed bottom navigation.
- Location: `css/nav.scss`, compiled `css/nav.css`, and `js/nav.js`
- Contains: `.bottom-nav`, `.nav-item`, `.nav-icon`, `.nav-label`, active-state rules.
- Depends on: The `data-target` attributes in `index.html`.
- Used by: The page-switching interaction layer.

**Page Feature Layer:**

- Purpose: Holds page-specific backgrounds, layouts, and section content.
- Location: `css/page-0.scss` through `css/page-8.scss`, plus `css/page-3-modal.scss`
- Contains: Section-specific selectors such as `#page-0`, `#page-1`, `#page-2`, `#page-3`, `#page-4`.
- Depends on: Shared tokens and layout rules from `css/base.scss` and `css/pages.scss`.
- Used by: Matching sections in `index.html`.

**Interaction Layer:**

- Purpose: Handles navigation, keyboard activation, touch swipe, and modal toggling.
- Location: `js/nav.js`
- Contains: `goToPage`, touch handlers, `openClerkModal`, `closeClerkModal`.
- Depends on: DOM ids and `data-*` attributes in `index.html`.
- Used by: Bottom navigation buttons, in-page CTA elements, and clerk cards.

## Data Flow

**Navigation Flow:**

1. A click on a `.nav-item` reads `data-target`.
2. `goToPage(index)` updates `#track` with a horizontal translate and syncs the active button state.
3. The same page index is stored in `currentPage` so swipe gestures snap to the correct section.

**In-Page Jump Flow:**

1. CTA elements such as `.home-entry`, `.about-cta`, `.customer-cta`, and `.clerk-cta` expose `data-nav-target`.
2. `js/nav.js` binds click and keyboard handlers to those elements.
3. The handler routes to `goToPage(...)` using the declared target index.

**Swipe Flow:**

1. `touchstart` stores the initial touch coordinates on `.viewport`.
2. `touchmove` decides whether the gesture is horizontal and, if so, moves the track immediately without transition.
3. `touchend` snaps to the next, previous, or current page based on the horizontal delta.

**Modal Flow:**

1. Clicking a `.clerk-card` reads `data-clerk-id` and `data-clerk-name`.
2. `openClerkModal(clerkId)` fills `#clerkModalName`, `#clerkModalDesc`, and `#clerkModalImage`.
3. `closeClerkModal()` hides the modal by toggling `aria-hidden` and the `.open` class.

**State Management:**

- Navigation state is held in the `currentPage` variable in `js/nav.js`.
- Visual selection state is mirrored in DOM classes and `aria-current="page"`.
- Modal visibility is represented by `.clerk-modal.open` plus `aria-hidden`.

## Key Abstractions

**Page Track:**

- Purpose: Treats the experience as a 9-panel horizontal strip.
- Examples: `index.html`, `css/pages.scss`, `js/nav.js`
- Pattern: Fixed viewport with a translateX-driven track.

**Navigation Item:**

- Purpose: Represents one section target in the persistent bottom menu.
- Examples: `.nav-item[data-target]` in `index.html`, `.nav-item` in `css/nav.scss`
- Pattern: Button-based navigation with active state and ARIA feedback.

**Section CTA:**

- Purpose: Provides direct links between sections without using the bottom nav.
- Examples: `.home-entry`, `.about-cta`, `.customer-cta`, `.clerk-cta`
- Pattern: Button-like paragraph elements with `role="button"`, `tabindex="0"`, and `data-nav-target`.

**Clerk Card and Modal:**

- Purpose: Surfaces staff profiles in a grid and expands them in an overlay.
- Examples: `.clerk-card` and `#clerkModal` in `index.html`, `css/page-3.scss`, `css/page-3-modal.scss`, `js/nav.js`
- Pattern: Card click opens a global modal helper with content populated from the clicked card.

## Entry Points

**Main HTML Entry:**

- Location: `index.html`
- Triggers: Direct browser load.
- Responsibilities: Loads fonts, styles, sections, navigation, modal, and `js/nav.js`.

**Navigation Script:**

- Location: `js/nav.js`
- Triggers: DOM load via script tag.
- Responsibilities: Wires page switching, swipe gestures, keyboard activation, and clerk modal behavior.

## Error Handling

**Strategy:** Minimal defensive checks with early returns.

**Patterns:**

- `goToPage` assumes the track and nav items exist; the page shell is considered mandatory.
- `openClerkModal` returns early when no matching clerk card exists.
- `closeClerkModal` returns silently when the modal is absent.

## Cross-Cutting Concerns

**Logging:** Not detected.
**Validation:** Attribute-driven DOM lookup with null guards in `js/nav.js`.
**Authentication:** Not applicable.
**Accessibility:** Buttons use `aria-label`, active navigation updates `aria-current="page"`, and in-page CTAs are keyboard-activatable.
**Responsive Behavior:** `css/base.scss` and `css/nav.scss` define the mobile breakpoint, and `js/nav.js` adds swipe support for touch devices.

---

_Architecture analysis: 2026-04-17_
