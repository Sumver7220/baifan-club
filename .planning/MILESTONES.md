# Milestones

## v1.0 — RWD 重構 + Vite 升級

**Shipped:** 2026-04-19
**Phases:** 1–2 | **Plans:** 7 | **Tasks:** ~14

### Delivered

引入 Vite 建置流程取代 VS Code Live Sass，全面 SCSS 模組化，並以 clamp() 流體字型 + 100dvh fallback + aspect-ratio 圖片防護實現桌機（768px–2560px）完整 RWD 響應。

### Key Accomplishments

1. Vite + PostCSS autoprefixer 建置骨架建立，可重現的 `npm run dev/build/preview` 流程
2. SCSS `@import` → `@use` 全面遷移，`css/main.scss` 單一入口
3. 動態頁數從 DOM `.page` 元素推導，消除 `js/nav.js` 與 `css/pages.scss` 硬編碼
4. Clerk Modal 從 `globalThis` 全域 handler 遷移至 delegated event listeners
5. `clamp()` 流體字型系統，覆蓋 320px–2560px 零斷點跳躍
6. `100dvh` + `100vh` fallback，修正 iOS Safari address bar 位移

### Known Gaps at Close: 1 (see STATE.md Deferred Items)

- RWD-01/02/03 桌機通過；行動版（≤767px）系統性架構缺口移交下一 Phase

### Archives

- `.planning/milestones/v1.0-ROADMAP.md`
- `.planning/milestones/v1.0-REQUIREMENTS.md`
