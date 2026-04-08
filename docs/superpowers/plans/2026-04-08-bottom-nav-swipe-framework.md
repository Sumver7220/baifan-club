# 白飯俱樂部 — 底部導覽列 + 左右切換框架 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目標：** 建立純 HTML/CSS/JS 的全螢幕左右切換框架，包含固定底部導覽列（9 個圖示＋文字）、橫向 Slide 切換動畫、手機觸控滑動支援。

**架構：** Viewport（固定視窗）內有一條寬 900vw 的 Track，9 個 Section 並排其中。切換頁面時以 CSS `transform: translateX` 移動 Track。底部 Nav 固定於畫面底部，點擊或手機滑動皆可觸發切換。

**技術：** 純 HTML5 / CSS3 / Vanilla JS（無框架、無建構工具）

**參考規格：** `docs/superpowers/specs/2026-04-08-bottom-nav-swipe-framework-design.md`

---

## 檔案一覽

| 檔案 | 說明 |
|------|------|
| `index.html` | 主入口：HTML 骨架 + 9 個 Section + 底部 Nav |
| `css/base.css` | CSS Reset、字型匯入、CSS 自訂變數 |
| `css/pages.css` | Viewport、Track、Page 基礎樣式 |
| `css/nav.css` | 底部導覽列樣式（含 active 狀態、RWD）|
| `js/nav.js` | 點擊切換邏輯 + 觸控滑動手勢 |

---

## Task 1：建立目錄結構 + base.css

**Files:**
- Create: `index.html`
- Create: `css/base.css`

- [ ] **Step 1：建立資料夾**

```bash
mkdir -p css js
```

驗證：`ls` 應看到 `css/` 和 `js/` 兩個資料夾。

- [ ] **Step 2：建立 `css/base.css`**

內容如下（CSS 變數 + Reset + 字型）：

```css
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700&family=Playfair+Display+SC:wght@400;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-bg:       #0a0814;
  --color-text:     #ffffff;
  --color-gold:     #c9a84c;
  --color-nav-bg:   rgba(10, 8, 20, 0.85);
  --nav-height:     64px;
  --page-count:     9;
  --transition-page: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Karla', sans-serif;
}

@media (max-width: 767px) {
  :root {
    --nav-height: 72px;
  }
}
```

- [ ] **Step 3：建立 `index.html` 骨架（暫無頁面內容）**

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>白飯俱樂部 ✦ Rice Club</title>
  <meta name="description" content="白飯俱樂部 Rice Club — 沉浸式夜晚體驗">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/pages.css">
  <link rel="stylesheet" href="css/nav.css">
</head>
<body>

  <!-- 頁面容器（Task 2 填入內容）-->

  <!-- 底部導覽列（Task 3 填入內容）-->

  <script src="js/nav.js"></script>
</body>
</html>
```

- [ ] **Step 4：瀏覽器驗證**

用 VS Code Live Server 或執行 `python3 -m http.server 8080`，開啟 `http://localhost:8080`。

預期：頁面顯示黑色背景，無錯誤。

- [ ] **Step 5：Commit**

```bash
git add index.html css/base.css
git commit -m "feat: 初始化專案結構與 CSS 變數"
```

---

## Task 2：pages.css — Viewport + Track + 9 個 Section

**Files:**
- Create: `css/pages.css`
- Modify: `index.html`（新增 viewport + track + 9 個 section）

- [ ] **Step 1：建立 `css/pages.css`**

```css
/* ─── Viewport ─────────────────────────────────── */
.viewport {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;         /* fallback */
  height: 100dvh;        /* 行動裝置動態視窗高度 */
  overflow: hidden;
}

/* ─── Track（9 頁並排）─────────────────────────── */
.track {
  display: flex;
  width: calc(var(--page-count) * 100vw);  /* 900vw */
  height: 100%;
  transform: translateX(0);
  transition: var(--transition-page);
  will-change: transform;
}

/* ─── 每一頁 ────────────────────────────────────── */
.page {
  width: 100vw;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: var(--nav-height);
}

/* ─── 開發佔位色（正式切版時移除）──────────────── */
.page:nth-child(1) { background: #1a0a1a; }
.page:nth-child(2) { background: #0a1a1a; }
.page:nth-child(3) { background: #1a1a0a; }
.page:nth-child(4) { background: #0a0a1a; }
.page:nth-child(5) { background: #1a0a0a; }
.page:nth-child(6) { background: #0a1a0a; }
.page:nth-child(7) { background: #120a1a; }
.page:nth-child(8) { background: #1a120a; }
.page:nth-child(9) { background: #0a121a; }

/* ─── 佔位文字（開發測試用）────────────────────── */
.page-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Playfair Display SC', serif;
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
}
```

- [ ] **Step 2：在 `index.html` 加入 viewport + track + 9 個 section**

在 `<!-- 頁面容器 -->` 的位置替換為：

```html
  <div class="viewport">
    <div class="track" id="track">
      <section class="page" id="page-0" data-page="0">
        <div class="page-placeholder">入口</div>
      </section>
      <section class="page" id="page-1" data-page="1">
        <div class="page-placeholder">關於</div>
      </section>
      <section class="page" id="page-2" data-page="2">
        <div class="page-placeholder">顧客守則</div>
      </section>
      <section class="page" id="page-3" data-page="3">
        <div class="page-placeholder">店員介紹</div>
      </section>
      <section class="page" id="page-4" data-page="4">
        <div class="page-placeholder">服務內容</div>
      </section>
      <section class="page" id="page-5" data-page="5">
        <div class="page-placeholder">菜單</div>
      </section>
      <section class="page" id="page-6" data-page="6">
        <div class="page-placeholder">精彩瞬間</div>
      </section>
      <section class="page" id="page-7" data-page="7">
        <div class="page-placeholder">斗內香檳王</div>
      </section>
      <section class="page" id="page-8" data-page="8">
        <div class="page-placeholder">店內環境</div>
      </section>
    </div>
  </div>
```

- [ ] **Step 3：瀏覽器驗證**

開啟 `http://localhost:8080`，用開發者工具（F12）確認：
- Elements 面板：`.track` 的計算寬度為 `900vw`
- 畫面顯示深色背景 + 「入口」佔位文字置中
- 無水平捲軸出現

- [ ] **Step 4：Commit**

```bash
git add css/pages.css index.html
git commit -m "feat: 建立 viewport + track 9 頁並排結構"
```

---

## Task 3：nav.css + 底部導覽列 HTML + SVG 圖示

**Files:**
- Create: `css/nav.css`
- Modify: `index.html`（新增完整底部 nav HTML）

- [ ] **Step 1：建立 `css/nav.css`**

```css
/* ─── 底部導覽列容器 ─────────────────────────────── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--nav-height);
  background: var(--color-nav-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: stretch;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* ─── 每個導覽項目 ──────────────────────────────── */
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  opacity: 0.45;
  padding: 6px 2px 8px;
  position: relative;
  transition: opacity 200ms ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* ─── Active 指示線（頂部金色）─────────────────── */
.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  width: 70%;
  height: 2px;
  background: var(--color-gold);
  opacity: 0;
  transition: opacity 200ms ease;
}

/* ─── Active 狀態 ───────────────────────────────── */
.nav-item.active {
  opacity: 1;
}

.nav-item.active::before {
  opacity: 1;
}

/* ─── 圖示 ──────────────────────────────────────── */
.nav-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}

/* ─── 文字標籤 ──────────────────────────────────── */
.nav-label {
  font-size: 11px;
  font-family: 'Karla', sans-serif;
  letter-spacing: 0.05em;
  white-space: nowrap;
  line-height: 1;
}

/* ─── 手機 RWD ──────────────────────────────────── */
@media (max-width: 767px) {
  .nav-icon {
    width: 22px;
    height: 22px;
  }

  .nav-label {
    font-size: 9px;
  }
}

/* ─── Hover（桌機）──────────────────────────────── */
@media (hover: hover) {
  .nav-item:not(.active):hover {
    opacity: 0.75;
  }
}
```

- [ ] **Step 2：在 `index.html` 加入完整導覽列 HTML（含 SVG 圖示）**

在 `<!-- 底部導覽列 -->` 的位置替換為：

```html
  <nav class="bottom-nav" role="navigation" aria-label="主選單">

    <!-- 入口 -->
    <button class="nav-item active" data-target="0" aria-label="入口" aria-current="page">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9L12 2L21 9V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V9Z"/>
      </svg>
      <span class="nav-label">入口</span>
    </button>

    <!-- 關於 -->
    <button class="nav-item" data-target="1" aria-label="關於">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 16V12"/>
        <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none"/>
      </svg>
      <span class="nav-label">關於</span>
    </button>

    <!-- 顧客守則 -->
    <button class="nav-item" data-target="2" aria-label="顧客守則">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
      </svg>
      <span class="nav-label">顧客守則</span>
    </button>

    <!-- 店員介紹 -->
    <button class="nav-item" data-target="3" aria-label="店員介紹">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21V19C23 17.1 21.7 15.5 20 15.1"/>
        <path d="M16 3.1C17.8 3.5 19 5.1 19 7C19 8.9 17.8 10.5 16 10.9"/>
      </svg>
      <span class="nav-label">店員介紹</span>
    </button>

    <!-- 服務內容 -->
    <button class="nav-item" data-target="4" aria-label="服務內容">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3"/>
      </svg>
      <span class="nav-label">服務內容</span>
    </button>

    <!-- 菜單 -->
    <button class="nav-item" data-target="5" aria-label="菜單">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 3H8C9.1 3 10 3.9 10 5V19C10 17.9 9.1 17 8 17H2V3Z"/>
        <path d="M22 3H16C14.9 3 14 3.9 14 5V19C14 17.9 14.9 17 16 17H22V3Z"/>
      </svg>
      <span class="nav-label">菜單</span>
    </button>

    <!-- 精彩瞬間 -->
    <button class="nav-item" data-target="6" aria-label="精彩瞬間">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      <span class="nav-label">精彩瞬間</span>
    </button>

    <!-- 斗內香檳王 -->
    <button class="nav-item" data-target="7" aria-label="斗內香檳王">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 2H16L14 12H10L8 2Z"/>
        <line x1="12" y1="12" x2="12" y2="20"/>
        <line x1="8" y1="20" x2="16" y2="20"/>
        <line x1="7" y1="7" x2="17" y2="7"/>
      </svg>
      <span class="nav-label">斗內香檳王</span>
    </button>

    <!-- 店內環境 -->
    <button class="nav-item" data-target="8" aria-label="店內環境">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <line x1="1" y1="22" x2="23" y2="22"/>
        <rect x="3" y="12" width="3" height="10"/>
        <rect x="10" y="12" width="4" height="10"/>
        <rect x="18" y="12" width="3" height="10"/>
        <path d="M2 12L12 4L22 12"/>
      </svg>
      <span class="nav-label">店內環境</span>
    </button>

  </nav>
```

- [ ] **Step 3：瀏覽器驗證**

開啟 `http://localhost:8080`，確認：
- 底部出現半透明毛玻璃導覽列
- 9 個圖示均勻分佈，「入口」圖示頂部有金色線條（active 狀態）
- 未選中項目稍微半透明（opacity 0.45）
- 手機版（開發者工具切 375px）：導覽列高度 72px，文字縮小

- [ ] **Step 4：Commit**

```bash
git add css/nav.css index.html
git commit -m "feat: 底部導覽列樣式與 SVG 圖示"
```

---

## Task 4：nav.js — 點擊切換邏輯

**Files:**
- Create: `js/nav.js`

- [ ] **Step 1：建立 `js/nav.js`**

```javascript
(function () {
  'use strict';

  var track = document.getElementById('track');
  var navItems = document.querySelectorAll('.nav-item');
  var currentPage = 0;

  /**
   * 切換至指定頁面
   * @param {number} index - 目標頁碼（0–8）
   */
  function goToPage(index) {
    // 移動 track
    track.style.transform = 'translateX(-' + (index * 100) + 'vw)';

    // 更新導覽列 active 狀態
    navItems.forEach(function (item) {
      var isActive = parseInt(item.dataset.target, 10) === index;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    currentPage = index;
  }

  // ─── 導覽列點擊事件 ───────────────────────────────
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = parseInt(this.dataset.target, 10);
      // 確保 track 有 transition（可能被觸控手勢移除）
      track.style.transition = '';
      goToPage(target);
    });
  });

  // ─── 初始化：顯示第 0 頁 ──────────────────────────
  goToPage(0);

})();
```

- [ ] **Step 2：瀏覽器驗證（桌機點擊切換）**

開啟 `http://localhost:8080`，依序點擊所有 9 個導覽項目：

| 測試項目 | 預期結果 |
|----------|---------|
| 點擊「關於」| 畫面滑動至第 2 頁（深青色背景 + 「關於」文字）|
| 點擊「入口」| 畫面滑回第 1 頁 |
| 點擊最後一個「店內環境」| 畫面滑至第 9 頁 |
| 每次點擊 | 對應圖示頂部出現金色線條、其餘半透明 |
| 動畫 | 300ms 橫向滑動，有緩動感（非線性）|

- [ ] **Step 3：Commit**

```bash
git add js/nav.js
git commit -m "feat: 點擊導覽列切換頁面邏輯"
```

---

## Task 5：nav.js — 觸控滑動手勢

**Files:**
- Modify: `js/nav.js`（在 IIFE 內，`goToPage(0)` 之前加入觸控邏輯）

- [ ] **Step 1：在 `js/nav.js` 的 `goToPage(0)` 前加入觸控事件**

在 `// ─── 初始化` 區塊的上方，加入以下程式碼：

```javascript
  // ─── 觸控滑動手勢 ─────────────────────────────────
  var viewport = document.querySelector('.viewport');
  var touchStartX = 0;
  var touchStartY = 0;
  var isHorizontalSwipe = null; // null = 未判斷, true = 水平, false = 垂直

  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isHorizontalSwipe = null;
    // 拖曳期間移除 transition，讓畫面跟手指即時移動
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', function (e) {
    var deltaX = e.touches[0].clientX - touchStartX;
    var deltaY = e.touches[0].clientY - touchStartY;

    // 首次移動超過 5px 才判斷方向
    if (isHorizontalSwipe === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // 垂直滾動：不處理
    if (isHorizontalSwipe !== true) return;

    // 阻止瀏覽器預設的水平滾動行為
    e.preventDefault();

    // 計算 track 偏移（以 px 為單位即時跟隨手指）
    var baseOffset = currentPage * window.innerWidth;
    var newOffset = baseOffset - deltaX;

    // 限制不超出第一頁或最後一頁
    var minOffset = 0;
    var maxOffset = 8 * window.innerWidth;
    newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));

    track.style.transform = 'translateX(-' + newOffset + 'px)';
  }, { passive: false }); // passive: false 才能呼叫 e.preventDefault()

  viewport.addEventListener('touchend', function (e) {
    // 恢復 CSS transition
    track.style.transition = '';

    // 若不是水平滑動，不做任何切換
    if (isHorizontalSwipe !== true) return;

    var deltaX = e.changedTouches[0].clientX - touchStartX;

    if (deltaX < -50 && currentPage < 8) {
      goToPage(currentPage + 1); // 向左滑 → 下一頁
    } else if (deltaX > 50 && currentPage > 0) {
      goToPage(currentPage - 1); // 向右滑 → 上一頁
    } else {
      goToPage(currentPage); // 位移不足 → 彈回
    }

    isHorizontalSwipe = null;
  }, { passive: true });
```

- [ ] **Step 2：確認完整的 `js/nav.js` 內容**

完整檔案應如下（將上述觸控邏輯插入正確位置後）：

```javascript
(function () {
  'use strict';

  var track = document.getElementById('track');
  var navItems = document.querySelectorAll('.nav-item');
  var currentPage = 0;

  function goToPage(index) {
    track.style.transform = 'translateX(-' + (index * 100) + 'vw)';
    navItems.forEach(function (item) {
      var isActive = parseInt(item.dataset.target, 10) === index;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
    currentPage = index;
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      track.style.transition = '';
      goToPage(parseInt(this.dataset.target, 10));
    });
  });

  // ─── 觸控滑動手勢 ─────────────────────────────────
  var viewport = document.querySelector('.viewport');
  var touchStartX = 0;
  var touchStartY = 0;
  var isHorizontalSwipe = null;

  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isHorizontalSwipe = null;
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', function (e) {
    var deltaX = e.touches[0].clientX - touchStartX;
    var deltaY = e.touches[0].clientY - touchStartY;

    if (isHorizontalSwipe === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    }

    if (isHorizontalSwipe !== true) return;

    e.preventDefault();

    var baseOffset = currentPage * window.innerWidth;
    var newOffset = baseOffset - deltaX;
    var minOffset = 0;
    var maxOffset = 8 * window.innerWidth;
    newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));

    track.style.transform = 'translateX(-' + newOffset + 'px)';
  }, { passive: false });

  viewport.addEventListener('touchend', function (e) {
    track.style.transition = '';

    if (isHorizontalSwipe !== true) return;

    var deltaX = e.changedTouches[0].clientX - touchStartX;

    if (deltaX < -50 && currentPage < 8) {
      goToPage(currentPage + 1);
    } else if (deltaX > 50 && currentPage > 0) {
      goToPage(currentPage - 1);
    } else {
      goToPage(currentPage);
    }

    isHorizontalSwipe = null;
  }, { passive: true });

  // ─── 初始化 ───────────────────────────────────────
  goToPage(0);

})();
```

- [ ] **Step 3：手機模擬驗證**

Chrome DevTools → 切換至手機模式（375px）→ 開啟 `http://localhost:8080`：

| 測試項目 | 預期結果 |
|----------|---------|
| 向左滑動（慢）| 畫面即時跟隨手指移動 |
| 向左滑動 > 50px 後放手 | 滑至下一頁，導覽列高亮更新 |
| 向左滑動 < 50px 後放手 | 彈回原頁 |
| 在第 1 頁向右滑 | 不超出邊界（停在第 1 頁）|
| 在第 9 頁向左滑 | 不超出邊界（停在第 9 頁）|
| 上下滑動（垂直）| 觸發頁面內容區捲動，不切換頁面 |

- [ ] **Step 4：桌機整合驗收**

切回桌機模式，完整測試規格文件驗收標準（`docs/superpowers/specs/2026-04-08-bottom-nav-swipe-framework-design.md` §8）：

- [ ] 桌機：9 個導覽項目均勻排列，點擊切換正確
- [ ] 手機：底部 safe-area 不遮擋導覽列（真機或模擬器確認）
- [ ] 動畫：Slide 方向正確（點右側頁面 → 畫面向左移動）
- [ ] 手機：左右滑動 > 50px 觸發換頁
- [ ] 手機：上下滑動不誤觸換頁

- [ ] **Step 5：最終 Commit**

```bash
git add js/nav.js
git commit -m "feat: 手機觸控左右滑動換頁手勢"
```

---

## 完成後狀態

```
baifan-club/
├── index.html            ← 9 個 Section + 底部 Nav（含 SVG 圖示）
├── css/
│   ├── base.css          ← CSS 變數 + Reset + Google Fonts
│   ├── pages.css         ← Viewport / Track / Page 結構
│   └── nav.css           ← 底部導覽列（含 RWD）
└── js/
    └── nav.js            ← 點擊切換 + 觸控手勢
```

框架完成後，即可進入**第三階段**：依序逐頁切版，替換各 Section 的佔位內容。
