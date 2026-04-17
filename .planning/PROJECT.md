# 白飯俱樂部官網

## What This Is

白飯俱樂部的品牌形象官網，以全螢幕橫向滑動展示 9 個頁面（入口、品牌故事、顧客守則、店員介紹、菜單、特色服務、精彩瞬間、活動推廣、店內環境）。以純 HTML/CSS/JS 建構，部署為靜態主機，不需後端。目標是在各種螢幕尺寸下提供沉浸式、無捲動的全螢幕視覺體驗。

## Core Value

在任何螢幕尺寸（手機到 4K 大螢幕），電腦版無垂直捲動、一切畫面舒適滿版；手機版橫向滑動流暢自然。

## Requirements

### Validated

<!-- 現有 codebase 已確立的能力 -->

- ✓ 9 頁橫向滑動導覽框架（translateX track 機制）— existing
- ✓ 底部固定導覽列（active state + ARIA）— existing
- ✓ 觸控滑動手勢支援（touchstart / touchmove / touchend）— existing
- ✓ 店員卡片 Modal（data-clerk-id 驅動）— existing
- ✓ 頁面內 CTA 互跳（data-nav-target）— existing
- ✓ 鍵盤無障礙基本支援（tabindex, role="button"）— existing
- ✓ Pages 0–6, 8 完整樣式實作 — existing

### Active

<!-- 本次工作目標 -->

- [ ] 完善 RWD：320px 到 2560px（4K）各斷點皆舒適呈現
- [ ] Typography 縮放：以 `clamp()` / `vw` 單位解決 4K 字體過小問題
- [ ] 重構：消除硬編碼頁數、解耦全域 handler、提升可維護性
- [ ] 引入 Vite build tool：取代 VS Code Live Sass 擴充依賴
- [ ] 效能優化：圖片 lazy-load、字型載入優化、減少首屏載入時間

### Out of Scope

- Page 7（斗內香檳王）內容開發 — 待與業主討論，本次凍結
- 功能新增（新頁面、新互動）— 尚未確定，延後討論
- JS Framework 遷移（React/Vue/Astro 等）— 靜態網站規模不需要

## Context

- 目前開發基準為 1920×1080（24 吋），在此解析度下視覺完美
- 27 吋 4K 螢幕部分文字過小，主因是 CSS 以固定 `px` 為主，缺乏 viewport 相對單位的系統性應用
- SCSS source 與編譯後 CSS 並排存放，完全依賴 VS Code Live Sass Compiler 擴充功能，無可重現的 build 流程
- 頁數（9）硬編碼散落於 `css/pages.scss`（L15, L34）及 `js/nav.js`（L97, L100）多處
- 店員圖片目前使用 `placehold.co` 外部服務，上線前需替換為本地資源
- Page 7 為 placeholder，目前不影響導覽流，但 UX 有明顯斷點

## Constraints

- **Tech**: 保持 Vanilla JS，不引入 JS framework（業主網站規模不需要）
- **UX**: 電腦版任何視窗寬度下禁止出現垂直捲動（overflow hidden 策略維持）
- **Scope**: Page 7 凍結，不在本次工作範圍
- **Deploy**: 靜態主機部署，無 server-side 需求
- **相容性**: 現代瀏覽器（Chrome/Firefox/Safari 最新兩版）

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 引入 Vite 取代 Live Sass | 移除對 VS Code 擴充的依賴，提供 HMR、SCSS compile、asset bundling 統一流程 | — Pending |
| Typography 以 `clamp()` + `vw` 縮放 | 純 CSS 解法，無需 JS 介入，可覆蓋從手機到 4K 的字體縮放需求 | — Pending |
| 保持 Vanilla JS | 網站規模小、互動邏輯簡單，框架帶來的複雜度不值得 | — Pending |

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
*Last updated: 2026-04-18 after initialization*
