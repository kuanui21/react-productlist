# 產品查詢網頁

這是一個基於 React 開發的產品列表應用，具備多種篩選、排序和分頁功能，並支援響應式設計（RWD），以提供在不同設備上良好的用戶體驗。

## 功能特色

* **關鍵字搜尋**：根據產品名稱進行搜尋。
* **類別篩選**：可選擇一個或多個產品類別進行篩選，支援「全選」與「取消全選」操作。
* **價格區間篩選**：設定最低價和最高價來篩選產品。
* **庫存狀態篩選**：僅顯示有庫存的產品。
* **多種排序方式**：支援按價格升序或降序排列產品。
* **分頁功能**：將產品列表分頁顯示，提高載入效率和用戶體驗。
* **每頁顯示數量設定**：用戶可自訂每頁顯示的產品數量。
* **響應式設計 (RWD)**：
    * 在桌面端顯示為表格形式 (`ProductTable`)。
    * 在行動端顯示為卡片網格形式 (`ProductCardGrid`)。
* **重置篩選**：一鍵清除所有篩選條件，恢復預設顯示。
* **Loading 狀態**：在數據載入或篩選過程中顯示載入指示，提升用戶體驗。

## 技術棧

* **前端框架**：React.js
* **狀態管理**：React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
* **CSS 框架**：Tailwind CSS (用於快速構建響應式 UI)
* **分頁套件**：`react-paginate`
* **圖標庫**：`react-icons`

## 專案結構
```
├── public/
│   └── items.json          # 模擬的產品數據
├── src/
│   ├── assets/             # 靜態資源
│   ├── components/
│   │   ├── ProductCardGrid.jsx   # 行動端產品卡片網格組件
│   │   ├── ProductFilterForm.jsx # 產品篩選功能組件
│   │   ├── ProductList.jsx       # 產品列表頁面
│   │   └── ProductTable.jsx      # 桌面端產品表格組件
│   ├── App.js              # 應用程式主入口
│   ├── main.jsx            # React 根渲染文件
│   └── index.css           # 全局樣式 / Tailwind CSS 配置
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```