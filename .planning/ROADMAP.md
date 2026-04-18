# 白飯俱樂部官網 — Roadmap

**Project:** 白飯俱樂部官網  
**Scope:** v1 — RWD 重構 + Vite 升級  
**Granularity:** Coarse (3 phases)  
**Created:** 2026-04-18  

---

## Phases

- [x] **Phase 1: Vite 建置基礎** — 引入 Vite build tool 和 SCSS 模組系統，消除硬編碼頁數，遷移 Modal handler
- [x] **Phase 2: RWD 系統性重構** — 全面應用 clamp() 流體字型、修正 100dvh、加入 aspect-ratio 圖片縮放

---

## Phase Details

### Phase 1: Vite 建置基礎

**Goal:** 建立可重現的 build 流程、整合 SCSS 模組系統、消除硬編碼頁數，為大規模 CSS 改造奠定基礎

**Depends on:** Nothing (first phase)

**Requirements:** BUILD-01, BUILD-02, BUILD-03, BUILD-04

**Success Criteria** (what must be TRUE):
1. `npm run dev` 啟動 HMR 開發伺服器，SCSS 改動自動刷新
2. `npm run build` 編譯到 `dist/` 資料夾，CSS 資源雜湊正確、無 404 路徑
3. SCSS `@use` 模組系統整批遷移完成，消除 `@import` 重複規則與命名衝突
4. 頁數從 DOM `.page` 元素數量動態推導，`css/pages.scss` 與 `js/nav.js` 無硬編碼 `9`
5. Modal 互動遷移至 delegated event listeners，消除 inline `onclick` 與 `globalThis` 全域 handler

**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md - 建立 Vite 與 PostCSS 建構骨架（BUILD-01）
- [x] 01-02-PLAN.md - SCSS 單一入口與模組載入切換（BUILD-02）
- [x] 01-03-PLAN.md - 動態頁數與 Clerk Modal delegated listeners（BUILD-03, BUILD-04）

**UI hint:** no

---

### Phase 2: RWD 系統性重構

**Goal:** 使用 `clamp()` 與 `100dvh` 實現 320px–2560px 全尺寸流暢縮放，修正 iOS Safari 位移，加入圖片比例防護

**Depends on:** Phase 1

**Requirements:** RWD-01, RWD-02, RWD-03

**Success Criteria** (what must be TRUE):
1. 所有字體大小改用 `clamp(min, fluid, max)` 並在 320px、1920px、2560px 斷點驗證無視覺斷點
2. 全高度值從 `100vh` 改用 `100dvh` + `100vh` fallback，iOS Safari address bar 位移已修正
3. 主要圖片（hero、clerk 卡片、menu）加入 `aspect-ratio`，並依內容採用 `object-fit: cover/contain`，各斷點無比例變形
4. 觸控目標檢查完成，所有互動按鈕 ≥ 44×48px
5. 完整 RWD 驗收：在 320px 手機、1920px 電腦、2560px 4K 螢幕實測，無垂直捲動、版面舒適

**Plans:** 4 plans

Plans:
- [x] 02-01-PLAN.md — 字體系統化：所有硬編碼字體改為 `clamp()` 流體值（RWD-01）
- [x] 02-02-PLAN.md — 高度現代化：100dvh + fallback，iOS Safari 位移修正（RWD-02）
- [x] 02-03-PLAN.md — 圖片比例防護：cover 圖片比例約束 + menu 安全 contain 策略（RWD-03）
- [x] 02-04-PLAN.md — 完整 RWD 驗收：320px、1920px、2560px 斷點測試（所有需求）

**UI hint:** yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Vite 建置基礎 | 3/3 | Complete | 2026-04-18 |
| 2. RWD 系統性重構 | 4/4 | Complete | 2026-04-18 |

---

## v2 Deferred

效能優化與進階功能延後至後續 milestone：
- 圖片 lazy-load（Intersection Observer）
- 字型優化（CJK subset + `font-display: swap`）
- Page anchors + History API（可分享連結）
- Page 7（斗內香檳王）內容開發

## 行動版布局（新 Phase 待規劃）

Phase 2 驗證發現系統性架構缺口：現有全螢幕 section 合約（overflow:hidden + 底部 NAV 切換）在手機上整體失效。需獨立新 Phase：
- 建立 `≤767px` media query 布局層
- 移除行動版 `overflow: hidden`，改為可捲動長頁
- 底部 NAV 改為錨點跳轉
- 各 section 移除 `height: 100dvh` 限制
- 評估 `--font-hero` 是否切換為 `--font-hero-fluid`

---

*Roadmap updated: 2026-04-18*
