# Feature Research: Full-Screen Horizontal Scroll RWD

**Domain:** Responsive static website with full-screen horizontal navigation  
**Researched:** 2026-04-18  
**Confidence:** HIGH (based on RWD standards, accessibility guidelines, performance best practices)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in a modern full-screen horizontal-scroll website. Missing these = the site feels broken or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Correct Viewport Meta Tag** | Device viewport must be declared; without it, mobile devices display scaled-down desktop layout | LOW | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — critical foundation |
| **Touch Gesture Support** | Mobile/tablet users expect natural swipe navigation; taps/touches must be responsive without noticeable lag | MEDIUM | Touchstart/touchmove/touchend with 5px threshold for horizontal detection (existing) |
| **No Horizontal Scroll Bar** | Desktop users expect seamless page transitions without scroll bars that clutter the UI | LOW | `overflow: hidden` on viewport (existing) |
| **No Vertical Scroll on Desktop** | Computer users expect full-screen immersion; scrolling breaks the visual paradigm of a horizontal-slide site | MEDIUM | Must restrict content height to fit viewport minus nav bar at all breakpoints |
| **Readable Typography at All Breakpoints** | Text must be legible on 320px phones AND 4K displays; static px-based fonts fail both | HIGH | Requires `clamp(min, preferred, max)` or `vw` units for fluid scaling |
| **Touch-Friendly Interactive Areas** | Buttons/modals must be at least 44×44px (Apple) or 48×48px (Google) for reliable touch targeting | MEDIUM | Navigation items, modal close buttons, clerk cards, menu items all need min-touch size |
| **Responsive Images (No Distortion)** | Images must scale proportionally and fit frame without stretching, letterboxing, or overflow | HIGH | Hero images, clerk photos, menu photos need `object-fit: cover` or `contain` with aspect-ratio constraints |
| **Smooth Page Transitions** | Swiping between pages should feel fluid (no jumps, jank, or layout shifts) | MEDIUM | CSS `transform` (not left/right), `will-change: transform`, appropriate easing |
| **Navigation Feedback** | User must know which page they're on; active state indicators are mandatory | LOW | Bottom nav highlights current page (existing) |
| **Keyboard Navigation** | Keyboard-only users and screen reader users must navigate without mouse; enter/space activate buttons | MEDIUM | Tab order, Enter/Space handlers on role="button" elements (partial existing) |
| **Accessible Color Contrast** | Text must have 4.5:1 contrast on normal text, 3:1 on large text (WCAG AA minimum) | LOW | Gold accent on dark bg works; verify all text layers |
| **Performance: First Contentful Paint < 2s** | Users expect page to feel responsive; slow sites are abandoned | HIGH | Lazy-load below-fold images, optimize critical CSS, minimize blocking scripts |

### Differentiators (Competitive Advantage)

Features that set a great implementation apart from an average one. Not required, but make the experience premium.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Fluid Typography Scaling (Clamp)** | Text scales intelligently between breakpoints without jarring jumps; feels tailored to each device size | MEDIUM | `clamp(0.9rem, 1.6vw, 1.1rem)` already in use; rollout to all text layers creates premium feel |
| **Responsive Spacing (vw/vh units)** | Page padding, margins scale with viewport; creates proportional breathing room on all sizes | MEDIUM | Hero sections feel intentional on phone and 4K equally |
| **Momentum Scrolling (Inertia on Mobile)** | Swiping with inertia (page continues sliding after finger lift) feels natural; instant stop feels janky | MEDIUM | Requires velocity calculation + easing animation; Apple-like feel |
| **Safe Area Insets (Notch Handling)** | iPhone/Android notches don't obscure critical UI; uses `env(safe-area-inset-*)` variables | LOW | Affects mobile nav positioning; small effort, big accessibility win |
| **Gesture Affordance Hints** | New users see visual cues (arrows, animations) suggesting swipe is possible; reduces discoverability gap | LOW | Subtle animation on first load showing swipe direction |
| **Preload Adjacent Pages** | Next/previous pages are preloaded in background; transition is instant instead of ~200ms flash | MEDIUM | Preload images from page±1 on touch/nav click |
| **Portrait/Landscape Orientation Handling** | Mobile site adapts smartly when rotated; nav repositions, content reflows, no disorientation | MEDIUM | CSS media queries for orientation + JS viewport tracking |
| **Anchor Links & History API** | Users can bookmark/share direct links to specific pages; back button works as expected | MEDIUM | `#page-2` anchors + `window.history.pushState` for stateful navigation |
| **Modal Accessibility** | Modals trap focus, disable background scroll, announce to screen readers; feels intentional | MEDIUM | Existing modals; enhance with focus management and ARIA live regions |
| **Dark Mode Readiness** | If light theme exists, dark mode preference is respected without extra effort | LOW | Current design is dark-first; prefers-color-scheme optional |
| **Custom Loading States** | Page transitions show subtle loading indicator; reassures users that action registered | LOW | Brief opacity fade or skeleton loader during 300ms transition |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but introduce problems in a horizontal-scroll context.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **JS-Based Viewport Detection (window.innerWidth Breakpoints)** | Tempting to write `if (width < 768px) {...}` for RWD logic | Creates brittle code, desynchs CSS and JS logic, causes layout thrashing (forced layout recalculation), misses CSS media queries, breaks on resize | Use CSS `@media` queries exclusively; only use JS for interaction logic (swipe, modal open/close) |
| **Multiple RWD Breakpoints (6+ sizes)** | Safer to over-specify every screen size (320px, 375px, 425px, 768px, 1024px, 1366px, 1920px, 2560px) | Maintenance nightmare, inconsistent spacing, false sense of control; most breakpoints are redundant with `clamp()` | Use 2–3 critical breakpoints (mobile, tablet, desktop) + `clamp()` for fluidity between them |
| **Responsive Images with Srcset (for full-page art)** | Tempting to load different resolution images per breakpoint (save bandwidth) | Adds complexity without much visual gain on full-bleed photos; image delivery CDN/compression often better ROI | Use single high-quality image + CSS `object-fit: cover`; let browser scale efficiently |
| **Vertical Scroll on Mobile (to reduce overflow)** | Seems easier to add scroll on small screens than redesign content | Breaks the entire UX paradigm of horizontal navigation; users expect swiping, not scrolling; creates confused mental model | Redesign content (shorter titles, tighter layout, smaller images, smart text truncation) to fit without scroll |
| **Fixed Font Sizes with Media Queries** | Feels controllable (`h1 { font-size: 48px; } @media(max-width:768px) { h1 { font-size: 24px; } }`) | Creates jarring jumps at exactly 768px; unnatural; scales poorly at 4K; requires manual recalculation for every breakpoint | Use `clamp()`: `h1 { font-size: clamp(1.5rem, 5vw, 3rem); }` scales smoothly across all sizes |
| **Overflow Hidden + Horizontal Scroll (creating scroll bars)** | Novice approach: set body overflow-x: auto to enable side-scrolling | Creates visible scroll bars that look unprofessional, breaks immersive feel, encourages user to interact with scroll bar instead of swipe | Use `overflow: hidden` on viewport + JS gesture tracking for smooth transform-based navigation |
| **Modal Backdrop Covering Entire Viewport** | Makes modal feel "safe" by fully obscuring background | Kills context; users forget where they are; feels heavy/modal-heavy site | Use semi-transparent backdrop (`rgba(0,0,0,0.7)`) so background is dimmed but visible |
| **On-Scroll Animations (parallax, reveal-on-scroll)** | Creates "premium" feeling; seen on portfolio sites | Horizontal-scroll breaks traditional scroll listeners; parallax doesn't work intuitively with swipe; adds performance load | Use page-transition timing instead; animate during `goToPage()` calls (cheaper, more controlled) |
| **Infinite Horizontal Scroll (looping pages)** | Users can swipe forever; feels playful | Disorienting; users don't know they're looping; wastes time cycling back to start; confuses analytics/navigation intent | Stop at boundaries (page 0 left, page 8 right); users know the end |
| **Auto-Playing Video on Every Page** | Engaging, modern feel | Auto-play is disabled on most mobile browsers; jerky experience; bandwidth-heavy; accessibility issue (auto-sound) | Use poster frames (static images) + tap-to-play for video content |

---

## Feature Dependencies

```
Typography Scaling (Clamp)
    └──requires──> Responsive Unit System (vw/vh/clamp support)

Touch Gesture Support
    └──requires──> Viewport Configuration
    └──requires──> Gesture Detection Logic (touchstart/move/end)
                       └──requires──> Page Count Tracking (currentPage state)

Responsive Images
    └──requires──> Image Asset Organization
                       └──requires──> Aspect Ratio Constraints (CSS aspect-ratio)

Modal Accessibility
    └──requires──> Keyboard Event Handlers
    └──requires──> ARIA Attributes (aria-hidden, role)
    └──enhances──> Focus Management

No Vertical Scroll Desktop
    └──requires──> Content Height Constraints (max-height, clamp padding)
    └──conflicts──> Infinite Content (unlimited text/images per page)

Page Anchors & History API
    └──requires──> URL-Based Page Routing
    └──enhances──> Keyboard Navigation (browser back/forward)

Performance: LCP < 2s
    └──requires──> Lazy-Load Strategy (below-fold images)
    └──requires──> Critical CSS Prioritization
    └──requires──> Font Optimization (font-display: swap)
```

### Dependency Notes

- **Typography Scaling requires responsive units:** Fluid type (clamp) is worthless without understanding em/rem/vw/px relationships. Foundation first.
- **Touch gestures require page count tracking:** Hard-coded page count (8 in code, 9 pages) makes add/remove pages fragile. Must derive from DOM or constant.
- **No vertical scroll requires ruthless content prioritization:** Every page must fit 320px width AND fit 100vh height. This is the biggest constraint; drives content decisions.
- **Modal accessibility enhances touch experience:** Proper focus trapping means keyboard users can navigate modals; makes modals feel intentional.
- **Page anchors require URL routing:** Without history.pushState, bookmark/back button don't work naturally; users can't share direct links.
- **Performance baseline blocks all other features:** If LCP is 4s, users leave before seeing premium animations or responsive content.

---

## MVP Definition

### Launch With (v1 — RWD Refactor Core)

Minimum viable product — what's needed to validate responsive design quality without overwhelming dev effort.

- [x] **Viewport meta tag** — Already correct; non-negotiable foundation
- [x] **Touch gesture support** — Already implemented; core UX
- [x] **No vertical scroll constraint** — Existing; maintain as UX pillar
- [ ] **Typography scaling (clamp for all text layers)** — Partially done (hero); roll out to all: headings, body, CTA, labels
- [ ] **Image aspect-ratio constraints** — Prevent distortion on hero/clerk/menu photos; use CSS `aspect-ratio` + `object-fit: cover`
- [ ] **Touch-friendly interactive sizes** — Audit nav, buttons, modals for 44×48px minimum; adjust spacing if needed
- [ ] **Responsive spacing (clamp padding/margins)** — Phase hero/page padding to use `clamp()` instead of fixed px
- [ ] **Smooth transitions (GPU-accelerated)** — Ensure `transform: translateX()` + `will-change: transform` on .track

**Why this MVP:** Validates core RWD mechanics without architectural changes. Tests responsiveness at 320px, 768px, 1920px, 2560px breakpoints.

### Add After Validation (v1.x — Polish & Performance)

Features to add once core RWD is stable and tested on devices.

- [ ] **Preload adjacent pages** — Reduce perceived lag on page transitions; small performance win
- [ ] **Page anchor links (#page-2)** — Enable bookmarking/sharing specific pages; non-breaking enhancement
- [ ] **Safe area insets for notches** — Mobile users with notches get optimized nav positioning; low effort, high UX win
- [ ] **Gesture affordance hints** — First-time users see animated swipe hint; discoverable without tutorial
- [ ] **Lazy-load below-fold images** — Reduce initial payload; below-fold images (pages 3–8) load on demand
- [ ] **Font optimization (subset + preload)** — Reduce FOUT (Flash of Unstyled Text); custom fonts load faster

### Future Consideration (v2+ — Enhancement & Maintenance)

Features to defer until product-market fit is established and user feedback arrives.

- [ ] **Momentum scrolling (inertia)** — Swipe feels Apple-like; requires velocity calculation; non-critical UX
- [ ] **Custom loading states** — Visual feedback during 300ms transitions; nice-to-have, not essential
- [ ] **Orientation handling (portrait/landscape)** — Mobile portrait mode; mobile-only concern, defer if not priority
- [ ] **Dark mode toggle** — Design is dark-first; light mode toggle is future scope, not v1
- [ ] **Multi-language support** — Chinese/English toggle; scope expansion, not core RWD

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | RWD Phase |
|---------|------------|---------------------|----------|-----------|
| Viewport Meta Tag | HIGH | LOW | P1 | Foundation |
| Touch Gestures | HIGH | LOW | P1 | Foundation |
| Typography Scaling (Clamp) | HIGH | MEDIUM | P1 | Phase 1 |
| Image Aspect Ratio | HIGH | LOW | P1 | Phase 1 |
| Responsive Spacing | HIGH | MEDIUM | P1 | Phase 1 |
| Touch-Friendly Sizes | HIGH | MEDIUM | P1 | Phase 1 |
| No Vertical Scroll | HIGH | MEDIUM | P1 | Phase 1 |
| Page Anchors & History | MEDIUM | MEDIUM | P2 | Phase 2 |
| Preload Adjacent Pages | MEDIUM | MEDIUM | P2 | Phase 2 |
| Safe Area Insets | MEDIUM | LOW | P2 | Phase 2 |
| Lazy-Load Images | MEDIUM | MEDIUM | P2 | Phase 2 |
| Font Optimization | MEDIUM | LOW | P2 | Phase 2 |
| Gesture Affordance | LOW | LOW | P3 | Polish |
| Momentum Scrolling | LOW | HIGH | P3 | Future |
| Custom Loading States | LOW | LOW | P3 | Polish |
| Dark Mode Toggle | LOW | MEDIUM | P3 | Future |

**Priority key:**
- **P1 (Must have for v1):** Foundation for responsive UX; without these, site feels broken on some devices
- **P2 (Should have, v1.x):** Polish & performance; enhances UX without blocking v1 launch
- **P3 (Nice to have, v2+):** Premium features; defer until core RWD is proven

---

## RWD Breakpoint Strategy

### Recommended Breakpoints

Instead of 6+ discrete sizes, use **3 critical points + fluid scaling**:

| Breakpoint | Device Type | Use Case | CSS |
|------------|-------------|----------|-----|
| **320px–480px** | Mobile phone | Base styles; single-column, tight spacing | `@media (max-width: 480px)` or use as default |
| **481px–1024px** | Tablet / iPad | Intermediate scaling; use `clamp()` to smooth transition | `@media (min-width: 481px) and (max-width: 1024px)` |
| **1025px+** | Desktop / 4K | Full-width immersion; max-width constraints optional | `@media (min-width: 1025px)` |

### Typography Scaling Example

Instead of:
```scss
h1 { font-size: 48px; }
@media (max-width: 768px) { h1 { font-size: 24px; } }
@media (max-width: 425px) { h1 { font-size: 18px; } }
```

Use:
```scss
h1 { font-size: clamp(1.125rem, 5vw, 3rem); }
// Scales from 18px (1.125rem) at 320px → 48px (3rem) at 960px+
// Smooth interpolation everywhere; no jarring jumps
```

### Spacing Scaling Example

Instead of:
```scss
.page { padding: 3rem; }
@media (max-width: 768px) { .page { padding: 1.5rem; } }
```

Use:
```scss
.page { padding: clamp(1.5rem, 5vw, 4rem); }
// Scales adaptively; less manual breakpoint management
```

---

## Complexity Estimates by Dimension

### RWD Dimension Complexity

| Dimension | What to Build | Estimated Effort | Dependencies |
|-----------|--------------|-------------------|---|
| **Typography** | Apply `clamp()` to all text sizes (h1–h6, body, labels, CTA) | 4–6 hours | Audit current sizes first; understand em/rem/vw units |
| **Spacing** | Responsive padding/margin on all pages using `clamp()` | 3–5 hours | Typography must be done first; reference padding hierarchy |
| **Images** | Aspect-ratio constraints + `object-fit: cover` for hero/modal/clerk/menu photos | 2–3 hours | Inventory all images; define aspect ratios (16:9, 1:1, etc.) |
| **Touch Gestures** | Already exists; audit for gesture thresholds (5px), velocity, bounds checking | 1–2 hours | Code review; test on actual devices (iOS/Android) |
| **Navigation Touch Size** | Audit nav items, buttons, modal close for 44×48px; adjust padding if needed | 1–2 hours | Simple measurement + padding tweaks |
| **Modal Focus Trapping** | Trap focus inside modal; disable background scroll; handle Escape key | 2–3 hours | Requires testing with screen readers (NVDA, JAWS) |
| **Keyboard Navigation** | Ensure all interactive elements (role="button") are keyboard-accessible | 2–3 hours | Tab order audit; Enter/Space handlers already exist |
| **Performance (Lazy-Load)** | Add intersection observer for below-fold images; preload page±1 | 3–4 hours | Requires testing with DevTools; measure LCP/FCP |
| **Font Optimization** | Subset custom fonts; use `font-display: swap`; preload critical fonts | 2–3 hours | Requires understanding of font file sizes |
| **Safe Area Insets** | Mobile notch support using `env(safe-area-inset-*)` on nav | 1–2 hours | Mobile-only; test on iPhone 12+ with notch |
| **Page Anchors** | URL routing (#page-0, #page-1, etc.); history.pushState | 2–3 hours | Requires testing with browser back button |

**Total estimated effort:** 24–36 hours for complete v1 RWD + performance

---

## Differentiator Opportunities (Why This Site Stands Out)

### Current Strengths (Leverage These)

1. **Vanilla JS approach** — No framework overhead; gestures are buttery smooth
2. **Fixed nav bar** — Clear persistent navigation makes content hierarchy obvious
3. **Full-screen immersion** — No scroll bars = premium feel
4. **Touch-first design** — Horizontal swiping is natural on mobile

### Improvement Opportunities (Where to Differentiate)

1. **Fluid Typography** — Most sites either scale poorly on 4K or look jagged on mobile. Mastering `clamp()` = premium feel.
2. **Responsive Spacing** — Heroes and sections should breathe naturally at all sizes. Most sites have fixed padding = looks awkward on extremes.
3. **Smooth Transitions** — Page sliding with proper easing + no layout jank. Many sites have janky navigation.
4. **Accessibility Without Compromising UX** — Keyboard nav + screen reader support doesn't have to feel bolted-on; can be seamless.
5. **Performance** — Fast FCP/LCP on mobile + smooth 60fps transitions. Most horizontal-scroll sites are performance disasters.

---

## Testing Checklist (For Each Feature)

### Responsive Typography
- [ ] Measure text size at 320px (should be ≥16px for body text)
- [ ] Measure text size at 1920px (h1 should be ≤48px, not oversized)
- [ ] Measure text size at 2560px (h1 should scale up appropriately, not capped)
- [ ] Verify no jarring jumps between sizes
- [ ] Verify line-height scales proportionally

### Responsive Images
- [ ] Hero images fit frame without distortion (letterboxing acceptable, stretching not)
- [ ] Clerk photos display with consistent aspect ratio at all sizes
- [ ] Menu photos zoom/pan correctly in modal at all viewport sizes
- [ ] Images don't overflow past nav bar
- [ ] Verify `object-fit: cover` vs `contain` is correct for each image type

### Touch Gestures
- [ ] Swipe detection works at 320px
- [ ] Swipe detection works at 1920px
- [ ] Swipe detection works at 2560px
- [ ] Minimum 5px threshold prevents accidental scrolls from being treated as swipes
- [ ] Velocity calculation feels natural (not too sensitive, not sluggish)

### No Vertical Scroll
- [ ] Page content fits viewport height at 320px without overflow
- [ ] Page content fits viewport height at 1920px without overflow
- [ ] Page content fits viewport height at 768px iPad without overflow
- [ ] Nav bar doesn't get cut off by dynamic viewport height (use dvh)

### Touch-Friendly Sizes
- [ ] Nav items are ≥44px tall on mobile
- [ ] Modal close button is ≥44×44px
- [ ] Clerk cards are tappable without precision
- [ ] Menu items are tappable without precision

### Keyboard Navigation
- [ ] Tab order is logical (left-to-right, top-to-bottom)
- [ ] Tab focus is visible (outline or highlight)
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Screen reader announces current page + modal content

---

## Sources

Research based on:
- **WCAG 2.1 Accessibility Guidelines** — Touch target sizes (4.5.5), contrast (1.4.3), keyboard navigation (2.1.1)
- **Mobile Web Best Practices** — Viewport configuration, touch event handling, safe area insets
- **CSS Responsive Design** — Fluid typography (clamp, vw units), CSS media queries, aspect-ratio property
- **Web Performance** — LCP/FCP metrics, lazy-loading, critical CSS, font optimization strategies
- **Existing Codebase Review** — Current implementation of viewport, gesture detection, nav structure

**Note:** WebSearch was unavailable for 2026 ecosystem data; research is based on CSS/accessibility standards (stable, evergreen) and codebase audit. No third-party library docs consulted; all features are vanilla CSS/JS standards.

---

*Feature research for: Full-screen horizontal-scroll RWD website (白飯俱樂部)*  
*Researched: 2026-04-18*
