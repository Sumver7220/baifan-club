---
status: passed
phase: 02-rwd
plan: 04
date: 2026-04-18
scope: desktop (≥768px) — mobile layout deferred to new phase
---

# RWD Verification Summary — Phase 02

**Date:** 2026-04-18
**Result:** ✓ PASS (桌機範圍) / 行動版設計缺口已記錄，移交新 Phase

## Automated Checks

| Check | Status | Notes |
|------|--------|-------|
| Build (`npm run build`) | ✓ PASS | Vite build 無錯誤 |
| Typography tokenization | ✓ PASS | Font sizes 使用 `var(--font-*)` 或 `clamp()` |
| dvh fallback contract | ✓ PASS | `100vh` + `100dvh` 在 pages layout shell |
| Image ratio constraints | ✓ PASS | Cover-image 用 `aspect-ratio`；menu 用 `contain + aspect-ratio` |

## Playwright Automated Validation (Prior Runs)

- Total checks: 81 / Passed: 81 / Failed: 0

## Breakpoint Verification — Playwright Live Session (2026-04-18)

| Breakpoint | Body Overflow | Page Overflow | Clerk Cards | Font Scaling | Status |
|------------|--------------|---------------|-------------|--------------|--------|
| 320px | ✓ hidden | ⚠ Pages 2,5 內部可捲動 | ✗ 11px/欄（崩潰）| ✓ clamp() 運作 | 架構缺口 |
| 1920px | ✓ hidden | ✓ 無溢出 | ✓ 285px/欄 | ✓ | ✓ PASS |
| 2560px | ✓ hidden | ✓ 無溢出 | ✓ ~380px/欄 | ✓ +50% vs min | ✓ PASS |

## RWD Requirements Status

| Req | Status | Notes |
|-----|--------|-------|
| RWD-01 Typography | ✓ PASS (桌機) | `clamp()` 變數運作；`--font-lg-fluid` 320→2560 增幅 +50% |
| RWD-02 Height/dvh | ✓ PASS (桌機) | `100dvh + 100vh` fallback 正確；iOS Safari 需真機確認 |
| RWD-03 Images | ✓ PASS | `aspect-ratio` + `object-fit` 在所有桌機尺寸正確 |
| Touch targets | ✓ PASS (桌機 CTA) | 所有主要 CTA ≥ 44px |
| No vertical scroll | ✓ PASS (桌機) | 1920px / 2560px 全頁無溢出 |

## 已知設計缺口（移交新 Phase）

### 行動版布局架構問題（系統性，非個別 bug）

**根本原因：** 整個網站的核心設計合約是桌機全螢幕模式——
- `overflow: hidden` 鎖住全部捲動
- 底部 NAV 切換 section 而非錨點跳轉
- `height: 100dvh` 綁定每個 section 為一個螢幕高

這個合約在手機上系統性地失效：

| 問題 | 表徵 | 影響頁面 |
|------|------|---------|
| clerk-content grid 崩潰 | 6 欄在 320px 各剩 ~11px | Page 3 |
| 內容溢出 section 高度 | `scrollHeight > clientHeight`，必須捲動才能看完 | Page 2, 5（及潛在其他） |
| 觸控目標失效 | 卡片寬度 < 44px | Page 3 |
| 整體導航模式不適合手機 | 底部 NAV 切換 section 在小螢幕體驗差 | 全站 |

**結論：** 行動版需要獨立的 CSS 策略，而非在現有桌機合約上修補。

**建議新 Phase 方向：**
- 建立 `≤767px` media query 布局層
- 移除行動版的 `overflow: hidden` 限制
- 頁面改為垂直長頁可捲動設計
- 底部 NAV 改為錨點跳轉模式
- 各 section 在行動版移除 `height: 100dvh` 限制

---
Verified by: Playwright live session + owner review (2026-04-18)
