# Retrospective

## Milestone: v1.0 — RWD 重構 + Vite 升級

**Shipped:** 2026-04-19
**Phases:** 2 | **Plans:** 7

### What Was Built

- Vite + PostCSS autoprefixer 建置骨架，取代 VS Code Live Sass 依賴
- SCSS `@use` 模組系統，`css/main.scss` 單一入口
- 動態頁數從 DOM `.page` 元素推導，消除所有硬編碼
- Clerk Modal delegated event listeners，移除 globalThis handler
- `clamp()` 流體字型系統，覆蓋 320px–2560px 桌機零斷點
- `100dvh` + `100vh` fallback，iOS Safari address bar 修正
- 桌機圖片 `aspect-ratio` 防護（Pages 4/6/8）
- 桌機 RWD 全面通過（1920px、2560px 無垂直捲動）

### What Worked

- **分波執行**：Wave 1（Typography/dvh/Images）先平行，Wave 2（Verification）後驗收，節奏清晰
- **早期 revert**：RWD-03 aspect-ratio 廣泛實作後快速 revert，避免帶著回退繼續開發
- **Playwright 驗收**：多斷點截圖比對讓視覺問題即時浮現，比純手動更可靠
- **分離架構決策**：行動版問題辨識為架構缺口而非 bug，果斷決定延後而非硬打

### What Was Inefficient

- RWD-03 來回三次（feat → revert → 安全重作）耗費額外工時；初版規劃應先評估 layout contract 相容性
- SUMMARY 文件有些資訊不完整（metrics duration 為 0），執行後應即時填寫

### Patterns Established

- `:root` 集中定義 `--font-*` clamp() tokens，各 page SCSS 只引用 token
- `height: 100vh; height: 100dvh;` 雙宣告 pattern for mobile viewport stability
- 圖片：gallery/hero 用 `object-fit: cover`，menu/clerk 用 `object-fit: contain`
- 遇到廣泛 layout 回退，立即 revert 而非逐一 debug

### Key Lessons

- 在引入 `aspect-ratio` 前，先確認目標元素是否已有 layout contract（flex/grid 高度限制）會衝突
- 行動版架構與桌機架構若核心合約不同（overflow vs scroll），應視為獨立設計而非 breakpoint 補丁
- Playwright 截圖在驗收階段比 console.log debug 更有效率

### Cost Observations

- 主要開發集中於 2026-04-18 單日
- Sessions: 多次（分 Wave 執行）
- 模式：budget profile（sonnet/haiku 混用）

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Key Risk | Outcome |
|-----------|--------|-------|----------|---------|
| v1.0 | 2 | 7 | aspect-ratio layout 回退 | Reverted + 安全重作，桌機通過 |
