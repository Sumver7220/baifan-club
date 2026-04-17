# Phase 1: Vite 建置基礎 - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

建立可重現的 build 流程（Vite 5.x 取代 VS Code Live Sass）、整合 SCSS 模組系統（@use 架構 + 共用模組）、消除硬編碼頁數（BASE-01 → JS 動態推導）、遷移 Clerk Modal handler 至 delegated event listeners。

涵蓋需求：BUILD-01、BUILD-02、BUILD-03、BUILD-04

</domain>

<decisions>
## Implementation Decisions

### SCSS 整合架構

- **D-01:** 單一 CSS bundle — 建立 `css/main.scss` 作為 SCSS 統一 entry point，用 `@use` 依序匯入所有 9 個頁面 SCSS 及共用模組，Vite 輸出一個 hashed CSS 檔（`dist/assets/main-[hash].css`）
- **D-02:** `index.html` 移除所有 `<link rel="stylesheet" href="css/*.css">`，改為 `<script type="module" src="/js/main.js">`，`main.js` 頂端 `import '../css/main.scss'`

### SCSS 共用模組架構

- **D-03:** 建立 `css/shared/_variables.scss`，存放 **SCSS compile-time 常數**：breakpoints（$bp-mobile, $bp-tablet, $bp-4k）、clamp() 公式參考值（$font-min, $font-fluid, $font-max 等）。為 Phase 2 RWD 改造預留骨架
- **D-04:** CSS custom properties（`--page-count`、`--nav-height`、color tokens 等 runtime 值）**繼續留在 `base.scss :root`**，不搬至 SCSS 變數，避免 JS 動態注入失效
- **D-05:** 可視需求建立 `css/shared/_mixins.scss`（如 respond-to mixin），但 Phase 1 不強制——由 Claude 依實際 SCSS 重複狀況決定

### 動態頁數推導

- **D-06:** `--page-count` 改由 JS 在 DOMContentLoaded 前讀取 `document.querySelectorAll('.page').length` 動態注入：`document.documentElement.style.setProperty('--page-count', count)`；同時消除 `nav.js` 中的 `8`（hardcoded `totalPages - 1`）
- **D-07:** `base.scss :root` 中的 `--page-count: 9` 可保留為靜態 fallback，但 JS 啟動後立即覆蓋

### Modal Handler 遷移

- **D-08:** **只遷移 Clerk Modal**（BUILD-04 範圍）— `globalThis.openClerkModal` / `closeClerkModal` 改為 delegated event listeners on `document`，移除 `index.html` 中的 inline `onclick`
- **D-09:** Menu Modal（`globalThis.openMenuModal` 等）**本 phase 不動**，維持現狀。如需一起清理，記錄為延伸任務由執行者判斷是否順手處理

### Claude's Discretion

- `css/main.scss` 中 `@use` 的匯入順序（base → tokens → pages → nav → page-0..8 → modal）
- `_variables.scss` 的初始變數內容（只建框架，Phase 2 再填 clamp 值）
- 是否建立 `css/shared/_mixins.scss`（若無可共用 mixin，跳過）
- `vite.config.js` 的具體選項（`publicDir`、`sourcemap`、PostCSS 整合）

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 需求規格
- `.planning/REQUIREMENTS.md` — BUILD-01 ~ BUILD-04 完整需求說明與驗收條件
- `.planning/ROADMAP.md` §Phase 1 — Success Criteria 5 項（npm run dev / build 驗收）

### 研究文件
- `.planning/research/STACK.md` — Vite 5.x 安裝步驟、vite.config.js 範本、postcss.config.js、package.json scripts、file structure after migration（已含完整 checklist）
- `.planning/research/PITFALLS.md` — 已知踩坑清單（若存在）

### 現有程式碼關鍵位置
- `css/base.scss` L89 — `--page-count: 9`（需改為 JS 注入後的 fallback）
- `js/nav.js` L82, L99 — hardcoded `8`（= totalPages - 1，需動態化）
- `js/nav.js` L117, L149 — `globalThis.openClerkModal` / `closeClerkModal`
- `index.html` L608, L617, L643, L645 — inline `onclick` for modal handlers

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `css/base.scss` — 已有完整 CSS custom properties（`:root`），含 `--page-count`、`--nav-height`、font tokens 等；保留並延伸
- `js/nav.js` — 單一 IIFE，含頁面導航、touch 手勢、Clerk Modal、Menu Modal；Phase 1 在此基礎修改
- `index.html` — 單頁 HTML，所有 page div 都在此；`.page` 元素計數從這裡讀取

### Established Patterns
- CSS custom properties 已作為設計 token 系統（`--page-count` 驅動 track 寬度）
- `nav.js` 使用事件委派模式的前身（`pageJumpButtons.forEach` + `addEventListener`）— 已有 delegated-like 結構，Clerk Modal 可照此模式重構
- SCSS 目前無 `@import`/`@use`（各自獨立，由 Live Sass 分別編譯）— Phase 1 建立模組關係

### Integration Points
- `index.html` 需修改：移除多個 `<link>` → 改為 `<script type="module">`
- `nav.js` 需修改：頂部加入動態 `--page-count` 注入邏輯，移除 hardcoded `8`，重構 Clerk Modal 為 delegated listeners

</code_context>

<specifics>
## Specific Ideas

- 研究文件（`.planning/research/STACK.md`）已有 `vite.config.js` 和 `postcss.config.js` 範本，planner 可直接引用
- File structure after migration 已在 STACK.md 定義：`css/main.scss` 為新增 entry，舊 `.css` / `.css.map` 可在 Vite 整合完成後刪除
- `_variables.scss` 暫定放 `css/shared/`（可改 `css/_shared/` 慣例），Phase 2 再填充 fluid font clamp values

</specifics>

<deferred>
## Deferred Ideas

- Menu Modal（`globalThis.openMenuModal` 等）遷移 — 與 BUILD-04 同類問題，但 Phase 1 需求未涵蓋。若執行者順手修改可接受，否則留至後續 cleanup
- `.css` / `.css.map` 舊編譯檔刪除 — 待 Vite 整合驗證通過後執行，避免過早破壞現有開發環境
- 圖片 lazy-load、字型 preload — 已列入 v2 deferred（REQUIREMENTS.md）

</deferred>

---

*Phase: 01-vite*
*Context gathered: 2026-04-18*
