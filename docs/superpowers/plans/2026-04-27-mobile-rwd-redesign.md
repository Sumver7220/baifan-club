# 行動版 RWD 重設計 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不破壞 ≥1200px 桌機橫向切頁體驗的前提下，為 <1200px 裝置建立全新的垂直捲動行動版，包含 Logo+漢堡選單頂部導覽、右側圓點位置指示器、全螢幕漢堡展開菜單，以及各頁面的手機版布局重排。

**Architecture:** 兩層 CSS 分流：`@media (min-width: 1200px)` 桌機層維持現有 translateX 切頁合約，`@media (max-width: 1199px)` 行動層解除 overflow:hidden、讓 .track 垂直堆疊。JS 以 `matchMedia('(max-width: 1199px)')` 切換行為模式：桌機用 `goToPage()`，手機用 `scrollIntoView()` + `IntersectionObserver`。

**Tech Stack:** Vanilla JS ES5 IIFE、SCSS with `@use`、Vite 5.x

---

## 開始前確認

```bash
# 確認開發伺服器可正常啟動
npm run dev
# 預期：本地端 http://localhost:5173 (或 Vite 指定 port) 可正常開啟
```

---

## Task 1: HTML — 新增行動版導覽 DOM 元素

**Files:**
- Modify: `index.html`

**說明：** 新增三組 HTML 元素（sticky 頂部導覽、全螢幕 overlay、右側圓點），桌機端以 CSS `display: none` 隱藏，手機端才顯示。另外為缺少標題的頁面（page-3、page-6、page-8）加入行動版區段標籤。

- [ ] **Step 1: 在 `<body>` 開頭（`.viewport` 之前）加入 mobile header**

在 `index.html` 的 `<body>` 標籤後、`<div class="viewport">` 之前，插入：

```html
<!-- Mobile sticky header — hidden on desktop via CSS -->
<header class="mobile-header" aria-label="行動版主導覽">
  <span class="mobile-header-logo">白飯俱樂部</span>
  <button class="mobile-hamburger" type="button" aria-label="開啟導覽選單" aria-expanded="false">
    <span></span>
    <span></span>
    <span></span>
  </button>
</header>
```

- [ ] **Step 2: 在 `</div><!-- /.viewport -->` 之後、`<nav class="bottom-nav">` 之前加入 overlay 和 dot nav**

```html
<!-- Mobile full-screen overlay menu — hidden by default -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay" aria-hidden="true">
  <div class="mobile-menu-top">
    <span class="mobile-menu-logo">白飯俱樂部</span>
    <button class="mobile-menu-close" type="button" aria-label="關閉導覽選單">✕</button>
  </div>
  <nav class="mobile-menu-list" aria-label="頁面導覽">
    <button class="mobile-menu-item mobile-menu-item--active" type="button" data-mobile-target="0">
      <span class="mobile-menu-num">01</span>
      <span class="mobile-menu-cn">入口</span>
      <span class="mobile-menu-en">ENTRY</span>
    </button>
    <button class="mobile-menu-item" type="button" data-mobile-target="1">
      <span class="mobile-menu-num">02</span>
      <span class="mobile-menu-cn">品牌故事</span>
      <span class="mobile-menu-en">ABOUT</span>
    </button>
    <button class="mobile-menu-item" type="button" data-mobile-target="2">
      <span class="mobile-menu-num">03</span>
      <span class="mobile-menu-cn">顧客守則</span>
      <span class="mobile-menu-en">RULES</span>
    </button>
    <button class="mobile-menu-item" type="button" data-mobile-target="3">
      <span class="mobile-menu-num">04</span>
      <span class="mobile-menu-cn">店員介紹</span>
      <span class="mobile-menu-en">STAFF</span>
    </button>
    <button class="mobile-menu-item" type="button" data-mobile-target="4">
      <span class="mobile-menu-num">05</span>
      <span class="mobile-menu-cn">服務內容</span>
      <span class="mobile-menu-en">SERVICE</span>
    </button>
    <button class="mobile-menu-item" type="button" data-mobile-target="5">
      <span class="mobile-menu-num">06</span>
      <span class="mobile-menu-cn">菜單</span>
      <span class="mobile-menu-en">MENU</span>
    </button>
    <button class="mobile-menu-item" type="button" data-mobile-target="6">
      <span class="mobile-menu-num">07</span>
      <span class="mobile-menu-cn">精彩瞬間</span>
      <span class="mobile-menu-en">MOMENTS</span>
    </button>
    <button class="mobile-menu-item mobile-menu-item--disabled" type="button" data-mobile-target="7" aria-disabled="true">
      <span class="mobile-menu-num">08</span>
      <span class="mobile-menu-cn">斗內香檳王</span>
      <span class="mobile-menu-en">DONATE</span>
    </button>
    <button class="mobile-menu-item" type="button" data-mobile-target="8">
      <span class="mobile-menu-num">09</span>
      <span class="mobile-menu-cn">店內環境</span>
      <span class="mobile-menu-en">SPACE</span>
    </button>
  </nav>
  <div class="mobile-menu-footer">白飯俱樂部 © 2024</div>
</div>

<!-- Mobile dot nav — position: fixed, hidden on desktop via CSS -->
<div class="mobile-dot-nav" aria-hidden="true">
  <button class="mobile-dot mobile-dot--active" type="button" data-dot-target="0" aria-label="第 1 頁：入口"></button>
  <button class="mobile-dot" type="button" data-dot-target="1" aria-label="第 2 頁：品牌故事"></button>
  <button class="mobile-dot" type="button" data-dot-target="2" aria-label="第 3 頁：顧客守則"></button>
  <button class="mobile-dot" type="button" data-dot-target="3" aria-label="第 4 頁：店員介紹"></button>
  <button class="mobile-dot" type="button" data-dot-target="4" aria-label="第 5 頁：服務內容"></button>
  <button class="mobile-dot" type="button" data-dot-target="5" aria-label="第 6 頁：菜單"></button>
  <button class="mobile-dot" type="button" data-dot-target="6" aria-label="第 7 頁：精彩瞬間"></button>
  <button class="mobile-dot mobile-dot--disabled" type="button" data-dot-target="7" aria-label="第 8 頁：斗內香檳王（即將推出）" aria-disabled="true"></button>
  <button class="mobile-dot" type="button" data-dot-target="8" aria-label="第 9 頁：店內環境"></button>
</div>
```

- [ ] **Step 3: 為缺少區段標題的頁面加入行動版標籤**

在 `#page-3` 的 `<div class="clerk-content">` 之前加入：
```html
<div class="mobile-page-label" aria-hidden="true">
  <h2>店員介紹</h2>
  <p>STAFF</p>
</div>
```

在 `#page-6` 的 `<div class="moment-main">` 內的 `<div class="moment-grid">` 之前加入：
```html
<div class="mobile-page-label" aria-hidden="true">
  <h2>精彩瞬間</h2>
  <p>MOMENTS</p>
</div>
```

在 `#page-8` 的 `<div class="environment-main">` 內的 `<div class="environment-grid">` 之前加入：
```html
<div class="mobile-page-label" aria-hidden="true">
  <h2>店內環境</h2>
  <p>SPACE</p>
</div>
```

- [ ] **Step 4: 驗證 HTML 無語法錯誤**

打開瀏覽器 → DevTools → Console，確認沒有 HTML parse 錯誤。
桌機寬度（1920px）下，畫面應與修改前完全相同（新元素尚無樣式，可能短暫可見但不影響功能）。

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(mobile): add mobile header, overlay menu, and dot nav HTML"
```

---

## Task 2: CSS — 桌機鎖定 + 行動版基礎重置

**Files:**
- Modify: `css/base.scss`

**說明：** 桌機端加 `min-width: 1200px`；行動端解除 `overflow: hidden`，讓 `.track` 垂直堆疊。

- [ ] **Step 1: 用 DevTools 確認問題（390px）**

DevTools → 設定視窗為 390px 寬 → 目前應看到內容被鎖住、無法捲動（預期的 failing state）。

- [ ] **Step 2: 在 `css/base.scss` 底部加入桌機 min-width 與行動版 reset**

```scss
/* ─── 桌機 min-width 鎖定 ────────────────────────── */
@media (min-width: 1200px) {
  .viewport {
    min-width: 1200px;
  }

  /* 行動版導覽元素在桌機隱藏 */
  .mobile-header,
  .mobile-menu-overlay,
  .mobile-dot-nav {
    display: none !important;
  }
}

/* ─── 行動版基礎重置 ─────────────────────────────── */
@media (max-width: 1199px) {
  html,
  body {
    width: 100%;
    height: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .viewport {
    width: 100%;
    height: auto;
    overflow: visible;
    min-width: unset;
  }

  .track {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    transform: none !important;
    transition: none !important;
  }

  .page {
    width: 100% !important;
    height: auto !important;
    min-height: 100dvh;
    overflow: visible !important;
    flex-shrink: unset !important;
  }

  /* 桌機底部導覽列隱藏 */
  .bottom-nav {
    display: none !important;
  }

  /* 行動版頁面區段標題 (desktop: hidden) */
  .mobile-page-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem 0.75rem;
    gap: 0.25rem;

    h2 {
      font-family: 'BaifanCustom', serif;
      font-size: clamp(1.4rem, 6vw, 2rem);
      letter-spacing: 0.45em;
      color: rgba(255, 255, 255, 0.85);
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }

    p {
      font-family: 'BaifanFangsong', serif;
      font-size: 0.55rem;
      letter-spacing: 0.3em;
      color: rgba(255, 255, 255, 0.28);
      display: flex;
      align-items: center;
      gap: 8px;

      &::before,
      &::after {
        content: '';
        display: block;
        width: 16px;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

/* desktop: mobile-page-label hidden */
@media (min-width: 1200px) {
  .mobile-page-label {
    display: none;
  }
}
```

- [ ] **Step 3: 驗證行動版基礎重置**

DevTools → 390px → 頁面應可垂直捲動，所有 9 個 `.page` section 應堆疊顯示（雖然樣式還不完整）。
桌機 1920px → 橫向切頁功能應完全正常。

- [ ] **Step 4: Commit**

```bash
git add css/base.scss
git commit -m "feat(mobile): add desktop min-width lock and mobile base reset"
```

---

## Task 3: CSS — 行動版導覽元件樣式

**Files:**
- Modify: `css/nav.scss`

**說明：** sticky 頂部導覽列、漢堡圖示、全螢幕 overlay 選單、右側圓點導覽的完整 CSS。

- [ ] **Step 1: 在 `css/nav.scss` 底部加入行動版導覽 CSS**

```scss
/* ══════════════════════════════════════════════════
   行動版導覽 (max-width: 1199px)
══════════════════════════════════════════════════ */
@media (max-width: 1199px) {

  /* ─── Sticky 頂部導覽列 ─────────────────────── */
  .mobile-header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    background: rgba(10, 8, 20, 0.92);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: var(--border-thin) solid rgba(255, 255, 255, 0.04);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 100;
    flex-shrink: 0;
  }

  .mobile-header-logo {
    font-family: 'BaifanCustom', 'Noto Serif TC', serif;
    font-size: 0.85rem;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.82);
    user-select: none;
  }

  .mobile-hamburger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0;
    min-height: 44px;
    min-width: 44px;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;

    span {
      display: block;
      height: 1px;
      background: var(--color-gold);
      transition: width var(--duration-fast) ease;
    }

    span:nth-child(1) { width: 20px; }
    span:nth-child(2) { width: 14px; }
    span:nth-child(3) { width: 20px; }
  }

  /* ─── 全螢幕 Overlay 選單 ───────────────────── */
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(6, 4, 12, 0.97);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 200;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .mobile-menu-overlay.open {
    transform: translateX(0);
  }

  .mobile-menu-top {
    height: 68px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 1.25rem 0.875rem;
    border-bottom: var(--border-thin) solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }

  .mobile-menu-logo {
    font-family: 'BaifanCustom', serif;
    font-size: 0.85rem;
    letter-spacing: 0.32em;
    color: rgba(255, 255, 255, 0.72);
  }

  .mobile-menu-close {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'BaifanFangsong', serif;
    font-size: 1rem;
    color: var(--color-gold);
    padding: 0;
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    -webkit-tap-highlight-color: transparent;

    &:hover { opacity: 1; }
  }

  .mobile-menu-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 1.25rem;
    overflow-y: auto;
  }

  .mobile-menu-item {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border: none;
    border-bottom: var(--border-thin) solid rgba(255, 255, 255, 0.04);
    background: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: inherit;
    position: relative;
    -webkit-tap-highlight-color: transparent;

    &:last-child { border-bottom: none; }
  }

  .mobile-menu-num {
    font-family: 'BaifanFangsong', serif;
    font-size: 0.55rem;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.22);
    min-width: 20px;
  }

  .mobile-menu-cn {
    font-family: 'BaifanCustom', serif;
    font-size: 1.05rem;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.55);
    transition: color var(--duration-fast) ease;
  }

  .mobile-menu-en {
    font-family: 'BaifanFangsong', serif;
    font-size: 0.5rem;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.2);
    margin-left: auto;
  }

  .mobile-menu-item--active {
    .mobile-menu-cn { color: var(--color-gold); }
    .mobile-menu-num { color: rgba(201, 168, 76, 0.5); }

    &::before {
      content: '';
      position: absolute;
      left: -1.25rem;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: var(--color-gold);
      border-radius: 2px;
      box-shadow: 0 0 6px rgba(201, 168, 76, 0.7);
    }
  }

  .mobile-menu-item--disabled {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
  }

  .mobile-menu-footer {
    padding: 1rem 1.25rem;
    border-top: var(--border-thin) solid rgba(255, 255, 255, 0.04);
    font-family: 'BaifanFangsong', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.18);
    flex-shrink: 0;
  }

  /* ─── 右側圓點導覽 ──────────────────────────── */
  .mobile-dot-nav {
    position: fixed;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 50;
    padding: 4px;
  }

  .mobile-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background var(--duration-fast) ease,
                height var(--duration-fast) ease,
                border-radius var(--duration-fast) ease,
                box-shadow var(--duration-fast) ease;
    -webkit-tap-highlight-color: transparent;
    /* 擴大點擊區域（視覺不變，可點擊區域更大） */
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -6px -8px;
    }
  }

  .mobile-dot--active {
    background: var(--color-gold);
    box-shadow: 0 0 5px rgba(201, 168, 76, 0.8);
    height: 12px;
    border-radius: 2px;
  }

  .mobile-dot--visited {
    background: rgba(201, 168, 76, 0.25);
  }

  .mobile-dot--disabled {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
  }
}
```

- [ ] **Step 2: 驗證行動版導覽 CSS（390px）**

- `.mobile-header` 出現在頂部，金色漢堡圖示可見
- `.bottom-nav` 不可見
- `.mobile-dot-nav` 顯示在右側，9 個點垂直排列
- `.mobile-menu-overlay` 預設隱藏（translateX 100%）

- [ ] **Step 3: 驗證桌機不受影響（1920px）**

- `.mobile-header`、`.mobile-dot-nav`、`.mobile-menu-overlay` 均不可見
- `.bottom-nav` 正常顯示
- 桌機橫向切頁正常

- [ ] **Step 4: Commit**

```bash
git add css/nav.scss
git commit -m "feat(mobile): add mobile nav CSS (sticky header, overlay menu, dot nav)"
```

---

## Task 4: JS — 行動版導覽行為

**Files:**
- Modify: `js/nav.js`

**說明：** 在 `js/nav.js` 底部加入新 IIFE，處理漢堡開關、IntersectionObserver、圓點跳轉、scrollIntoView、桌機/手機模式切換。

- [ ] **Step 1: 在 `js/nav.js` 最底部（所有現有 IIFE 之後）加入行動版 IIFE**

```javascript
// ─── 行動版導覽 ─────────────────────────────────────
(function () {
  'use strict';

  var MOBILE_MQ = window.matchMedia('(max-width: 1199px)');

  var mobileHeader = document.querySelector('.mobile-header');
  var hamburger = document.querySelector('.mobile-hamburger');
  var overlay = document.getElementById('mobileMenuOverlay');
  var overlayClose = document.querySelector('.mobile-menu-close');
  var menuItems = document.querySelectorAll('.mobile-menu-item');
  var dots = document.querySelectorAll('.mobile-dot');
  var dotNav = document.querySelector('.mobile-dot-nav');
  var sections = document.querySelectorAll('.page');

  if (!mobileHeader || !overlay || !hamburger) return;

  var observer = null;
  var currentDotIndex = 0;

  // ── Overlay 開關 ─────────────────────────────────
  function openMenu() {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  overlayClose.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeMenu();
    }
  });

  // ── 選單項目點擊跳轉 ─────────────────────────────
  menuItems.forEach(function (item) {
    item.addEventListener('click', function () {
      if (item.classList.contains('mobile-menu-item--disabled')) return;
      var target = parseInt(item.dataset.mobileTarget, 10);
      var section = document.getElementById('page-' + target);
      closeMenu();
      if (section) {
        // 短暫延遲確保 overlay 開始收合後再捲動
        setTimeout(function () {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });

  // ── 圓點點擊跳轉 ─────────────────────────────────
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      if (dot.classList.contains('mobile-dot--disabled')) return;
      var target = parseInt(dot.dataset.dotTarget, 10);
      var section = document.getElementById('page-' + target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 更新圓點 active 狀態 ──────────────────────────
  function setActiveDot(index) {
    if (index === currentDotIndex) return;
    currentDotIndex = index;

    dots.forEach(function (dot, i) {
      dot.classList.toggle('mobile-dot--active', i === index);
      // visited: 0 .. index-1
      if (!dot.classList.contains('mobile-dot--disabled')) {
        dot.classList.toggle('mobile-dot--visited', i < index);
      }
    });

    // 同步 overlay 選單 active 狀態
    menuItems.forEach(function (item) {
      var t = parseInt(item.dataset.mobileTarget, 10);
      item.classList.toggle('mobile-menu-item--active', t === index);
    });
  }

  // ── IntersectionObserver ──────────────────────────
  function initObserver() {
    if (observer) observer.disconnect();

    var ratioMap = new Map();

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratioMap.set(entry.target, entry.intersectionRatio);
      });

      // 找出可視比例最高的 section
      var maxRatio = 0;
      var activeIndex = currentDotIndex;
      ratioMap.forEach(function (ratio, section) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeIndex = parseInt(section.dataset.page, 10);
        }
      });

      if (maxRatio > 0.05) {
        setActiveDot(activeIndex);
      }
    }, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ── 行動模式初始化 / 清理 ─────────────────────────
  function enterMobileMode() {
    if (dotNav) dotNav.removeAttribute('aria-hidden');
    initObserver();
  }

  function exitMobileMode() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    closeMenu();
    if (dotNav) dotNav.setAttribute('aria-hidden', 'true');
    // 切換回桌機時重新載入，確保 translateX 狀態正確
    window.location.reload();
  }

  // ── 監聽斷點切換 ─────────────────────────────────
  MOBILE_MQ.addEventListener('change', function (e) {
    if (e.matches) {
      enterMobileMode();
    } else {
      exitMobileMode();
    }
  });

  // ── 初始化 ────────────────────────────────────────
  if (MOBILE_MQ.matches) {
    enterMobileMode();
  }
})();
```

- [ ] **Step 2: 驗證行動版 JS（390px DevTools）**

- 點擊漢堡圖示 → overlay 從右側滑入
- 點擊選單中的「菜單」→ overlay 收合，頁面平滑捲動至 `#page-5`
- 捲動頁面 → 右側圓點 active 狀態隨著正確頁面更新
- 點擊圓點 → 頁面捲動至對應區段
- 按 ESC → overlay 收合

- [ ] **Step 3: 驗證桌機不受影響（1920px）**

桌機下，JS IIFE 偵測到 `MOBILE_MQ.matches === false`，不初始化任何行動版邏輯。
底部導覽切頁、swipe、Modal 均正常。

- [ ] **Step 4: Commit**

```bash
git add js/nav.js
git commit -m "feat(mobile): add mobile nav JS (hamburger, IntersectionObserver, dot nav)"
```

---

## Task 5: CSS — Page 0 行動版（入口）

**Files:**
- Modify: `css/page-0.scss`

- [ ] **Step 1: 驗證問題（390px）**

Page 0 的標題和 CTA 文字在手機上可能被 sticky header 遮住，或字體過大導致溢出。

- [ ] **Step 2: 在 `css/page-0.scss` 底部加入**

```scss
/* ─── Page 0 行動版 ──────────────────────────────── */
@media (max-width: 1199px) {
  #page-0 {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
  }

  .home-content {
    width: 100%;
    height: 100%;
    padding: 0 var(--hero-pad-mobile-inline);
    justify-content: center;
    gap: 0;
  }

  .home-title {
    h1 {
      font-size: clamp(1.8rem, 8vw, 3rem);
      letter-spacing: 0.35em;
    }

    p {
      font-size: clamp(0.65rem, 3vw, 0.88rem);
      letter-spacing: 0.25em;
    }

    p::before,
    p::after {
      width: clamp(2rem, 8vw, 6rem);
    }
  }

  .home-entry {
    font-size: clamp(1.2rem, 5.5vw, 2rem);
    letter-spacing: 0.4em;
    margin-bottom: 2.5rem;
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 0 在手機上：背景圖全幅、標題居中清晰、「進入」CTA 可點擊（≥ 44px 觸控區）、無水平溢出。

- [ ] **Step 4: Commit**

```bash
git add css/page-0.scss
git commit -m "feat(mobile): page-0 entry mobile layout"
```

---

## Task 6: CSS — Page 1 行動版（品牌故事）

**Files:**
- Modify: `css/page-1.scss`

**說明：** 桌機版兩欄文字（`.about-text-main` 是 `grid-template-columns: 1fr 1fr`）改為單欄；保留背景圖作為頂部視覺錨點；玻璃文字區塊全寬展示。

- [ ] **Step 1: 驗證問題（390px）**

目前 `.about-text-main` 兩欄在 390px 下文字互相擠壓，`.about-cta` `position: absolute` 可能超出可視範圍。

- [ ] **Step 2: 在 `css/page-1.scss` 底部加入**

```scss
/* ─── Page 1 行動版（品牌故事）────────────────────── */
@media (max-width: 1199px) {
  #page-1 {
    display: block;
  }

  .about-content {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
  }

  .about-title {
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 1rem 1rem 1.25rem;

    h1 {
      font-size: clamp(1.5rem, 6vw, 2.2rem);
      letter-spacing: 0.4em;
    }

    p {
      font-size: clamp(0.6rem, 2.5vw, 0.8rem);
      letter-spacing: 0.25em;
    }

    p::before,
    p::after {
      width: clamp(1.5rem, 5vw, 4rem);
    }
  }

  .about-text {
    flex: unset;
    width: 100%;
    margin: 0;
    padding: 1.5rem 1.25rem 2rem;
    background: rgba(10, 8, 20, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: var(--border-thin) solid rgba(255, 255, 255, 0.06);

    /* 隱藏桌機版玻璃背景偽元素 */
    &::before {
      display: none;
    }
  }

  .about-text-main {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .about-text-left {
    grid-column: 1;
    grid-row: 1;
    justify-self: stretch;
    padding-right: 0;
    padding-bottom: 1rem;
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
    letter-spacing: 0.12em;
    line-height: 2;
    border-bottom: var(--border-thin) solid rgba(255, 255, 255, 0.06);

    p { max-width: 100%; }
  }

  .about-text-right {
    grid-column: 1;
    grid-row: 2;
    justify-self: stretch;
    padding-left: 0;
    padding-top: 1rem;
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
    letter-spacing: 0.12em;
    line-height: 2;

    p { max-width: 100%; }
  }

  .about-cta {
    position: static;
    margin: 1.5rem 0 0;
    font-size: clamp(0.9rem, 3.5vw, 1.2rem);
    right: unset;
    bottom: unset;
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 1：頂部背景圖可見（180px 高度），下方深色玻璃區塊顯示兩段文字（左欄在上、右欄在下），無水平溢出，CTA 可見且可點擊。

- [ ] **Step 4: Commit**

```bash
git add css/page-1.scss
git commit -m "feat(mobile): page-1 brand story mobile layout (single column)"
```

---

## Task 7: CSS — Page 2 行動版（顧客守則）

**Files:**
- Modify: `css/page-2.scss`

- [ ] **Step 1: 驗證問題（390px）**

`.customer-content` 高度被鎖在視窗，守則列表文字可能被截斷。

- [ ] **Step 2: 在 `css/page-2.scss` 底部加入**

```scss
/* ─── Page 2 行動版（顧客守則）────────────────────── */
@media (max-width: 1199px) {
  #page-2 {
    display: block;
  }

  .customer-content {
    width: 100%;
    height: auto;
    justify-content: flex-start;
    padding: 0 1.25rem 2rem;
  }

  .customer-title {
    padding-top: 1.5rem;
    padding-bottom: 0.5rem;

    h1 {
      font-size: clamp(1.5rem, 6vw, 2.2rem);
      letter-spacing: 0.4em;
    }
  }

  .customer-panel {
    width: 100%;
  }

  .customer-panel-heading {
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
  }

  .customer-intro {
    font-size: clamp(0.8rem, 3vw, 0.95rem);
    letter-spacing: 0.08em;
  }

  .rule-area {
    padding-left: 1.25rem;

    li {
      font-size: clamp(0.8rem, 3vw, 0.95rem);
      line-height: 1.95;
      letter-spacing: 0.06em;
    }
  }

  .customer-bottom {
    width: 100%;
  }

  .customer-cta {
    position: static;
    display: inline-flex;
    margin: 1rem 0 0;
    font-size: clamp(0.9rem, 3.5vw, 1.2rem);
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 2：守則完整顯示、文字可讀、無截斷、CTA 可見。

- [ ] **Step 4: Commit**

```bash
git add css/page-2.scss
git commit -m "feat(mobile): page-2 rules mobile layout"
```

---

## Task 8: CSS — Page 3 行動版（店員介紹）

**Files:**
- Modify: `css/page-3.scss`

**說明：** 桌機版 7 欄格（第一張跨 2x2）改為手機版 2 欄格（第一張全寬）。

- [ ] **Step 1: 驗證問題（390px）**

`.clerk-content` 的 7 欄格在 390px 寬度下，每欄約 55px，卡片極小難以辨認。

- [ ] **Step 2: 在 `css/page-3.scss` 底部加入**

```scss
/* ─── Page 3 行動版（店員介紹）────────────────────── */
@media (max-width: 1199px) {
  #page-3 {
    display: block;
    align-items: unset;
    justify-content: unset;
  }

  .clerk-content {
    grid-template-columns: 1fr 1fr;
    padding: 0 0.75rem 1.5rem;
    gap: 0.5rem;
    width: 100%;
  }

  /* 第一張（一桶白飯）：全寬 feature card，16:7 橫向比例 */
  .clerk-card:nth-child(1) {
    grid-column: 1 / -1;
    grid-row: auto;
    aspect-ratio: 16 / 7;
  }

  /* 其餘卡片回到自動格位，恢復原始直向比例 */
  .clerk-card:not(:nth-child(1)) {
    grid-column: auto;
    grid-row: auto;
    aspect-ratio: 1030 / 1351;
  }

  .clerk-card-coming-soon {
    aspect-ratio: 1030 / 1351;
  }

  .clerk-cta {
    position: static;
    display: block;
    text-align: center;
    margin: 1rem auto;
    font-size: clamp(0.9rem, 3.5vw, 1.2rem);
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 3：第一張卡片（一桶白飯）橫向全寬顯示，其餘卡片兩欄垂直排列，「coming soon」卡片正常顯示，點擊任一卡片 Modal 正常開啟。

- [ ] **Step 4: Commit**

```bash
git add css/page-3.scss
git commit -m "feat(mobile): page-3 staff mobile grid (feature + 2-col)"
```

---

## Task 9: CSS — Page 4 行動版（服務內容）

**Files:**
- Modify: `css/page-4.scss`

**說明：** 桌機兩欄（服務文字 + 圖片）改為單欄，`<pre>` 區塊自動換行。

- [ ] **Step 1: 驗證問題（390px）**

`.service-content` 的兩欄在手機上文字與圖片互相擠壓，`<pre>` 可能造成水平溢出。

- [ ] **Step 2: 在 `css/page-4.scss` 底部加入**

```scss
/* ─── Page 4 行動版（服務內容）────────────────────── */
@media (max-width: 1199px) {
  #page-4 {
    display: block;
  }

  .service-main {
    height: auto;
    padding: 0 1.25rem 2rem;
  }

  .service-title {
    padding-top: 1.5rem;
    padding-bottom: 0.5rem;

    h1 {
      font-size: clamp(1.5rem, 6vw, 2.2rem);
      letter-spacing: 0.4em;
    }
  }

  .service-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    column-gap: 0;
    row-gap: 1rem;
    height: auto;
  }

  .service-content-left,
  .service-content-right {
    width: 100%;
    min-width: 0;
  }

  .service-content-left-content pre {
    font-size: clamp(0.78rem, 3vw, 0.9rem);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 2;
    letter-spacing: 0.04em;
  }

  .service-gallery-item img,
  .service-gallery-item-large img {
    width: 100%;
    height: auto;
    display: block;
  }

  .service-cta {
    position: static;
    display: block;
    text-align: center;
    margin: 1.5rem 0 0;
    font-size: clamp(0.9rem, 3.5vw, 1.2rem);
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 4：服務文字完整顯示且無水平溢出，圖片組堆疊在文字下方，CTA 可見。

- [ ] **Step 4: Commit**

```bash
git add css/page-4.scss
git commit -m "feat(mobile): page-4 service mobile layout (single column)"
```

---

## Task 10: CSS — Page 5 行動版（菜單）

**Files:**
- Modify: `css/page-5.scss`

**說明：** 桌機兩欄（左：標題+海報，右：5 張菜單卡）改為單欄，海報在上，菜單卡依序排列，全部可點擊放大。

- [ ] **Step 1: 驗證問題（390px）**

`.menu-main` 兩欄在手機上菜單圖片縮得極小。

- [ ] **Step 2: 在 `css/page-5.scss` 底部加入**

```scss
/* ─── Page 5 行動版（菜單）─────────────────────────── */
@media (max-width: 1199px) {
  #page-5 {
    display: block;
  }

  .menu-main {
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 0 0.75rem 2rem;
    gap: 0.5rem;
  }

  .menu-main-left {
    order: 1;
    height: auto;
    min-height: unset;
  }

  .menu-main-title {
    padding: 1.5rem 0 0.75rem;

    h1 {
      font-size: clamp(2.5rem, 12vw, 5rem);
    }

    p {
      font-size: clamp(0.7rem, 2.5vw, 0.95rem);
    }
  }

  .menu-main-poster {
    flex: unset;
    width: 100%;
    min-height: unset;
    cursor: zoom-in;

    img {
      width: 100%;
      height: auto;
      max-height: none;
      max-width: 100%;
    }
  }

  .menu-main-right {
    order: 2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: unset;
  }

  .menu-card,
  .menu-card-wide {
    width: 100%;
    min-height: unset;

    img {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: unset;
    }
  }

  .menu-cta {
    order: 3;
    position: static;
    display: block;
    text-align: center;
    margin: 1rem 0 0;
    font-size: clamp(0.9rem, 3.5vw, 1.2rem);
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 5：菜單標題在頂部，套餐海報全寬顯示，點擊可放大，5 張菜單圖依序排列於下方，每張均可點擊放大。Modal 翻頁正常。

- [ ] **Step 4: Commit**

```bash
git add css/page-5.scss
git commit -m "feat(mobile): page-5 menu mobile layout (single column, full-width)"
```

---

## Task 11: CSS — Page 6 + Page 8 行動版（圖片牆）

**Files:**
- Modify: `css/page-6.scss`
- Modify: `css/page-8.scss`

**說明：** 兩個頁面的 3 欄圖片格改為手機 2 欄，高度由圖片比例決定。

- [ ] **Step 1: 在 `css/page-6.scss` 底部加入**

```scss
/* ─── Page 6 行動版（精彩瞬間）────────────────────── */
@media (max-width: 1199px) {
  #page-6 {
    display: block;
  }

  .moment-main {
    width: 100%;
    height: auto;
    padding: 0 0.75rem 2rem;
    position: relative;
  }

  .moment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    width: 100%;
    height: auto;
  }

  /* 清除所有具名格位，讓瀏覽器自動排版 */
  .moment-card-left-top,
  .moment-card-right-top,
  .moment-card-left-bottom,
  .moment-card-right-bottom {
    grid-column: auto;
    grid-row: auto;
  }

  .moment-card {
    min-height: unset;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      object-fit: cover;
    }
  }

  .moment-cta {
    position: static;
    display: block;
    text-align: center;
    margin: 1rem 0 0;
    font-size: clamp(0.9rem, 3.5vw, 1.2rem);
  }
}
```

- [ ] **Step 2: 在 `css/page-8.scss` 底部加入**

```scss
/* ─── Page 8 行動版（店內環境）────────────────────── */
@media (max-width: 1199px) {
  #page-8 {
    display: block;
  }

  .environment-main {
    width: 100%;
    height: auto;
    padding: 0 0.75rem 2rem;
  }

  .environment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: 0.5rem;
    width: 100%;
    height: auto;
  }

  .environment-card-row1,
  .environment-card-row2 {
    grid-column: auto;
    grid-row: auto;
  }

  .environment-card {
    min-height: unset;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }
  }

  .environment-caption {
    position: static;
    transform: none;
    left: unset;
    text-align: center;
    padding: 0.25rem 0;
    font-size: clamp(0.75rem, 2.8vw, 0.9rem);
    color: rgba(255, 255, 255, 0.55);
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 6：4 張圖以 2 欄 × 2 列排列，正方形比例，無水平溢出。
Page 8：6 張圖以 2 欄 × 3 列排列，圖片下方有場所標示文字。

- [ ] **Step 4: Commit**

```bash
git add css/page-6.scss css/page-8.scss
git commit -m "feat(mobile): page-6 and page-8 gallery 2-column grid"
```

---

## Task 12: CSS — Page 7 行動版（斗內香檳王）

**Files:**
- Modify: `css/page-7.scss`（若不存在則建立）

- [ ] **Step 1: 檢查 `css/page-7.scss` 是否存在**

```bash
ls css/page-7.scss
```

- [ ] **Step 2: 在 `css/page-7.scss` 底部加入（若檔案不存在則建立）**

```scss
/* ─── Page 7 行動版（斗內香檳王）──────────────────── */
@media (max-width: 1199px) {
  #page-7 {
    display: block;
  }

  .donate-main {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0.75rem 2rem;
  }

  .champagne-king-poster {
    width: 100%;
    max-width: 480px;
    height: auto;
    display: block;
  }
}
```

- [ ] **Step 3: 驗證（390px）**

Page 7：海報圖片全寬顯示，無水平溢出。

- [ ] **Step 4: Commit**

```bash
git add css/page-7.scss
git commit -m "feat(mobile): page-7 donate mobile layout"
```

---

## Task 13: 全站回歸驗收

**說明：** 逐一對照規格中的 UAT 條件（U-01 到 U-08）驗收。

- [ ] **U-01: < 1200px 可垂直捲動所有內容，無裁切**

DevTools → 390px → 捲動頁面從 Page 0 到 Page 8，確認每個 section 完整顯示。

- [ ] **U-02: 圓點 active 隨捲動更新**

慢速捲動，確認每個區段觸發時，右側對應圓點變為金色條狀。

- [ ] **U-03: 漢堡展開後跳轉並關閉**

依序測試 overlay 中每一個頁面按鈕，確認捲動至對應位置且 overlay 收合。

- [ ] **U-04: 320px 無水平溢出**

DevTools → 320px → 捲動全頁，確認無水平捲軸、無內容超出視窗。

- [ ] **U-05: ≥ 1200px 桌機橫向切頁完全正常**

DevTools → 1920px → 測試底部導覽列每個按鈕、swipe 手勢、頁面內 CTA 跳轉、店員 Modal、菜單 Modal。

- [ ] **U-06: 店員卡片在行動端可點擊開啟 Modal**

DevTools → 390px → 點擊任一店員卡片（非 coming-soon），確認 Modal 正常顯示、關閉後 focus 回到卡片。

- [ ] **U-07: 頂部導覽列 sticky，捲動時不消失**

捲動至 Page 5（菜單），確認頂部 Logo + 漢堡圖示仍可見。

- [ ] **U-08: 右側圓點不干擾內容點擊**

DevTools → 390px → 嘗試點擊接近右邊緣的內容元素（如菜單圖片右側、店員卡片右側），確認點擊正常觸發而非被圓點攔截。

- [ ] **最終 Commit**

```bash
git add -A
git commit -m "feat: complete mobile RWD redesign (v1.1 Phase 3)"
```
