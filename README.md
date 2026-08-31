# 📱 App Store & Google Play Screenshot Studio
### 專業級 App 上架截圖生成器 & ASO 視覺行銷設計工具
### Professional App Store Screenshot Generator & ASO Marketing Studio

[繁體中文](#繁體中文說明) | [English](#english-documentation)

---

## 繁體中文說明

**App Store & Google Play Screenshot Studio** 是一款專為獨立開發者（Indie Hackers）、設計師與行動應用發行團隊打造的專業截圖生成器。無需使用複雜的 Photoshop 或 Figma，直接在瀏覽器中快速排版、合成最新旗艦機型（iPhone 16 Pro、Apple Watch Ultra 2、iPad Pro、Pixel 9 Pro 等）、套用 ASO 行銷文案，並一鍵打包匯出符合 Apple App Store 與 Google Play 官方規格的高解析度截圖套組。

### ✨ 核心亮點

- **🔒 100% 本地運算與零雲端存儲（Zero-Cloud Privacy）**：
  - 上傳的 App UI 圖片由瀏覽器端直接以 Base64 / Blob 於記憶體內渲染，**絕不傳送至任何遠端伺服器或第三方資料庫**，確保未公開 App 商業機密安全無虞。
  - 運算均由本機 GPU/Canvas 即時算圖，伺服器零負擔。
- **📐 iOS HIG 智慧黃金比例對齊（Smart HIG Alignment）**：
  - 內建一鍵智慧吸附：遵循 iOS App Store 61.8% 黃金分割法則與官方安全邊界（Safe Zones），避免標題在手機列表縮圖時被裁切。
- **📱 跨裝置多機型矩陣**：
  - **Apple 生態系**：iPhone 16 Pro Max / 16 Pro（動態島）、Apple Watch Ultra 2 / Series 10（支援海洋/高山錶帶更換）、iPad Pro 13" 等。
  - **Android 生態系**：Google Pixel 9 Pro、Samsung Galaxy S24 Ultra 等。
  - 支援機身原色、鈦金屬色、邊框材質自訂。
- **🎨 豐富版面模式**：
  - 標準置頂標題、iPhone + Watch 雙機聯動、3D 左/右傾斜透視、雙手機重疊展示等。
- **✨ Gemini AI 智慧行銷文案大師**：
  - 自動依據 App 定位生成 ASO 吸睛標題、副標題與故事線（Story Arc），並支援一鍵英/日/繁中多國在地化翻譯。
- **📦 一鍵官方規格 ZIP 批次打包**：
  - 自動依據 Apple 規範匯出 6.9" / 6.7" / iPad / Watch 等像素尺寸的完整圖片壓縮包。

---

### 🚀 快速開始

#### 環境需求
- [Node.js](https://nodejs.org/) (v18 或更新版本)
- npm, pnpm 或 yarn

#### 本地安裝與執行

1. **複製專案庫**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **安裝相依套件**
   ```bash
   npm install
   ```

3. **環境變數設定（可選）**
   若需要使用 Gemini AI 文案生成功能，請複製 `.env.example` 並建立 `.env`：
   ```bash
   cp .env.example .env
   ```
   在 `.env` 中填入您的 Gemini API Key：
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(若不填寫 API Key，所有截圖編輯、機型更換、排版調色與匯出功能仍可 100% 離線正常使用)*

4. **啟動本機開發伺服器**
   ```bash
   npm run dev
   ```
   開啟瀏覽器訪問 `http://localhost:3000` 即可開始製作截圖。

5. **建置正式生產版本**
   ```bash
   npm run build
   ```

---

### ☁️ 免費部署至 Cloudflare Pages

本專案的前端完全可以在 **Cloudflare Pages** 免費部署與託管（享受全球 CDN 加速與無限流量）：

1. 將專案 Push 至您的 **GitHub** Repository。
2. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)，點選 **Workers & Pages** -> **Create application** -> **Pages**。
3. 連結您的 GitHub 帳號並選取此專案。
4. 設定建置參數：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. （可選）在 **Environment variables** 中加入 `GEMINI_API_KEY`。
6. 點選 **Save and Deploy**，即可在 1 分鐘內獲得專屬網址。

---

---

## English Documentation

**App Store & Google Play Screenshot Studio** is a professional screenshot generator and ASO marketing suite built for indie hackers, mobile designers, and app publishers. Craft stunning, high-converting App Store & Google Play visuals in minutes with dynamic device mockups, Apple HIG alignment, and 1-click batch export.

### ✨ Key Features

- **🔒 100% Client-Side Privacy (Zero-Cloud Uploads)**:
  - All uploaded screenshots are processed locally in your browser memory via Base64/Canvas. **No images are ever sent to or stored on any server or external database**, ensuring unreleased app designs remain 100% confidential.
- **📐 Apple HIG Smart Alignment**:
  - Automatically snaps headlines and devices to iOS App Store golden ratio (61.8%) and safe zones to avoid thumbnail clipping.
- **📱 Modern Device Mockup Matrix**:
  - iPhone 16 Pro Max / 16 Pro (Dynamic Island), Apple Watch Ultra 2 (custom bands & finishes), iPad Pro 13", Google Pixel 9 Pro, Samsung Galaxy S24 Ultra, and more.
- **🎨 Flexible Layout Templates**:
  - Standard top header, iPhone + Apple Watch duo, 3D tilt perspective, dual-phone overlap, and watch-centric showcases.
- **✨ AI Pitch & ASO Copy Assistant**:
  - Powered by Gemini to generate story arcs, high-converting feature badges, and multi-language localization (EN, JA, ZH-TW).
- **📦 1-Click Multi-Device Batch Export**:
  - Export full screenshot decks as high-resolution PNGs bundled in a single ZIP file, tailored to exact App Store dimensions.

---

### 🚀 Getting Started

#### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- npm, pnpm, or yarn

#### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**
   If you want to use the AI copywriting features, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(Without the API key, all image editing, mockup styling, and export features work 100% offline)*

4. **Start the local server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for production**
   ```bash
   npm run build
   ```

---

### ☁️ Free Deployment to Cloudflare Pages

You can easily deploy and host this project on **Cloudflare Pages** for free:

1. Push this project to your **GitHub** repository.
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages**.
3. Connect your GitHub repository.
4. Set the build configurations:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. (Optional) Set `GEMINI_API_KEY` in **Settings** -> **Environment variables**.
6. Click **Save and Deploy**. Your live URL will be ready in seconds.

---

### 📄 License

MIT License. Free for personal and commercial use.
