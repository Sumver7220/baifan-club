
# 白飯俱樂部 — 底部導覽列 + 左右切換框架 設計規格

**日期：** 2026-04-08
**階段：** 第二階段（基礎框架建立）
**技術：** 純 HTML / CSS / JS（無框架）

---

## 1. 範圍

本規格涵蓋：
- 固定底部導覽列（9 個頁面圖示 + 文字標籤）
- 全螢幕頁面容器（viewport + track 架構）
- 橫向 Slide 切換動畫
- 手機觸控左右滑動手勢
- RWD 基礎斷點

**不涵蓋：** 各頁面實際內容（第三階段逐頁切版）

---

## 2. 視覺風格參考

來源：`整體畫面圖/` 資料夾設計截圖

| 屬性 | 規格 |
|------|------|
| 整體色調 | 深紫黑（`#0a0814`）|
| 導覽列背景 | `rgba(10, 8, 20, 0.85)` + `backdrop-filter: blur(10px)` |
| 文字顏色 | 白色（`#ffffff`）|
| 金色強調 | `#c9a84c`（active 指示線）|
| 字型 | 標題：Playfair Display SC；內文：Karla（Google Fonts）|

---

## 3. HTML 結構

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>白飯俱樂部 ✦ Rice Club</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/pages.css">
</head>
<body>

  <!-- 頁面容器 -->
  <div class="viewport">
    <div class="track" id="track">
      <section class="page" id="page-0" data-page="0"><!-- 入口 --></section>
      <section class="page" id="page-1" data-page="1"><!-- 關於 --></section>
      <section class="page" id="page-2" data-page="2"><!-- 顧客守則 --></section>
      <section class="page" id="page-3" data-page="3"><!-- 店員介紹 --></section>
      <section class="page" id="page-4" data-page="4"><!-- 服務內容 --></section>
      <section class="page" id="page-5" data-page="5"><!-- 菜單 --></section>
      <section class="page" id="page-6" data-page="6"><!-- 精彩瞬間 --></section>
      <section class="page" id="page-7" data-page="7"><!-- 斗內香檳王 --></section>
      <section class="page" id="page-8" data-page="8"><!-- 店內環境 --></section>
    </div>
  </div>

  <!-- 底部導覽列 -->
  <nav class="bottom-nav" role="navigation" aria-label="主選單">
    <button class="nav-item active" data-target="0" aria-label="入口">
      <svg class="nav-icon"><!-- 入口圖示 --></svg>
      <span class="nav-label">入口</span>
    </button>
    <button class="nav-item" data-target="1" aria-label="關於">
      <svg class="nav-icon"><!-- 關於圖示 --></svg>
      <span class="nav-label">關於</span>
    </button>
    <button class="nav-item" data-target="2" aria-label="顧客守則">
      <svg class="nav-icon"><!-- 守則圖示 --></svg>
      <span class="nav-label">顧客守則</span>
    </button>
    <button class="nav-item" data-target="3" aria-label="店員介紹">
      <svg class="nav-icon"><!-- 店員圖示 --></svg>
      <span class="nav-label">店員介紹</span>
    </button>
    <button class="nav-item" data-target="4" aria-label="服務內容">
      <svg class="nav-icon"><!-- 服務圖示 --></svg>
      <span class="nav-label">服務內容</span>
    </button>
    <button class="nav-item" data-target="5" aria-label="菜單">
      <svg class="nav-icon"><!-- 菜單圖示 --></svg>
      <span class="nav-label">菜單</span>
    </button>
    <button class="nav-item" data-target="6" aria-label="精彩瞬間">
      <svg class="nav-icon"><!-- 相機圖示 --></svg>
      <span class="nav-label">精彩瞬間</span>
    </button>
    <button class="nav-item" data-target="7" aria-label="斗內香檳王">
      <svg class="nav-icon"><!-- 香檳圖示 --></svg>
      <span class="nav-label">斗內香檳王</span>
    </button>
    <button class="nav-item" data-target="8" aria-label="店內環境">
      <svg class="nav-icon"><!-- 環境圖示 --></svg>
      <span class="nav-label">店內環境</span>
    </button>
  </nav>

  <script src="js/nav.js"></script>
</body>
</html>
```

---

## 4. 檔案結構

```
baifan-club/
├── index.html
├── css/
│   ├── base.css        ← CSS reset、字型匯入、CSS 變數、全域樣式
│   ├── nav.css         ← 底部導覽列樣式
│   └── pages.css       ← viewport、track、page 基礎樣式
├── js/
│   └── nav.js          ← 切換邏輯、觸控手勢
└── assets/
    └── icons/          ← 9 個 SVG 圖示檔（入口、關於…等）
```

---

## 5. CSS 規格

### base.css — CSS 變數

```css
:root {
  --color-bg:        #0a0814;
  --color-text:      #ffffff;
  --color-gold:      #c9a84c;
  --color-nav-bg:    rgba(10, 8, 20, 0.85);
  --nav-height-desk: 64px;
  --nav-height-mob:  72px;
  --transition-page: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### nav.css — 底部導覽列

| 屬性 | 桌機（≥ 768px）| 手機（< 768px）|
|------|--------------|--------------|
| 高度 | 64px | 72px |
| 圖示大小 | 24px | 22px |
| 文字大小 | 11px | 9px |
| 未選中透明度 | 0.45 | 0.45 |
| 選中透明度 | 1.0 | 1.0 |
| 選中指示器 | 圖示上方 2px 金色線條 | 同左 |
| padding-bottom | 0 | env(safe-area-inset-bottom) |

### pages.css — viewport + track

```
.viewport:
  width:    100vw
  height:   100dvh（支援行動裝置動態視窗高度）
  overflow: hidden

.track:
  display: flex
  width:   900vw（9 頁 × 100vw）
  height:  100%
  transition: transform var(--transition-page)

.page:
  width:     100vw
  height:    100%
  flex-shrink: 0
  padding-bottom: var(--nav-height-mob) / var(--nav-height-desk)
```

---

## 6. JS 邏輯（nav.js）

### 6.1 切換頁面

```
函數 goToPage(index):
  1. 計算 track 位移：offset = index × 100vw
  2. 套用：track.style.transform = translateX(-offset)
  3. 更新 nav 高亮：移除所有 .active，加到 nav-item[data-target=index]
  4. 儲存當前頁：currentPage = index
```

### 6.2 切換方向（動畫有方向感）

```
direction = newIndex > currentPage ? "right" : "left"
→ 由 CSS transform translateX 自然呈現（Track 整體移動）
→ 無需額外處理，方向感已內含
```

### 6.3 手機觸控手勢

```
touchstart:  記錄 touchStartX、touchStartY
touchmove:   計算 deltaX、deltaY
             若 |deltaY| > |deltaX| → 忽略（垂直滾動優先）
             否則 → 即時移動 track（手指跟隨，無 transition）
touchend:    若 |deltaX| > 50px → 切換頁面（snap）
             否則 → 彈回原頁（加回 transition）
```

**判斷閾值：** 50px（避免誤觸）

---

## 7. 無障礙

- `<nav>` 加 `role="navigation"` + `aria-label="主選單"`
- 每個 `<button>` 加 `aria-label`（完整頁面名稱）
- 選中項目加 `aria-current="page"`
- 圖示 SVG 加 `aria-hidden="true"`（由 button aria-label 說明）
- 支援鍵盤 Tab 瀏覽

---

## 8. 驗收標準

- [ ] 桌機：9 個導覽項目均勻排列，點擊切換正確
- [ ] 手機：底部 safe-area 不遮擋導覽列
- [ ] 動畫：Slide 方向正確（往右點 → 右頁從右滑入）
- [ ] 手機：左右滑動 > 50px 觸發換頁
- [ ] 手機：上下滑動不誤觸換頁
- [ ] 所有頁面 section 有佔位內容（顏色區分）便於測試
