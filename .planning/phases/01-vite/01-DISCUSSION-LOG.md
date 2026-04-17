# Phase 1: Vite 建置基礎 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 01-vite
**Areas discussed:** SCSS 整合策略

---

## SCSS 整合策略

### 選擇討論的範疇

| Option | Description | Selected |
|--------|-------------|----------|
| SCSS 整合策略 | 現有 9 個獨立 SCSS 在 Vite 下如何整合 | ✓ |
| Modal 遷移範圍 | Clerk only vs Clerk + Menu | |
| Build 輸出結構 | 保留 css/js/ 目錄 vs Vite 預設 assets/ | |
| SCSS 架構深度 | 建立共用模組 vs 最低限度遷移 | |

**User's choice:** SCSS 整合策略

---

### Bundle 策略

| Option | Description | Selected |
|--------|-------------|----------|
| 單一 CSS bundle | 建 main.scss @use 匯入所有 SCSS，Vite 輸出單一 CSS | ✓ |
| 保留多檔案結構 | Vite multi-entry，保留 9 個獨立 CSS 輸出 | |

**User's choice:** 單一 CSS bundle
**Notes:** 選擇了帶有代碼預覽的選項，顯示 main.scss + main.js import 的架構

---

### @use 遷移深度

| Option | Description | Selected |
|--------|-------------|----------|
| 建立共用模組 | 建立 _variables.scss、_mixins.scss 等共用模組 | ✓ |
| 最低限度遷移 | 只將 SCSS 封裝進 main.scss，不建共用模組 | |

**User's choice:** 建立共用模組
**Notes:** 為 Phase 2 RWD 改造預建骨架

---

### 共用模組內容

| Option | Description | Selected |
|--------|-------------|----------|
| 只放 SCSS compile-time 變數 | breakpoints、clamp 公式等；CSS custom properties 留在 base.scss | ✓ |
| 全部改用 SCSS 變數 | CSS custom properties 全搬到 SCSS $variables | |

**User's choice:** 只放 SCSS compile-time 變數
**Notes:** CSS custom properties 需要 JS runtime 動態注入（--page-count），不能改成 SCSS 變數

---

## Claude's Discretion

- `css/main.scss` 中 @use 的匯入順序
- `_variables.scss` 初始內容（只建框架）
- 是否建立 `_mixins.scss`（視實際重複狀況）
- `vite.config.js` 具體選項

## Deferred Ideas

- Menu Modal globalThis 遷移 — 同 Clerk Modal 問題，但不在 Phase 1 需求範圍
