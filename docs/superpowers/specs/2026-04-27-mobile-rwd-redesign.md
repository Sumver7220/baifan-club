# 白飯俱樂部 — 手機版 RWD 重設計規格

**日期：** 2026-04-27
**對應 Milestone：** v1.1 行動版布局
**對應 Phase：** Phase 3（取代 2026-04-19 舊規格）

---

## 1. 背景與決策

### 1.1 起點

v1.0 完成後移除所有 RWD 樣式，從零重建響應式策略。原因：舊版 RWD 品質不佳，系統性失效。

### 1.2 設計基準

- 桌機設計基準寬度：**1912px**（4K 27" + 200% OS 縮放）
- 行動版斷點：**< 1200px**
- 超大螢幕上限：**2560px**（不延伸至 3840px，餐廳網站受眾不需要）

---

## 2. 架構：兩層分流

| 範圍 | 策略 |
|------|------|
| **≥ 1200px** | 桌機層：保留現有橫向切頁系統，min-width 鎖定，clamp() 精修 |
| **< 1200px** | 行動層：垂直長頁捲動，全新導覽，各頁面獨立重排 |

兩層以 `@media (max-width: 1199px)` 分界，互不干擾。

---

## 3. 桌機層（≥ 1200px）

### 3.1 改動項目

**min-width 鎖定：**
在 `.viewport` 加 `min-width: 1200px`，確保桌機版在小視窗不破版，由行動層接管。

**clamp() token 精修：**
現有 clamp 範圍調整為精確覆蓋 1200px–1920px，讓字型與間距在此範圍內比例正確。

**底部導覽不動：**
`position: fixed` 的底部導覽維持現狀，行動層以 `display: none` 隱藏。

### 3.2 不動的部分

- `.viewport` + `.track` translateX 橫向切頁系統
- `goToPage()` JS 邏輯
- 觸控橫向滑動
- 店員 Modal

---

## 4. 行動層（< 1200px）

### 4.1 布局切換

```css
@media (max-width: 1199px) {
  /* 解除全域鎖定 */
  html, body { overflow: auto; height: auto; }
  .viewport { overflow: visible; height: auto; min-width: unset; }
  .track { transform: none !important; display: block; width: 100%; }

  /* 底部導覽隱藏 */
  .bottom-nav { display: none; }

  /* 每個 .page 恢復為自然塊狀 */
  .page { width: 100%; height: auto; }
}
```

### 4.2 導覽設計：Logo + Hamburger + 右側圓點

**頂部 sticky 導覽列：**
- 高度約 44px，dark glass morphism 背景
- 左：白飯俱樂部 Logo（明朝體，letter-spacing 0.3em）
- 右：漢堡圖示（金色 `#c9a84c` 細線，三橫）
- `position: sticky; top: 0; z-index: 100`

**右側圓點指示器：**
- `position: fixed; right: 8px; top: 50%; transform: translateY(-50%)`
- 8 個點對應 Page 0–Page 8（Page 7 顯示但 disabled：opacity 0.3，pointer-events: none）
- 預設：`rgba(255,255,255,0.2)`
- 已捲過：`rgba(201,168,76,0.25)`
- 目前：金色條狀 `#c9a84c`，高度拉長至 12px，border-radius 2px
- 由 `IntersectionObserver` (threshold: 0.5) 驅動 active 狀態

**漢堡展開全螢幕選單：**
- 全螢幕 overlay：`background: rgba(6,4,12,0.97); backdrop-filter: blur(8px)`
- 頂部：Logo + 關閉按鈕（金色 X）
- 頁面列表：編號（01–08） + 中文名稱 + 英文名稱
- 目前頁：金色文字 + 左側金色 3px 豎條（neon 光暈）
- 底部：copyright tagline
- 點擊任一項：scrollIntoView({ behavior: 'smooth' }) + 關閉 overlay

### 4.3 JS 行為切換

以 `matchMedia('(max-width: 1199px)')` 在初始化與 resize 時切換模式：

- **桌機模式**：`goToPage()` / translateX / 底部導覽 active / swipe 監聽
- **行動模式**：`scrollIntoView()` / 右側圓點 IntersectionObserver / 漢堡選單 / swipe 停用

---

## 5. 各頁面行動版布局

### Page 0 入口
- 保留全幅背景圖（100dvh 高度的入口感）
- 中央：白飯俱樂部標題 + RICE CLUB subtitle + 霓虹 CTA
- 底部：向下捲動提示（文字 + 細線漸層）

### Page 1 品牌故事
- 頂部：全幅背景圖（固定高度約 180px）作為視覺錨點
- 下方：深色玻璃面板（`rgba(255,255,255,0.03)` + backdrop-filter）
- 桌機兩欄文字 → 行動版**單欄**，左對齊，行高 2.1
- 金色分隔線（漸層淡出）分隔段落群
- 右下角保留霓虹 CTA（了解更多）

### Page 2 顧客守則
- 背景圖 + 文字卡片區
- 守則條目單欄排列，每條有編號前綴

### Page 3 店員介紹
- 區段標題（中英文，居中）
- 第一張卡片（主廚）**全寬 feature card**，aspect-ratio 16/7
- 其餘店員：**2欄格子**，aspect-ratio 3/4（≥ 390px），< 320px 切為單欄
- 卡片底部：姓名徽章（漸層遮罩 + 中文名 + 職稱）
- 空缺位置：虛線 dashed border + 淡色「即將加入」文字
- 點擊卡片仍可開啟 Modal（桌機 Modal 沿用，CSS 在行動端需確認寬度）

### Page 4 特色服務
- 區段標題
- 每個服務：獨立卡片（border: 1px solid rgba(255,255,255,0.07)）
- 卡片內：服務名稱 + 說明文字 + 標籤（金色圓角 pill）

### Page 5 菜單
- 區段標題
- 菜單海報圖（全寬，aspect-ratio 3/4，可點擊放大）
- 金色漸層分隔線
- 分類 + 項目列表：類別標籤 + 菜名左對齊、價格右對齊金色
- 頁面本身可捲動（不裁切）

### Page 6 精彩瞬間
- 圖片牆（若為多張）：2欄格子
- 若為單張：全幅展示

### Page 8 店內環境
- 與 Page 6 類似處理，圖片優先

---

## 6. CSS 組織原則

- 每個現有 SCSS partial 底部加 `@media (max-width: 1199px) {}` 覆蓋區塊
- 不新增獨立的 mobile.scss 入口檔案
- 行動版覆蓋僅改動必要屬性，保留共用 token

---

## 7. 驗收條件（UAT）

| # | 條件 | 驗收方式 |
|---|------|---------|
| U-01 | < 1200px 可自然垂直捲動所有內容，無裁切 | 手動滾動 iPhone 14 / Chrome DevTools 390px |
| U-02 | 圓點 active 狀態隨捲動正確更新 | 慢速捲動，每個區塊觸發一次 |
| U-03 | 漢堡展開選單，點擊任一項可跳轉並關閉 | 每個頁面連結測試一次 |
| U-04 | 320px 寬度無水平溢出 | DevTools 320px |
| U-05 | ≥ 1200px 桌機橫向切頁完全不受影響 | 1920px 視窗完整測試 |
| U-06 | 店員卡片點擊可開啟 Modal | 行動端實際點擊測試 |
| U-07 | 頂部導覽列 sticky，捲動時不消失 | 滾動至任何頁面底部驗證 |
| U-08 | 右側圓點不干擾內容點擊（z-index / pointer-events 正確） | 點擊右側邊緣內容 |

---

## 8. 風險與對策

| 風險 | 對策 |
|------|------|
| 桌機 Modal 在手機寬度破版 | 行動版 `@media` 中加 `max-width: calc(100vw - 2rem)` |
| IntersectionObserver 在快速捲動時 active 閃爍 | tie-break 取可視占比最高的 section |
| Page 7 為 placeholder | 圓點顯示但 disabled（opacity: 0.3，pointer-events: none） |
| 超長頁面首次載入跳動 | `scroll-behavior: smooth` 僅在行動層設定 |

---

*規格建立：2026-04-27*
*前一版規格：`docs/superpowers/specs/2026-04-19-mobile-layout-design.md`（已由本文件取代）*
