# Requirements

**Project:** 白飯俱樂部官網
**Scope:** v1 — RWD 重構 + Vite 升級
**Last updated:** 2026-04-18

## v1 Requirements

### Build & Refactor

- [x] **BUILD-01**: 引入 Vite 5.x 取代 VS Code Live Sass，提供 `npm run dev` / `npm run build` 可重現的 build 流程
- [x] **BUILD-02**: 全面遷移 SCSS `@import` → `@use`（整批完成，消除模組衝突與重複規則）
- [x] **BUILD-03**: 消除硬編碼頁數（`css/pages.scss` L15/L34、`js/nav.js` L97/L100），改為從 DOM 動態推導 `.page` 數量
- [x] **BUILD-04**: Clerk Modal handler 從 `globalThis.openClerkModal` / `closeClerkModal` 遷移至 delegated event listeners，移除 inline `onclick`

### RWD

- [ ] **RWD-01**: 所有字體大小從固定 `px` 改為 `clamp(min, fluid, max)`，覆蓋 320px–2560px（4K）流暢縮放，無斷點跳躍
- [ ] **RWD-02**: 全高度值從 `100vh` 改用 `100dvh` + `100vh` fallback，修正 iOS Safari address bar 導致的版面位移
- [ ] **RWD-03**: 主要圖片（hero、clerk 卡片、menu）加入 `aspect-ratio` + `object-fit: cover`，防止各斷點比例變形

## v2 Requirements (deferred)

延後至效能優化階段或後續討論：

- 圖片 lazy-load（Intersection Observer API）— 首屏外圖片按需載入
- 字型優化（CJK subset + `font-display: swap` + `<link rel="preload">`）— 減少 FCP
- 觸控目標 44×48px 全面審計 — 手機點擊可用性
- `safe-area-inset` 支援 — 劉海/動態島螢幕底部留白
- Page anchors + History API — 頁面可分享深度連結（`#page-2` 等）

## Out of Scope

- Page 7（斗內香檳王）內容開發 — 待與業主討論，本次凍結
- 功能新增（新頁面、新互動元件）— 尚未確定，下個 milestone 再議
- JS Framework 遷移（React/Vue/Astro 等）— 靜態網站規模不需要
- 後台管理或 CMS — 超出靜態網站範疇
- 自動化測試套件 — 不在 v1 範圍

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| BUILD-01 | Phase 1: Vite 建置基礎 | ✓ |
| BUILD-02 | Phase 1: Vite 建置基礎 | ✓ |
| BUILD-03 | Phase 1: Vite 建置基礎 | ✓ |
| BUILD-04 | Phase 1: Vite 建置基礎 | ✓ |
| RWD-01 | Phase 2: RWD 系統性重構 | ~ |
| RWD-02 | Phase 2: RWD 系統性重構 | ~ |
| RWD-03 | Phase 2: RWD 系統性重構 | ~ |
