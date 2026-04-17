# Architecture Research: Vite Migration + RWD Refactor

**Domain:** Static site with horizontal slide gallery, CSS-in-SCSS, vanilla JS
**Researched:** 2026-04-18
**Confidence:** HIGH (based on codebase analysis + established best practices)

## Standard Architecture

### System Overview

**Current State (Pre-Vite):**
```
┌──────────────────────────────────────────────────────────────┐
│                    Browser Rendering                          │
├──────────────────────────────────────────────────────────────┤
│  index.html (9 sections + nav + modal)                        │
│  └─ Loads: css/*.css, js/nav.js (manually via <link>, <script>) │
├──────────────────────────────────────────────────────────────┤
│ CSS Layer (Manual Compilation via VS Code Extension)          │
│  ├─ css/base.scss → base.css (design tokens, fonts)          │
│  ├─ css/pages.scss → pages.css (layout, track geometry)      │
│  ├─ css/nav.scss → nav.css (navigation styles)               │
│  ├─ css/page-*.scss → page-*.css (9 page-specific styles)    │
│  └─ css/page-3-modal.scss → page-3-modal.css (modal overlay) │
├──────────────────────────────────────────────────────────────┤
│ JS Layer (Vanilla, No Build Step)                             │
│  └─ js/nav.js (navigation, swipe, modal handlers)            │
├──────────────────────────────────────────────────────────────┤
│ Assets                                                         │
│  ├─ assets/images/* (backgrounds, clerk photos, decorations) │
│  ├─ assets/fonts/* (custom CJK fonts + fallbacks)           │
│  └─ (External: placehold.co for placeholder images)         │
└──────────────────────────────────────────────────────────────┘
```

**Post-Vite Architecture:**
```
┌──────────────────────────────────────────────────────────────┐
│                    Vite Dev Server + Build                    │
│  ├─ HMR (Hot Module Replacement for styles)                  │
│  ├─ SCSS compilation (reproducible, no VS Code dependency)   │
│  └─ Asset bundling + optimization pipeline                   │
├──────────────────────────────────────────────────────────────┤
│                  Source Code (src/)                           │
│  ├─ main.ts (entry point, bootstraps navigation)            │
│  ├─ styles/                                                  │
│  │  ├─ tokens.scss (design system: colors, spacing, type)   │
│  │  ├─ typography.scss (fluid type scales with clamp())     │
│  │  ├─ layout.scss (viewport, track, page, nav geometry)    │
│  │  ├─ base.scss (resets, @font-face imports)              │
│  │  ├─ components/                                          │
│  │  │  ├─ nav.scss (navigation bar styles)                 │
│  │  │  ├─ clerk-modal.scss (modal overlay)                 │
│  │  │  └─ page.scss (page base styles)                     │
│  │  └─ pages/                                               │
│  │     ├─ page-0.scss (home/entry)                         │
│  │     ├─ page-1.scss (about story)                        │
│  │     ├─ page-2.scss (customer rules)                     │
│  │     ├─ page-3.scss (clerk intro + modal)                │
│  │     ├─ page-4.scss (menu)                               │
│  │     ├─ page-5.scss (special services)                   │
│  │     ├─ page-6.scss (moment gallery)                     │
│  │     ├─ page-7.scss (champagne toast — frozen)           │
│  │     └─ page-8.scss (environment gallery)                │
│  ├─ scripts/                                                │
│  │  ├─ main.ts (navigation controller)                     │
│  │  ├─ handlers/                                            │
│  │  │  ├─ navigation.ts (goToPage, page switching logic)   │
│  │  │  ├─ gestures.ts (touch swipe, snap behavior)         │
│  │  │  └─ modal.ts (clerk modal open/close)               │
│  │  └─ utils/                                               │
│  │     ├─ dom-query.ts (cached element selectors)          │
│  │     ├─ page-config.ts (derives page count from DOM)     │
│  │     └─ constants.ts (reusable magic numbers)            │
│  └─ index.html (9 sections + nav + modal — NO style/script tags) │
├──────────────────────────────────────────────────────────────┤
│                    Build Output (dist/)                       │
│  ├─ index.html (minified, processed)                        │
│  ├─ assets/                                                  │
│  │  ├─ images/ (optimized, lazy-loaded)                    │
│  │  ├─ fonts/ (subset, preloaded)                          │
│  │  └─ chunks/ (JS/CSS code-split by Vite)                 │
│  └─ .js + .css bundles (hash-based cache busting)          │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Lives In |
|-----------|----------------|----------|
| **Design Tokens** | Color, spacing, breakpoints, timing — single source of truth | `src/styles/tokens.scss` |
| **Typography Scale** | Fluid type scaling (clamp) for 320px–2560px viewport range | `src/styles/typography.scss` |
| **Layout Shell** | Viewport, track, page, nav height constraints | `src/styles/layout.scss` |
| **Base Styles** | CSS resets, @font-face, html/body defaults | `src/styles/base.scss` |
| **Navigation Component** | Fixed bottom nav bar, active state, responsive icon sizing | `src/styles/components/nav.scss` |
| **Clerk Modal** | Overlay, content sizing, close button, backdrop | `src/styles/components/clerk-modal.scss` |
| **Page Styles** | Per-page backgrounds, text layouts, content grids | `src/styles/pages/page-*.scss` |
| **Navigation Controller** | Page state, page switching, current page tracking | `src/scripts/handlers/navigation.ts` |
| **Gesture Handler** | Touch swipe detection, snap-to-page behavior | `src/scripts/handlers/gestures.ts` |
| **Modal Controller** | Modal open/close, clerk data binding, focus management | `src/scripts/handlers/modal.ts` |
| **Page Config** | Derive page count from DOM, breakpoint constants | `src/scripts/utils/page-config.ts` |

## Recommended Project Structure

```
baifan-club/
├── src/
│   ├── index.html                          # Semantic HTML only (Vite entry point)
│   ├── main.ts                             # JS entry point for Vite
│   ├── styles/
│   │   ├── tokens.scss                     # Design system variables
│   │   ├── typography.scss                 # Fluid type scales (clamp-based)
│   │   ├── layout.scss                     # Viewport, track, page geometry
│   │   ├── base.scss                       # Resets, fonts, globals
│   │   ├── components/
│   │   │   ├── nav.scss                    # Navigation bar
│   │   │   ├── clerk-modal.scss            # Modal overlay
│   │   │   └── page.scss                   # Page base (optional fallback)
│   │   └── pages/
│   │       ├── page-0.scss                 # Home/entry
│   │       ├── page-1.scss                 # About story
│   │       ├── page-2.scss                 # Customer rules
│   │       ├── page-3.scss                 # Clerk intro
│   │       ├── page-4.scss                 # Menu
│   │       ├── page-5.scss                 # Special services
│   │       ├── page-6.scss                 # Moment gallery
│   │       ├── page-7.scss                 # Champagne toast (frozen)
│   │       └── page-8.scss                 # Environment gallery
│   ├── scripts/
│   │   ├── main.ts                         # Bootstrap + entry orchestration
│   │   ├── handlers/
│   │   │   ├── navigation.ts               # goToPage(), page state
│   │   │   ├── gestures.ts                 # touch events, snap logic
│   │   │   └── modal.ts                    # modal open/close
│   │   └── utils/
│   │       ├── dom-query.ts                # Cached DOM element lookups
│   │       ├── page-config.ts              # Derive page count + constants
│   │       └── constants.ts                # Reusable magic numbers
│   └── assets/
│       ├── images/
│       │   ├── about.png
│       │   ├── clerk-photos/
│       │   ├── moments/
│       │   └── environment/
│       └── fonts/
│           ├── 匯文明朝體GBK.ttf
│           ├── cwTeXQMing-Medium.ttf
│           └── [other custom fonts]
├── .planning/
│   ├── PROJECT.md                          # Project scope + constraints
│   ├── research/
│   │   └── ARCHITECTURE.md                 # This file
│   └── codebase/
│       ├── ARCHITECTURE.md                 # Current state analysis
│       └── CONCERNS.md                     # Tech debt + fragile areas
├── vite.config.ts                          # Vite build configuration
├── tsconfig.json                           # TypeScript (optional, for type safety)
├── package.json                            # Dependencies + build scripts
├── dist/                                   # Generated on build (git-ignored)
│   ├── index.html
│   ├── assets/
│   └── [Vite hash-stamped bundles]
└── .gitignore                              # Ignore dist/, node_modules/, .DS_Store
```

### Structure Rationale

- **`src/styles/tokens.scss`:** Central design system. All color, spacing, typography, timing defined here. Change once, propagates to all pages.
- **`src/styles/typography.scss`:** Dedicated typography scale using `clamp()` for fluid scaling across 320px–2560px. Separates type concerns from layout/components.
- **`src/styles/layout.scss`:** All viewport/track/page/nav geometry in one place. Easy to audit and adjust the slide gallery mechanics.
- **`src/styles/components/`:** Reusable component styles (nav, modal) separated from page-specific styles. Makes it clear what's global vs. page-local.
- **`src/styles/pages/`:** One SCSS per page. Keeps page styles isolated, prevents cascade conflicts, makes it obvious which file to edit for page-specific changes.
- **`src/scripts/handlers/`:** Behavior organized by interaction type (navigation, gestures, modal), not by HTML structure. Makes it easy to find and test related logic.
- **`src/scripts/utils/`:** Shared utilities (DOM queries, page config). Prevents repetition and centralizes constants.
- **`src/assets/`:** Keep local; no external image dependencies (removes placehold.co fragility).
- **`vite.config.ts`:** Single, reproducible build configuration. No more VS Code extension dependency.

## Architectural Patterns

### Pattern 1: Design Token Cascade

**What:** CSS custom properties (@import'd from tokens.scss) define all design system values. Page styles read tokens, never hardcode colors/spacing/timing.

**When to use:** Always. Ensures consistency and makes theme changes trivial.

**Trade-offs:**
- **Pros:** Single source of truth, easy theme swaps, global consistency checks.
- **Cons:** Requires discipline — team must use tokens, not hardcoded values.

**Example:**
```scss
// src/styles/tokens.scss
:root {
  --color-bg: #0a0814;
  --color-text: #ffffff;
  --color-gold: #c9a84c;
  --color-accent: #e3a9f1;
  
  --bp-mobile-max: 47.9375rem;  // 767px @ 16px base
  --bp-tablet-min: 48rem;       // 768px
  --bp-desktop-min: 64rem;      // 1024px
  --bp-4k-min: 160rem;          // 2560px
  
  --nav-height: 8rem;
  --nav-height-mobile: 4.5rem;
  
  --space-xs: 0.375rem;
  --space-sm: 0.625rem;
  --space-md: 0.75rem;
  --space-lg: 1rem;
  
  --duration-fast: 200ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: var(--bp-mobile-max)) {
  :root {
    --nav-height: var(--nav-height-mobile);
  }
}

// Usage in page-0.scss:
#page-0 .title {
  color: var(--color-text);
  margin-bottom: var(--space-lg);
  transition: opacity var(--duration-fast) var(--easing-standard);
}
```

### Pattern 2: Fluid Typography with clamp()

**What:** CSS `clamp(min, fluid, max)` scales font size smoothly across viewport widths without media queries. Solves the 320px–2560px scaling problem.

**When to use:** All typography. Replaces hardcoded px or vw-only sizing.

**Trade-offs:**
- **Pros:** Smooth scaling, no media query overhead, works on 4K displays, no JS required.
- **Cons:** Requires understanding clamp() syntax; incorrect ratios = jarring scaling.

**Example:**
```scss
// src/styles/typography.scss
:root {
  // Base: 1rem @ 320px, grows proportionally, caps at 2560px
  --fs-body: clamp(0.875rem, 1.2vw, 1.125rem);
  
  // Hero text: min 1.75rem (mobile), fluid 4vw, max 3rem (4K)
  --fs-hero: clamp(1.75rem, 4vw, 3rem);
  
  // Heading: min 1.25rem, fluid 3vw, max 2rem
  --fs-heading: clamp(1.25rem, 3vw, 2rem);
  
  // Small: min 0.75rem, fluid 1.5vw, max 1rem
  --fs-small: clamp(0.75rem, 1.5vw, 1rem);
}

body {
  font-size: var(--fs-body);
  line-height: 1.6;
}

h1 { font-size: var(--fs-hero); }
h2 { font-size: var(--fs-heading); }
small { font-size: var(--fs-small); }
```

**Validation (test at key breakpoints):**
- 320px phone: should hit min values
- 1920px desktop: should hit somewhere in middle
- 2560px 4K: should hit max values (text not oversized)

### Pattern 3: Explicit Page Configuration

**What:** Derive page count, active page, and navigation state from DOM instead of hardcoding. One source of truth: the HTML.

**When to use:** Always. Prevents "add a page and forget to update line 97" bugs.

**Trade-offs:**
- **Pros:** Maintainable, safe, self-documenting.
- **Cons:** Requires querying DOM at startup.

**Example:**
```typescript
// src/scripts/utils/page-config.ts
export const pageConfig = {
  getPageCount(): number {
    return document.querySelectorAll('.page').length;
  },
  
  getPageIndex(element: Element): number {
    return Array.from(document.querySelectorAll('.page')).indexOf(element);
  },
  
  getMaxPageIndex(): number {
    return this.getPageCount() - 1;
  },
};

// src/scripts/handlers/navigation.ts
import { pageConfig } from '../utils/page-config.ts';

export function goToPage(index: number) {
  const maxIndex = pageConfig.getMaxPageIndex();
  
  if (index < 0 || index > maxIndex) {
    console.warn(`Page ${index} out of bounds [0, ${maxIndex}]`);
    return;
  }
  
  track.style.transform = `translateX(-${index * 100}vw)`;
  updateNavigation(index);
  currentPage = index;
}

// src/scripts/handlers/gestures.ts
if (deltaX < -50 && currentPage < pageConfig.getMaxPageIndex()) {
  goToPage(currentPage + 1);
}
if (deltaX > 50 && currentPage > 0) {
  goToPage(currentPage - 1);
}
```

### Pattern 4: Delegated Event Handlers

**What:** Instead of global functions + inline `onclick`, use delegated event listeners on the document. Handlers are module-scoped, not global.

**When to use:** All interactive elements (nav items, CTAs, modal triggers).

**Trade-offs:**
- **Pros:** Cleaner HTML, easier refactoring, testable, no global namespace pollution.
- **Cons:** Slightly more JS setup, requires `data-*` attributes (good for maintainability anyway).

**Example:**
```typescript
// src/scripts/handlers/modal.ts
export function initializeClerkModal() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Clerk card clicked → open modal
    if (target.closest('.clerk-card')) {
      const clerkId = target.closest('.clerk-card')?.dataset.clerkId;
      openClerkModal(clerkId);
    }
    
    // Close button clicked → close modal
    if (target.closest('.modal-close-button')) {
      closeClerkModal();
    }
  });
  
  // Backdrop click → close
  const modal = document.getElementById('clerkModal');
  modal?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      closeClerkModal();
    }
  });
}

function openClerkModal(clerkId: string | undefined) {
  if (!clerkId) return;
  
  const modal = document.getElementById('clerkModal');
  const data = clerkDatabase[clerkId];
  if (!data) return;
  
  modal?.querySelector('#clerkModalName')!.textContent = data.name;
  modal?.querySelector('#clerkModalDesc')!.textContent = data.description;
  (modal?.querySelector('#clerkModalImage') as HTMLImageElement).src = data.imageSrc;
  
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeClerkModal() {
  const modal = document.getElementById('clerkModal');
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
```

HTML no longer has `onclick`:
```html
<div class="clerk-card" data-clerk-id="alice">
  <img class="clerk-photo" src="..." alt="Alice">
  <p>Alice</p>
</div>

<div class="clerk-modal" id="clerkModal" aria-hidden="true">
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <button class="modal-close-button" aria-label="Close"></button>
    <h2 id="clerkModalName"></h2>
    <p id="clerkModalDesc"></p>
    <img id="clerkModalImage" src="" alt="">
  </div>
</div>
```

### Pattern 5: Responsive Breakpoint Strategy

**What:** Define breakpoints once in tokens, use sparingly. Prefer fluid sizing + mobile-first + touch-friendly layouts.

**When to use:** Only for layout shifts that fluid sizing can't handle (e.g., 2-column → 1-column).

**Trade-offs:**
- **Pros:** Predictable, consistent, mobile-first is maintainable.
- **Cons:** More CSS if you use media queries excessively.

**Example:**
```scss
// src/styles/tokens.scss
:root {
  --bp-mobile-max: 47.9375rem;   // 767px @ 16px = "up to here is mobile"
  --bp-tablet-min: 48rem;         // 768px = "tablet and up"
  --bp-desktop-min: 64rem;        // 1024px = "desktop and up"
  --bp-4k-min: 160rem;            // 2560px = "4K and up"
}

// src/styles/pages/page-3.scss (clerk gallery)
.clerk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  
  // No media query needed — auto-fit handles it
  
  @media (max-width: var(--bp-mobile-max)) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }
}

// src/styles/pages/page-8.scss (environment gallery)
.environment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  
  @media (max-width: var(--bp-mobile-max)) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }
  
  @media (max-width: 320px) {
    // Extreme mobile fallback (rare)
    grid-template-columns: 1fr;
  }
}
```

## Data Flow

### Page Navigation Flow

```
User clicks nav item [.nav-item[data-target="3"]]
  ↓
Delegated listener fires on document
  ↓
Handler reads data-target → "3"
  ↓
goToPage(3) called
  ↓
  1. pageConfig.getMaxPageIndex() validates bounds
  2. track.style.transform = "translateX(-300vw)"
  3. updateNavigation(3) → add .active to nav item, set aria-current
  4. currentPage = 3 (tracked in handler state)
  ↓
CSS transition fires (300ms easing)
  ↓
DOM renders page 3 (already in DOM, just scrolls into view)
```

### Gesture/Swipe Flow

```
touchstart on .viewport
  ↓
Store e.touches[0].clientX as touchStartX
  ↓
touchmove
  ↓
Calculate deltaX = current.clientX - touchStartX
  ↓
Determine if gesture is horizontal (not vertical)
  ↓
  IF horizontal:
    Immediately move track without transition (feels responsive)
    ↓
touchend
  ↓
  IF deltaX > 50 and currentPage > 0:
    goToPage(currentPage - 1)   // Swiped right, go back
  ELSE IF deltaX < -50 and currentPage < maxPageIndex:
    goToPage(currentPage + 1)   // Swiped left, go forward
  ELSE:
    goToPage(currentPage)       // Snap back to current page
```

### Clerk Modal Flow

```
User clicks .clerk-card or .clerk-card img
  ↓
Delegated listener intercepts (event.target.closest('.clerk-card'))
  ↓
openClerkModal(clerkId)
  ↓
  1. Lookup clerk data in clerkDatabase by clerkId
  2. Populate modal elements (#clerkModalName, #clerkModalDesc, #clerkModalImage)
  3. Add .open class to modal (CSS shows it)
  4. Set aria-hidden="false"
  5. Set body.style.overflow = "hidden" (no background scroll)
  ↓
Modal appears (opacity/transform transition via CSS)
  ↓
User clicks close button or backdrop
  ↓
closeClerkModal()
  ↓
  1. Remove .open class
  2. Set aria-hidden="true"
  3. Restore body.style.overflow = ""
  ↓
Modal disappears
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1 site (9 pages, 1 team) | Current structure is perfect. Flat SCSS files, simple state tracking. |
| Multiple sites (same codebase, theme variations) | Extract tokens to CSS variables, define theme files (light/dark/seasonal). Use CSS cascade to override. |
| High traffic (100k+ pageviews/day) | Optimize assets: lazy-load images, preload critical fonts, minify bundles, add CDN caching. Current JS is lightweight. |
| More pages (15–50) | Keep current structure. Page-*.scss files scale fine. If navigation becomes complex, consider page grouping (page-section-*.scss). |
| More interactivity (animations, filters) | Add animation library (GSAP if complex) or keep CSS animations. Current vanilla JS is still appropriate for a static site. |

### Scaling Priorities

1. **Asset optimization (first bottleneck):** Images are heavy. Implement lazy-loading, choose WebP format where possible, optimize font subsetting.
2. **CSS bundle size (second bottleneck):** Each page-*.scss adds to final CSS. Audit unused styles, remove duplication, consider PostCSS purge (but careful with dynamic selectors).
3. **JavaScript bundle size (usually not a problem):** Handlers are small. Only concern if adding complex interactions; then consider lightweight libraries (Alpine.js over React).

## Anti-Patterns

### Anti-Pattern 1: Hardcoded Page Count

**What people do:**
```javascript
// ❌ BAD
const MAX_PAGE = 8;
const maxOffset = 8 * window.innerWidth;
if (currentPage < 8) { goToPage(currentPage + 1); }
```

**Why it's wrong:** Adding or removing a page requires hunting through multiple files. Easy to miss one, creating bugs.

**Do this instead:**
```typescript
// ✓ GOOD
import { pageConfig } from '../utils/page-config.ts';
const maxPageIndex = pageConfig.getMaxPageIndex();
if (currentPage < maxPageIndex) {
  goToPage(currentPage + 1);
}
```

### Anti-Pattern 2: Inline Event Handlers + Global Functions

**What people do:**
```html
<!-- ❌ BAD -->
<button onclick="globalThis.openClerkModal('alice')">Open</button>
<script>
  globalThis.openClerkModal = function(id) { ... };
</script>
```

**Why it's wrong:** Global namespace pollution, hard to refactor, can't test isolated function, HTML and JS tightly coupled.

**Do this instead:**
```html
<!-- ✓ GOOD -->
<button class="clerk-card" data-clerk-id="alice">Open</button>
<script>
  // Delegated listener in modal.ts
  document.addEventListener('click', (e) => {
    if (e.target.closest('.clerk-card')) {
      openClerkModal(e.target.closest('.clerk-card').dataset.clerkId);
    }
  });
</script>
```

### Anti-Pattern 3: Mixing Fixed px and Fluid Units

**What people do:**
```scss
// ❌ BAD
.title {
  font-size: 32px;  // Doesn't scale on 4K
}

.container {
  width: 100vw;     // Misaligned with 2-column grid
  padding: 20px;    // Hardcoded, not responsive
  margin-bottom: 1.5rem;  // Inconsistent unit usage
}
```

**Why it's wrong:** Inconsistent scaling, hard to maintain, breaks on extreme viewport sizes (320px, 2560px).

**Do this instead:**
```scss
// ✓ GOOD
:root {
  --fs-title: clamp(1.5rem, 3vw, 3rem);
  --space-container: clamp(1rem, 5vw, 3rem);
}

.title {
  font-size: var(--fs-title);
}

.container {
  width: 100%;  // Or 100vw if intentional
  padding: var(--space-container);
  margin-bottom: var(--space-lg);
}
```

### Anti-Pattern 4: Styles and Compiled CSS Both Committed

**What people do:**
```
git add css/base.scss css/base.css css/base.css.map
```

**Why it's wrong:** Source and output can drift. Easy to accidentally commit stale CSS.

**Do this instead:**
```bash
# .gitignore
css/*.css
css/*.css.map

# Then:
git add css/base.scss  # Source only
# Build step generates CSS automatically on deploy
```

### Anti-Pattern 5: Missing RWD for Extreme Viewports

**What people do:**
```scss
// ❌ BAD — designed at 1920px, never tested at 320px or 2560px
.hero { font-size: 2.5rem; }  // Tiny on mobile, small on 4K
.grid { grid-template-columns: repeat(4, 1fr); }  // Overlaps on mobile
```

**Why it's wrong:** Product feels broken on devices team didn't test.

**Do this instead:**
```scss
// ✓ GOOD — test at 320px, 1024px, 1920px, 2560px
.hero {
  font-size: clamp(1.25rem, 4vw, 3rem);  // Scales smoothly
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));  // Flexible
  
  @media (max-width: var(--bp-mobile-max)) {
    grid-template-columns: repeat(2, 1fr);  // 2 cols on mobile
  }
}
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **placehold.co** (image placeholders) | `<img src="https://placehold.co/...">` | **REMOVE** — Replace with local assets before deploy. External dependency is fragile. |
| **Google Fonts** (if used) | `<link rel="preconnect">` + `@import` | Avoid if possible. Self-host fonts (already in assets/fonts/). Reduces external requests. |
| **CDN for assets** (optional future) | Build copies `dist/assets/` to CDN, serve from there. | Not needed for this scale. Local hosting fine. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Navigation Handler ↔ Page Config** | Import `pageConfig` utilities; handler calls `pageConfig.getMaxPageIndex()` | Prevents hardcoding page count. |
| **Modal Handler ↔ Clerk Data** | Modal reads `clerkDatabase` object (could be JSON imported). Triggered by delegated listener on .clerk-card[data-clerk-id]. | Clean separation: modal doesn't know how to fetch data, just knows how to display it. |
| **Gesture Handler ↔ Navigation Handler** | Gesture handler calls `goToPage()` from navigation handler. Both update `currentPage` state. | Single state source (currentPage variable in nav.ts). Gesture handler reads it, nav handler writes it. |
| **Styles ↔ HTML** | Styles use CSS class names (.page, .nav-item, .clerk-card, .modal-backdrop). HTML structure matches CSS assumptions. | Keep HTML structure stable; CSS can change freely if class names don't. |

## CSS-in-SCSS Organization (RWD Focus)

### File Hierarchy

1. **tokens.scss** — Import first. All breakpoints, colors, spacing defined here.
2. **typography.scss** — Import second. All type scales (clamp-based) reference tokens.
3. **layout.scss** — Import third. Viewport/track/page geometry, uses tokens + clamp().
4. **base.scss** — Import fourth. Resets, @font-face, html/body, uses all above.
5. **components/\*.scss** — Import fifth. Reusable components (nav, modal) use tokens + type scales.
6. **pages/\*.scss** — Import last. Page-specific styles can override, but prefer using tokens.

### RWD Strategy

**Mobile-first:**
- Start with mobile viewport (320px) as default.
- Use `@media (min-width: var(--bp-tablet-min)) { }` to enhance for larger screens.
- Prefer `clamp()` for sizing over breakpoints.

**Breakpoint usage:**
- `--bp-mobile-max: 47.9375rem` (767px) — Below this = mobile, above = tablet+
- `--bp-tablet-min: 48rem` (768px) — Tablet and up
- `--bp-desktop-min: 64rem` (1024px) — Desktop and up (optional, rarely needed)
- `--bp-4k-min: 160rem` (2560px) — Only for 4K-specific concerns (e.g., max-width containers)

**Type scaling:**
```scss
// All type scales use clamp() — no media queries needed
:root {
  --fs-body: clamp(0.875rem, 1.2vw, 1.125rem);
  --fs-heading: clamp(1.25rem, 3vw, 2rem);
  --fs-hero: clamp(1.75rem, 4vw, 3rem);
}
```

**Spacing scaling:**
```scss
:root {
  --space-container: clamp(1rem, 5vw, 3rem);  // Responsive padding
  --space-section-gap: clamp(1rem, 4vw, 2rem);  // Responsive gaps
}
```

**Layout shifts (only when fluid doesn't work):**
```scss
// page-3.scss (clerk gallery)
.clerk-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  // Desktop: 4 columns
  gap: var(--space-md);
  
  @media (max-width: var(--bp-mobile-max)) {
    grid-template-columns: repeat(2, 1fr);  // Mobile: 2 columns
  }
}
```

## Build Order Recommendations

**Phase 1: Foundation (Do First)**
1. Set up Vite (vite.config.ts, tsconfig.json, package.json)
2. Create src/styles/tokens.scss (all design system variables)
3. Create src/styles/typography.scss (all type scales with clamp())
4. Migrate index.html to src/index.html (clean up old CSS/JS links)
5. Add src/main.ts (Vite entry point, will import styles + scripts)

**Why:** Can't do RWD properly without typography tokens. Can't refactor pages without new structure in place.

**Phase 2: Layout & Navigation (Do Second)**
1. Create src/styles/layout.scss (viewport, track, page, nav)
2. Migrate src/styles/base.scss (resets, @font-face, use tokens)
3. Migrate src/styles/components/nav.scss
4. Refactor js/nav.js → src/scripts/handlers/navigation.ts (module-scoped, no globals)
5. Create src/scripts/utils/page-config.ts (derive page count from DOM)
6. Create src/scripts/main.ts (bootstrap, import all handlers)

**Why:** Navigation is the skeleton. Once working, pages and styling fit into this structure.

**Phase 3: RWD Refactor (Do Third)**
1. Refactor each page-*.scss:
   - Remove hardcoded px where possible
   - Use clamp() for fonts and spacing
   - Add mobile-first breakpoints (no more desktop-first)
   - Test at 320px, 1024px, 1920px, 2560px
2. Update css/pages.scss → src/styles/layout.scss (already done in Phase 2)
3. Test horizontal slide gesture on touch devices

**Why:** Foundation and layout changes must be stable before refactoring page styles.

**Phase 4: Modal & Interactions (Do Fourth)**
1. Migrate js/nav.js clerk modal logic → src/scripts/handlers/modal.ts (delegated listeners)
2. Create src/styles/components/clerk-modal.scss (modal styles, responsive)
3. Replace placehold.co images with local assets
4. Test modal open/close, clerk data binding, accessibility (focus management)

**Why:** Modal is separate concern. Refactor only after navigation layer is stable.

**Phase 5: Build & Deploy (Do Last)**
1. Remove old css/*.css and css/*.css.map from git
2. Configure vite.config.ts for production (minify, hash assets, lazy-load images)
3. Test production build locally (npm run build)
4. Deploy dist/ folder to static host
5. Monitor performance (check if clamp() scaling works on real 4K devices)

**Why:** Don't deploy until all refactoring is complete.

## Sources

- **Vite Official Docs:** https://vitejs.dev/
- **SCSS/Sass Guide:** https://sass-lang.com/documentation
- **CSS clamp() Overview:** https://web.dev/min-max-clamp/
- **Web Accessibility (ARIA):** https://www.w3.org/WAI/ARIA/
- **Responsive Design Techniques:** https://web.dev/responsive-web-design-basics/
- **Mobile-First Design Pattern:** https://www.nngroup.com/articles/mobile-first-web-design/
- **CSS Grid Auto-fit/Auto-fill:** https://css-tricks.com/auto-sizing-columns-css-grid-auto-fit-vs-auto-fill/

---

*Architecture research for: Vite migration + RWD refactor (horizontal slide gallery)*
*Researched: 2026-04-18*
*Confidence: HIGH*
