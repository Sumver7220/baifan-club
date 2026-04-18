# 白飯俱樂部官網

## What This Is

白飯俱樂部的品牌形象官網，以全螢幕橫向滑動展示 9 個頁面（入口、品牌故事、顧客守則、店員介紹、菜單、特色服務、精彩瞬間、活動推廣、店內環境）。以純 HTML/CSS/JS 建構，Vite 驅動建置，部署為靜態主機。目前電腦版（≥768px）已實現沉浸式、無垂直捲動的全螢幕視覺體驗；行動版（≤767px）獨立布局重設計列為下一里程碑。

## Core Value

在任何螢幕尺寸（手機到 4K 大螢幕），電腦版無垂直捲動、一切畫面舒適滿版；手機版橫向滑動流暢自然。

## Requirements

### Validated

- ✓ 9 頁橫向滑動導覽框架（translateX track 機制）— existing
- ✓ 底部固定導覽列（active state + ARIA）— existing
- ✓ 觸控滑動手勢支援（touchstart / touchmove / touchend）— existing
- ✓ 店員卡片 Modal（data-clerk-id 驅動）— existing
- ✓ 頁面內 CTA 互跳（data-nav-target）— existing
- ✓ 鍵盤無障礙基本支援（tabindex, role="button"）— existing
- ✓ Pages 0–6, 8 完整樣式實作 — existing
- ✓ Vite 建置流程（`npm run dev/build/preview`，HMR，雜湊 assets）— v1.0
- ✓ SCSS `@use` 模組系統，`css/main.scss` 單一入口 — v1.0
- ✓ 動態頁數從 DOM 推導，消除硬編碼 — v1.0
- ✓ Clerk Modal delegated event listeners — v1.0
- ✓ `clamp()` 流體字型系統（桌機 320px–2560px 驗收通過）— v1.0
- ✓ `100dvh` + `100vh` fallback，iOS Safari address bar 修正 — v1.0
- ✓ 桌機圖片 `aspect-ratio` 防護（Pages 4/6/8）— v1.0

### Active

- [ ] **行動版布局重設計**：≤767px 可捲動長頁 + 錨點導航，移除 overflow:hidden 合約
- [ ] **`--font-hero` fluid variant**：評估是否切換為流體版本（advisory warning 待解）

### Out of Scope

- Page 7（斗內香檳王）內容開發 — 待與業主討論，本次凍結
- 功能新增（新頁面、新互動）— 尚未確定，延後討論
- JS Framework 遷移（React/Vue/Astro 等）— 靜態網站規模不需要
- 效能優化（圖片 lazy-load、字型優化）— 延後至 v2
- History API + 錨點深度連結 — 延後至 v2

## Context

- **v1.0 shipped 2026-04-19**
- 建置系統：Vite 5.x + PostCSS autoprefixer + Sass
- SCSS 模組化完成：`css/main.scss` 為唯一入口，所有 partials 透過 `@use` 載入
- 流體字型系統已建立：`:root` 中集中定義 `--font-*` clamp() tokens
- 桌機 RWD（768px–2560px）全面通過驗收：無垂直捲動、比例正確、觸控目標 ≥ 44px
- 行動版（≤767px）架構缺口已記錄：整站全螢幕 section + overflow:hidden 合約在手機系統性失效
- 店員圖片目前使用 `placehold.co` 外部服務，上線前需替換為本地資源
- Page 7 為 placeholder，目前不影響導覽流

## Constraints

- **Tech**: 保持 Vanilla JS，不引入 JS framework（業主網站規模不需要）
- **UX**: 電腦版任何視窗寬度下禁止出現垂直捲動（overflow hidden 策略維持）
- **Scope**: Page 7 凍結，不在本次工作範圍
- **Deploy**: 靜態主機部署，無 server-side 需求
- **相容性**: 現代瀏覽器（Chrome/Firefox/Safari 最新兩版）

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 引入 Vite 取代 Live Sass | 移除對 VS Code 擴充的依賴，提供 HMR、SCSS compile、asset bundling 統一流程 | ✓ Good — build pipeline 可重現，開發體驗改善 |
| Typography 以 `clamp()` + `vw` 縮放 | 純 CSS 解法，無需 JS 介入，可覆蓋從手機到 4K 的字體縮放需求 | ✓ Good — 桌機驗收通過，零斷點跳躍 |
| 保持 Vanilla JS | 網站規模小、互動邏輯簡單，框架帶來的複雜度不值得 | ✓ Good — 無需 framework |
| 行動版延後獨立 Phase | 整體架構需系統性重設計，非個別 bug 修補；owner 決策確認 | ✓ Good — 避免在 v1.0 引入大規模架構變動 |
| aspect-ratio 先 revert 再安全實作 | 初版廣泛加入 ratio 導致版面回退，改為低風險逐頁策略 | ✓ Good — 桌機最終通過，避免破壞性部署 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-19 after v1.0 milestone*
