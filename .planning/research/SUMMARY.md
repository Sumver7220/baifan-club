# Project Research Summary

**Project:** 白飯俱樂部官網
**Domain:** 靜態品牌形象網站 RWD 重構 + Build Tool 升級
**Researched:** 2026-04-18
**Confidence:** HIGH

## Executive Summary

白飯俱樂部官網是一個以橫向滑動為導覽的全螢幕靜態品牌網站，目前以純 Vanilla HTML/SCSS/JS 構建，已有正確的觸控手勢、底部導覽與無垂直捲動架構。重構目標分兩條主線：(1) 引入 Vite 取代 VS Code Live Sass 擴充，建立可重現的 build 流程；(2) 系統性 RWD 改造，使用 CSS `clamp()` 讓字體與間距從 320px 到 2560px（4K）流暢縮放。

建議採用分階段交付：先穩定 build 基礎與程式碼重構（Phase 1），再系統性補齊 RWD（Phase 2），最後效能優化（Phase 3）。Phase 1 是關鍵路徑——在 SCSS 模組系統與 asset 路徑確認正確前，不應進行任何 CSS 大規模修改。

主要風險：`overflow: hidden` 策略在手機端可能裁切內容；`100vh` 在 iOS Safari 有已知問題需換用 `100dvh`；SCSS `@import` → `@use` 遷移必須整批完成，不可漸進。

## Key Findings

### Recommended Stack

Vite 5.x + Dart Sass 是 2025 年靜態網站的標準工具鏈。Vite 提供 HMR、資源雜湊、SCSS 原生支援，完全取代 VS Code Live Sass 的手動編譯依賴。PostCSS + Autoprefixer 負責 `clamp()`、`backdrop-filter`、`safe-area-inset` 等 vendor prefix。

**Core technologies:**
- **Vite 5.x**: build tool / HMR / asset bundling — 2025 靜態網站標準，zero-config SCSS 支援
- **Sass (Dart Sass 1.68+)**: SCSS 編譯器 — 官方維護版本，`@use` 模組系統
- **PostCSS + Autoprefixer**: vendor prefix — 覆蓋 `clamp()`、`safe-area-inset`、`backdrop-filter`
- **CSS `clamp(min, fluid, max)`**: 流體字型與間距 — 純 CSS，無需 JS，覆蓋 320px–2560px
- **Vanilla JS ES2020+**: 互動邏輯 — 保持現有架構，Vite 不改變 JS 邏輯

### Expected Features

**Must have (table stakes):**
- Typography 縮放（`clamp()`）— 所有文字在所有斷點可讀
- 圖片 `aspect-ratio` + `object-fit: cover` — 防止變形
- 觸控目標 ≥ 44×48px — 手機可用性基準
- Responsive spacing（`clamp()`）— 間距隨視口縮放
- `100dvh` 替換 `100vh` — iOS Safari address bar 修正

**Should have (differentiators):**
- `safe-area-inset` 支援（劉海螢幕）
- Page anchors + History API（可分享連結）
- 相鄰頁圖片預載
- 圖片 lazy-load（Intersection Observer）
- 字型優化（subset + `font-display: swap`）

**Defer (v2+):**
- 暗色模式、多語系、orientation 處理

### Architecture Approach

採用清晰分層的模組結構：Design Token Layer（CSS 變數）→ Typography Scale（clamp() 系統）→ Layout Shell（viewport/track/page）→ Navigation Handler → Gesture Handler → Modal Controller → Page Config。頁數從 DOM 動態讀取，消除硬編碼 `9`。

**Major components:**
1. **Design Token Layer** — 顏色、間距、斷點、timing 的唯一來源（`tokens.scss`）
2. **Typography Scale** — `clamp()` 流體字型，覆蓋 320px–2560px
3. **Navigation / Gesture / Modal** — 解耦後的獨立 handler，delegated event listeners 取代 `globalThis`
4. **Page Config** — 頁數從 DOM `document.querySelectorAll('.page').length` 推導

### Critical Pitfalls

1. **Overflow Hidden + RWD 衝突** — `overflow: hidden` 在手機端裁切放大內容；需依斷點區分，手機端改用 `overflow: visible`
2. **SCSS @import → @use 必須整批遷移** — 不可漸進；混用導致變數重複、編譯衝突；遷移前先建立 barrel `@forward` 檔
3. **Vite Asset 路徑解析** — `url('assets/images/...')` 在 Vite 中路徑雜湊後失效；改用相對路徑或 CSS 變數，`npm run build` 後驗證無 404
4. **clamp() 邊界過激** — min 太高在 320px 擠版；max 太小在 4K 仍小；需在 320px/1920px/2560px + zoom 150% 實際測試
5. **100vh vs 100dvh** — `100vh` 在 iOS Safari 包含隱藏的 address bar 導致位移；改用 `100dvh` 並加 fallback

## Implications for Roadmap

### Phase 1: Vite 建置基礎 + 程式碼重構
**Rationale:** build 系統穩定是所有 CSS 修改的前提；硬編碼頁數與全域 handler 必須先解除，否則 RWD 修改風險極高
**Delivers:** `npm run dev` / `npm run build` 正常運作；SCSS `@use` 模組系統；消除硬編碼頁數；Modal 改用 delegated listeners
**Avoids:** SCSS 模組衝突、Vite asset 路徑錯誤、全域 handler 狀態洩漏

### Phase 2: RWD 系統性重構
**Rationale:** 依賴 Phase 1 的 token/typography 架構；build 穩定後才安全大規模修改 CSS
**Delivers:** `clamp()` 流體字型全面套用；`100dvh` 修正；圖片 `aspect-ratio`；觸控目標審計；320px–2560px 全斷點驗收
**Uses:** Dart Sass `@use`、CSS `clamp()`、`100dvh`、PostCSS Autoprefixer

### Phase 3: 效能優化與收尾
**Rationale:** UX 正確後才優化；不要過早優化
**Delivers:** 圖片 lazy-load、字型預載優化、`placehold.co` 替換本地資源、production build 驗收

### Phase Ordering Rationale

- Phase 1 先行：Typography token 定義了 Phase 2 的設計空間；SCSS 模組系統不穩定不應進行大規模 CSS 修改
- Phase 2 在 Phase 1 之後：`clamp()` 值需要在穩定的 build 環境中測試；overflow 修正依賴乾淨的斷點系統
- Phase 3 最後：lazy-load 和字型優化屬於錦上添花，不影響核心 RWD 正確性

### Research Flags

- **Phase 2 (RWD Testing):** 需要真實 iOS Safari / Android Chrome 設備驗證 `100dvh` 行為；emulator 不可靠
- **Phase 3 (CJK Font Subsetting):** 繁體中文字型子集化較複雜，如不熟悉需額外研究

Phases with standard patterns (skip research-phase):
- **Phase 1:** Vite + Dart Sass 設定流程文件完整，按 STACK.md checklist 執行即可
- **Phase 3:** Intersection Observer lazy-load 是標準 API，無需額外研究

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Vite 5.x + Dart Sass 為 2025 業界標準，官方文件驗證 |
| Features | HIGH | 基於 WCAG 2.1 + mobile UX 標準 |
| Architecture | HIGH | 符合現有 codebase 結構，Vite 模組系統成熟 |
| Pitfalls | MEDIUM | 訓練資料（2024–2025）+ codebase 分析；真實設備 RWD 行為需實測驗證 |

**Overall confidence:** HIGH

### Gaps to Address

- **真實設備 RWD 測試:** `100dvh` / overflow 行為在 iOS Safari 和 Android Chrome 上需實機測試
- **4K 顯示測試:** `clamp()` 邊界值需在 2560px+ 顯示器上調校
- **效能基準線:** 目前無 FCP/LCP 量測，Phase 1 應建立基準值

---
*Research completed: 2026-04-18*
*Ready for roadmap: yes*
