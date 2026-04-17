# Codebase Structure

**Analysis Date:** 2026-04-17

## Directory Layout

```text
baifan-club/
├── index.html          # Single HTML entry that defines the 9-page shell, navigation, and modal
├── css/                # Shared styles, per-page styles, compiled CSS, and source SCSS
├── js/                 # Vanilla interaction scripts
├── assets/             # Local images and fonts used by the pages
├── docs/               # Design/spec notes for the swipe framework and related work
├── 整體畫面圖/          # Reference screenshots for the page set
├── .vscode/            # Editor settings, including Live Sass compile output
└── .planning/          # Planning artifacts written by mapping/planning workflows
```

## Directory Purposes

**`css/`:**

- Purpose: Contains all shared and page-specific styling for the site.
- Contains: `base.scss`, `pages.scss`, `nav.scss`, `page-0.scss` through `page-8.scss`, `page-3-modal.scss`, compiled `.css` files, and source maps.
- Key files: `css/base.scss`, `css/pages.scss`, `css/nav.scss`, `css/page-0.scss`, `css/page-3-modal.scss`, `css/page-4.scss`.

**`js/`:**

- Purpose: Holds the interaction layer.
- Contains: `nav.js`.
- Key files: `js/nav.js`.

**`assets/`:**

- Purpose: Stores local runtime assets.
- Contains: `images/` and `fonts/`.
- Key files: `assets/images/homepage.png`, `assets/images/about.png`, `assets/images/customer.png`, `assets/images/about-glass.png`, `assets/images/customer-line-divider.png`, `assets/images/baifan.webp`, `assets/fonts/cwTeXQMing-Medium.ttf`, `assets/fonts/cwTeXQFangsong-Medium.ttf`.

**`docs/`:**

- Purpose: Holds design and implementation notes for the sliding-navigation framework.
- Contains: `docs/superpowers/specs/` and `docs/superpowers/plans/`.
- Key files: `docs/superpowers/specs/2026-04-08-bottom-nav-swipe-framework-design.md`, `docs/superpowers/plans/2026-04-08-bottom-nav-swipe-framework.md`.

**`整體畫面圖/`:**

- Purpose: Reference images for the visible page concepts and content sections.
- Contains: Section mock images used as visual references.
- Key files: `整體畫面圖/✦ 白飯俱樂部｜Rice Club ✦ 入口.png`, `整體畫面圖/顧客守則.png`, `整體畫面圖/關於.png`, `整體畫面圖/菜單.png`, `整體畫面圖/精彩瞬間.png`.

**`.vscode/`:**

- Purpose: Editor configuration for the workspace.
- Contains: Live Sass compile settings.
- Key files: `.vscode/settings.json`.

**`.planning/`:**

- Purpose: Generated planning and mapping artifacts.
- Contains: Codebase maps such as this document set.
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`.

## Key File Locations

**Entry Points:**

- `index.html`: Main document that loads every stylesheet, defines every section, and includes `js/nav.js`.
- `js/nav.js`: Navigation, touch gesture, and clerk modal behavior.

**Configuration:**

- `.vscode/settings.json`: Live Sass compile output is written to `/css` with expanded formatting.

**Core Logic:**

- `js/nav.js`: Page switching, swipe handling, modal open/close helpers.
- `css/pages.scss`: Viewport, track, and page shell.
- `css/nav.scss`: Bottom navigation presentation and active state.

**Testing/Preview:**

- `docs/superpowers/plans/2026-04-08-bottom-nav-swipe-framework.md`: The current framework plan and verification checklist.
- `整體畫面圖/`: Reference images for manual visual comparison.

## Naming Conventions

**Files:**

- Page styles follow `page-{n}.scss` and `page-{n}.css` naming, with `page-3-modal.scss` reserved for the clerk overlay.
- Shared styles use descriptive names such as `base.scss`, `pages.scss`, and `nav.scss`.
- JavaScript is centralized in `nav.js`.

**Directories:**

- Content and runtime assets are separated by type: `assets/images/` and `assets/fonts/`.
- Planning and spec material is kept under `docs/superpowers/`.

## Where to Add New Code

**New Page:**

- Primary code: add a new `<section class="page">` in `index.html` and a matching stylesheet such as `css/page-9.scss`.
- Tests/verification: add the matching nav item in `index.html` and verify the track count still matches `--page-count` in `css/base.scss`.

**New Page Interaction:**

- Implementation: extend `js/nav.js` and bind to new `data-nav-target` or `data-target` attributes.

**New Component/Module:**

- Implementation: place page-specific styling in `css/page-{n}.scss` and shared styling in `css/base.scss`, `css/pages.scss`, or `css/nav.scss` depending on scope.

**New Asset:**

- Images: `assets/images/`
- Fonts: `assets/fonts/`

**New Reference Material:**

- Planning/spec files: `docs/superpowers/`
- Visual references: `整體畫面圖/`

## Special Directories

**`assets/fonts/`:**

- Purpose: Local typefaces used by the custom heading and body styles.
- Generated: No.
- Committed: Yes.

**`assets/images/`:**

- Purpose: Backgrounds and supporting artwork for the page sections.
- Generated: No.
- Committed: Yes.

**`css/`:**

- Purpose: Holds both source SCSS and compiled CSS side by side.
- Generated: The `.css` and `.css.map` files are compile outputs.
- Committed: Yes.

**`.planning/`:**

- Purpose: Mapping artifacts for the repository.
- Generated: Yes.
- Committed: No evidence in the codebase; treat as workflow output.

---

_Structure analysis: 2026-04-17_
