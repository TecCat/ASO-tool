import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'zh-TW' | 'en';

export interface Translations {
  // App Header
  appTitle: string;
  appBadge: string;
  appSubtitle: string;
  presetLabel: string;
  iphoneView: string;
  ipadView: string;
  storyboardView: string;
  safeZones: string;
  aiAssistantBtn: string;
  exportBtn: string;
  zoomIn: string;
  zoomOut: string;

  // Smart Alignment
  smartAlignTitle: string;
  smartAlignSubtitle: string;
  smartAlignSnapNow: string;
  smartAlignCardTitle: string;
  smartAlignHIG: string;
  smartAlignDesc: string;
  goldenRatio: string;
  goldenRatioDesc: string;
  safeMargin: string;
  safeMarginDesc: string;
  opticalCenter: string;
  opticalCenterDesc: string;
  snapCurrentSlide: string;
  applyAlignToAll: string;
  snapGoldenSuccess: string;
  snapSafeSuccess: string;
  snapCenterSuccess: string;
  appliedToAllSuffix: string;

  // Sidebar Tabs
  tabText: string;
  tabDevice: string;
  tabBackground: string;
  tabUpload: string;

  // Text Tab
  badgeSection: string;
  enableBadge: string;
  badgeContent: string;
  badgeBgColor: string;
  badgeTextColor: string;
  headlineSection: string;
  headlinePlaceholder: string;
  headlineFont: string;
  headlineSize: string;
  headlineWeight: string;
  headlineColor: string;
  letterSpacing: string;
  lineHeight: string;
  textAlign: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  subtitleSection: string;
  enableSubtitle: string;
  subtitlePlaceholder: string;
  subtitleSize: string;
  subtitleColor: string;
  subtitleOpacity: string;
  ratingSection: string;
  enableRating: string;
  ratingScore: string;
  ratingCount: string;
  applyTextToAll: string;
  applyTextToAllDesc: string;

  // Device & Layout Tab
  layoutMode: string;
  layoutTextTop: string;
  layoutPhoneTop: string;
  layoutTiltedLeft: string;
  layoutTiltedRight: string;
  layoutDualDevices: string;
  layoutWatchEcosystem: string;
  layoutWatchHero: string;
  deviceCategory: string;
  catIphone: string;
  catIpad: string;
  catWatch: string;
  catAndroid: string;
  deviceModel: string;
  deviceColor: string;
  deviceScale: string;
  offsetX: string;
  offsetY: string;
  rotateZ: string;
  shadowIntensity: string;
  glareEffect: string;
  showStatusBar: string;
  showDynamicIsland: string;
  applyDeviceToAll: string;

  // Background Tab
  bgPresets: string;
  bgType: string;
  bgLinearGradient: string;
  bgMeshRadial: string;
  bgSolid: string;
  bgGlassmorphism: string;
  bgCustomImage: string;
  startColor: string;
  endColor: string;
  gradientAngle: string;
  glassBlur: string;
  noiseTexture: string;
  darkOverlay: string;
  uploadBgImage: string;
  applyBgToAll: string;

  // Upload Tab
  primaryScreenshot: string;
  primaryScreenshotDesc: string;
  uploadPrimaryBtn: string;
  secondaryScreenshot: string;
  secondaryScreenshotDesc: string;
  uploadSecondaryBtn: string;
  clearImage: string;
  recommendedResolutionTitle: string;
  usePresetSample: string;

  // Thumbnail Deck
  deckTitle: string;
  deckHint: string;
  addSlide: string;
  moveLeft: string;
  moveRight: string;
  duplicateSlide: string;
  deleteSlide: string;

  // Export Modal
  exportModalTitle: string;
  exportModalDesc: string;
  tabUniversal: string;
  tabAppStore: string;
  tabGooglePlay: string;
  quickSelect: string;
  selRequired: string;
  selAllPhones: string;
  selAllWatches: string;
  selAllTablets: string;
  selAll: string;
  exportFormat: string;
  selectedSpecsCount: string;
  exportSingleCurrent: string;
  batchExportZip: string;
  renderingProgress: string;
  exportSuccess: string;
  exportFailed: string;
  requiredBadge: string;
  recommendedBadge: string;

  // AI Copy Assistant
  aiAssistantTitle: string;
  aiAssistantDesc: string;
  aiTabVariations: string;
  aiTabFullDeck: string;
  aiTabLocalize: string;
  appNameLabel: string;
  appCategoryLabel: string;
  appDescLabel: string;
  toneLabel: string;
  toneAppleMinimal: string;
  toneBoldAction: string;
  toneProblemSolution: string;
  toneSocialProof: string;
  generateVariationsBtn: string;
  generateDeckBtn: string;
  localizeBtn: string;
  applyToCurrentSlide: string;
  applyDeckToAll: string;
  copyText: string;
  copied: string;
  generatingAI: string;
}

export const translations: Record<Language, Translations> = {
  'zh-TW': {
    // App Header
    appTitle: 'AppStore Screenshot Studio',
    appBadge: 'iOS 18',
    appSubtitle: '專為 iOS 開發者打造之高轉化截圖生成器',
    presetLabel: '範本套版:',
    iphoneView: 'iPhone 6.9"',
    ipadView: 'iPad Pro 13"',
    storyboardView: '全覽故事板',
    safeZones: '安全區導線',
    aiAssistantBtn: 'AI 標題 ASO 優化',
    exportBtn: '匯出 App Store 規格',
    zoomIn: '放大',
    zoomOut: '縮小',

    // Smart Alignment
    smartAlignTitle: 'iOS 智慧對齊',
    smartAlignSubtitle: '黃金分割 & 安全邊界',
    smartAlignSnapNow: '一鍵吸附',
    smartAlignCardTitle: 'iOS App Store 智慧吸附對齊',
    smartAlignHIG: 'HIG 規範',
    smartAlignDesc: '自動依據 Apple HIG 與黃金比例（38.2% 標題區 + 61.8% 裝置下半區）校準位置與邊界，確保在各機型 App Store 列表中視覺平衡且不被裁切。',
    goldenRatio: '黃金分割 (61.8%)',
    goldenRatioDesc: '極佳視覺閱讀比例',
    safeMargin: '安全邊界 (Safe)',
    safeMarginDesc: '避開 8% 上架裁切',
    opticalCenter: '光學居中 (Center)',
    opticalCenterDesc: '精準 X:0 / Y:0',
    snapCurrentSlide: '即刻智慧對齊本頁',
    applyAlignToAll: '套用對齊至全套',
    snapGoldenSuccess: '✨ 已依 iOS App Store 黃金分割線 (61.8%) 自動吸附對齊！',
    snapSafeSuccess: '📐 已吸附至 iOS App Store 官方安全邊界 (Safe Zones)！',
    snapCenterSuccess: '🎯 已校準至光學居中對稱！',
    appliedToAllSuffix: ' (已同步套用至全部 Slide)',

    // Sidebar Tabs
    tabText: '文字標題',
    tabDevice: '版面裝置',
    tabBackground: '背景自訂',
    tabUpload: '截圖 UI',

    // Text Tab
    badgeSection: '頂部焦點標籤 (Badge)',
    enableBadge: '啟用標籤',
    badgeContent: '標籤文字',
    badgeBgColor: '標籤背景色',
    badgeTextColor: '標籤文字色',
    headlineSection: '主標題 (Headline)',
    headlinePlaceholder: '輸入醒目的 App 核心賣點...',
    headlineFont: '字體選擇',
    headlineSize: '標題字級大小',
    headlineWeight: '字體粗細',
    headlineColor: '標題顏色',
    letterSpacing: '字元間距 (Tracking)',
    lineHeight: '行高 (Leading)',
    textAlign: '對齊方式',
    alignLeft: '靠左',
    alignCenter: '置中',
    alignRight: '靠右',
    subtitleSection: '副標題 (Subtitle)',
    enableSubtitle: '啟用副標題',
    subtitlePlaceholder: '輸入進一步解釋功能特點的輔助說明...',
    subtitleSize: '副標題字級大小',
    subtitleColor: '副標題顏色',
    subtitleOpacity: '不透明度',
    ratingSection: '五星用戶評價 (Social Proof)',
    enableRating: '啟用評價徽章',
    ratingScore: '評分分數 (1.0 ~ 5.0)',
    ratingCount: '評價數量文字',
    applyTextToAll: '套用文字風格至全部 Slide',
    applyTextToAllDesc: '（僅同步字體、顏色、字級與樣式，保留各頁專屬文字）',

    // Device & Layout Tab
    layoutMode: '版型排列與構圖模式',
    layoutTextTop: '標準置頂 (文字在上 機身在下)',
    layoutPhoneTop: '顛倒構圖 (機身在上 文字在下)',
    layoutTiltedLeft: '3D 透視向左傾斜',
    layoutTiltedRight: '3D 透視向右傾斜',
    layoutDualDevices: '雙機重疊層次展示',
    layoutWatchEcosystem: 'Apple Watch + iPhone 雙機生態',
    layoutWatchHero: 'Apple Watch 獨立焦點',
    deviceCategory: '裝置類別 (Category)',
    catIphone: 'iPhone',
    catIpad: 'iPad',
    catWatch: 'Apple Watch',
    catAndroid: 'Android',
    deviceModel: '機型型號 (Device Model)',
    deviceColor: '機身顏色 (Device Color)',
    deviceScale: '機身縮放比例 (Scale)',
    offsetX: '水平左右位移 (X)',
    offsetY: '垂直上下位移 (Y)',
    rotateZ: '平面旋轉角度 (Z)',
    shadowIntensity: '多層立體陰影 (Shadow)',
    glareEffect: '螢幕真實反光玻璃層 (Glare)',
    showStatusBar: '顯示頂部狀態列 (iOS 狀態欄)',
    showDynamicIsland: '顯示動態島 / 瀏海',
    applyDeviceToAll: '套用此裝置外觀至全部 Slide',

    // Background Tab
    bgPresets: '熱門風格主題預設',
    bgType: '背景類型 (Background Type)',
    bgLinearGradient: '線性漸層 (Linear)',
    bgMeshRadial: '立體光暈 (Radial Mesh)',
    bgSolid: '純色極簡 (Solid)',
    bgGlassmorphism: '毛玻璃光斑 (Glass)',
    bgCustomImage: '自訂圖片 (Image)',
    startColor: '起始顏色',
    endColor: '結束顏色',
    gradientAngle: '漸層角度 (Angle)',
    glassBlur: '光斑模糊度 (Blur)',
    noiseTexture: 'Apple 質感雜色微粒 (Noise Grain)',
    darkOverlay: '深色遮罩暗角 (Vignette)',
    uploadBgImage: '上傳自訂背景底圖',
    applyBgToAll: '套用此背景至全部 Slide',

    // Upload Tab
    primaryScreenshot: '主要截圖 (Primary Screenshot)',
    primaryScreenshotDesc: '拖曳或點擊上傳 iPhone / 主機介面截圖',
    uploadPrimaryBtn: '上傳主要截圖',
    secondaryScreenshot: '第二裝置 / 手錶介面截圖',
    secondaryScreenshotDesc: '供雙機重疊或 Apple Watch 模式使用',
    uploadSecondaryBtn: '上傳第二介面截圖',
    clearImage: '清除自訂圖片',
    recommendedResolutionTitle: '💡 建議最佳截圖比例',
    usePresetSample: '恢復使用精美預設截圖',

    // Thumbnail Deck
    deckTitle: '截圖套組',
    deckHint: 'App Store 建議提供 3 ~ 10 張',
    addSlide: '新增 Slide',
    moveLeft: '往左移',
    moveRight: '往右移',
    duplicateSlide: '複製此頁',
    deleteSlide: '刪除此頁',

    // Export Modal
    exportModalTitle: '匯出 App Store & Google Play 規格套組',
    exportModalDesc: '高解析度向量繪圖引擎，直接輸出符合 Apple 與 Google 官方最新送審上架尺寸規範',
    tabUniversal: '全平台全規格 (All)',
    tabAppStore: 'App Store (iOS)',
    tabGooglePlay: 'Google Play (Android)',
    quickSelect: '快速選取:',
    selRequired: '必填必交尺寸',
    selAllPhones: '所有手機',
    selAllWatches: '所有手錶',
    selAllTablets: '所有平板',
    selAll: '全選規格',
    exportFormat: '輸出檔案格式',
    selectedSpecsCount: '已勾選規格',
    exportSingleCurrent: '下載目前單頁 (Current Slide)',
    batchExportZip: '一鍵打包下載 ZIP (全套匯出)',
    renderingProgress: '正在為您算圖並打包高解析度檔案...',
    exportSuccess: '🎉 匯出成功！已自動開始下載',
    exportFailed: '匯出發生錯誤，請重試',
    requiredBadge: '必備上架',
    recommendedBadge: '官方推薦',

    // AI Copy Assistant
    aiAssistantTitle: 'AI 靈感文案與 ASO 優化引擎',
    aiAssistantDesc: '透過 Gemini AI 依據您的 App 類別與特色，自動產出高轉化率的 App Store 標題與副標題',
    aiTabVariations: '單頁靈感變體',
    aiTabFullDeck: '全套故事線',
    aiTabLocalize: '多國語系在地化',
    appNameLabel: 'App 名稱',
    appCategoryLabel: 'App 類別',
    appDescLabel: 'App 核心賣點與簡介',
    toneLabel: '文案語氣風格',
    toneAppleMinimal: 'Apple 官方極簡風 (優雅高質感)',
    toneBoldAction: '強烈行動號召 (高轉換率)',
    toneProblemSolution: '痛點解決型 (直擊需求)',
    toneSocialProof: '權威認證與口碑推薦',
    generateVariationsBtn: '✨ AI 生成單頁標題變體',
    generateDeckBtn: '🚀 AI 生成全套連貫故事線',
    localizeBtn: '🌐 AI 翻譯至英日韓語系',
    applyToCurrentSlide: '套用至目前 Slide',
    applyDeckToAll: '一鍵套用全套故事線',
    copyText: '複製文案',
    copied: '已複製！',
    generatingAI: 'AI 正在精算高轉化標題中...',
  },

  'en': {
    // App Header
    appTitle: 'AppStore Screenshot Studio',
    appBadge: 'iOS 18',
    appSubtitle: 'High-conversion screenshot generator built for iOS developers',
    presetLabel: 'Presets:',
    iphoneView: 'iPhone 6.9"',
    ipadView: 'iPad Pro 13"',
    storyboardView: 'Storyboard',
    safeZones: 'Safe Zones',
    aiAssistantBtn: 'AI Copy & ASO',
    exportBtn: 'Export App Store Specs',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',

    // Smart Alignment
    smartAlignTitle: 'iOS Smart Align',
    smartAlignSubtitle: 'Golden Ratio & Safe Zones',
    smartAlignSnapNow: 'Snap Now',
    smartAlignCardTitle: 'iOS App Store Smart Alignment & Snapping',
    smartAlignHIG: 'HIG Specs',
    smartAlignDesc: 'Automatically calibrates layout and margins based on Apple HIG & Golden Ratio (38.2% header area + 61.8% lower device anchor), preventing search preview cropping.',
    goldenRatio: 'Golden Ratio (61.8%)',
    goldenRatioDesc: 'Optimal visual balance',
    safeMargin: 'Safe Zones (Margin)',
    safeMarginDesc: 'Avoids 8% store edge crops',
    opticalCenter: 'Optical Center',
    opticalCenterDesc: 'Precision X:0 / Y:0',
    snapCurrentSlide: 'Snap Current Slide',
    applyAlignToAll: 'Apply Alignment to All',
    snapGoldenSuccess: '✨ Snapped to iOS App Store Golden Ratio (61.8%)!',
    snapSafeSuccess: '📐 Snapped to iOS App Store Official Safe Zones!',
    snapCenterSuccess: '🎯 Optical centering calibrated!',
    appliedToAllSuffix: ' (Applied to all slides)',

    // Sidebar Tabs
    tabText: 'Typography',
    tabDevice: 'Device & Layout',
    tabBackground: 'Background',
    tabUpload: 'Screenshots',

    // Text Tab
    badgeSection: 'Header Highlight Badge',
    enableBadge: 'Enable Badge',
    badgeContent: 'Badge Text',
    badgeBgColor: 'Badge Background',
    badgeTextColor: 'Badge Text Color',
    headlineSection: 'Headline',
    headlinePlaceholder: 'Enter a punchy value proposition...',
    headlineFont: 'Font Family',
    headlineSize: 'Headline Font Size',
    headlineWeight: 'Font Weight',
    headlineColor: 'Headline Color',
    letterSpacing: 'Tracking (Letter Spacing)',
    lineHeight: 'Leading (Line Height)',
    textAlign: 'Alignment',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    subtitleSection: 'Subtitle',
    enableSubtitle: 'Enable Subtitle',
    subtitlePlaceholder: 'Enter supporting explanation or key features...',
    subtitleSize: 'Subtitle Font Size',
    subtitleColor: 'Subtitle Color',
    subtitleOpacity: 'Opacity',
    ratingSection: 'Star Rating & Social Proof',
    enableRating: 'Enable Social Proof Badge',
    ratingScore: 'Rating Score (1.0 ~ 5.0)',
    ratingCount: 'Rating Count Text',
    applyTextToAll: 'Apply Typography to All Slides',
    applyTextToAllDesc: '(Synchronizes font, size, and colors while keeping slide-specific text)',

    // Device & Layout Tab
    layoutMode: 'Layout & Framing Modes',
    layoutTextTop: 'Standard (Text Top / Device Bottom)',
    layoutPhoneTop: 'Inverted (Device Top / Text Bottom)',
    layoutTiltedLeft: '3D Left Perspective Tilt',
    layoutTiltedRight: '3D Right Perspective Tilt',
    layoutDualDevices: 'Dual Devices Stacking',
    layoutWatchEcosystem: 'Apple Watch + iPhone Ecosystem',
    layoutWatchHero: 'Apple Watch Hero Focus',
    deviceCategory: 'Device Category',
    catIphone: 'iPhone',
    catIpad: 'iPad',
    catWatch: 'Apple Watch',
    catAndroid: 'Android',
    deviceModel: 'Device Model',
    deviceColor: 'Device Color',
    deviceScale: 'Scale',
    offsetX: 'Horizontal Offset (X)',
    offsetY: 'Vertical Offset (Y)',
    rotateZ: 'Rotation Angle (Z)',
    shadowIntensity: 'Multi-layer 3D Shadow',
    glareEffect: 'Realistic Glass Glare Reflection',
    showStatusBar: 'Show iOS Status Bar',
    showDynamicIsland: 'Show Dynamic Island / Notch',
    applyDeviceToAll: 'Apply Device Settings to All Slides',

    // Background Tab
    bgPresets: 'Popular Theme Presets',
    bgType: 'Background Type',
    bgLinearGradient: 'Linear Gradient',
    bgMeshRadial: 'Radial Glow Mesh',
    bgSolid: 'Minimalist Solid',
    bgGlassmorphism: 'Glassmorphism Blur',
    bgCustomImage: 'Custom Image',
    startColor: 'Start Color',
    endColor: 'End Color',
    gradientAngle: 'Gradient Angle',
    glassBlur: 'Glass Blur Intensity',
    noiseTexture: 'Apple-style Noise Grain',
    darkOverlay: 'Vignette / Dark Overlay',
    uploadBgImage: 'Upload Custom Background',
    applyBgToAll: 'Apply Background to All Slides',

    // Upload Tab
    primaryScreenshot: 'Primary Screenshot',
    primaryScreenshotDesc: 'Drag & drop or click to upload iPhone screenshot',
    uploadPrimaryBtn: 'Upload Primary Screenshot',
    secondaryScreenshot: 'Secondary / Watch Screenshot',
    secondaryScreenshotDesc: 'For dual device stacking or Apple Watch ecosystem mode',
    uploadSecondaryBtn: 'Upload Secondary Screenshot',
    clearImage: 'Clear Custom Image',
    recommendedResolutionTitle: '💡 Recommended Aspect Ratios',
    usePresetSample: 'Reset to Sample Mockup',

    // Thumbnail Deck
    deckTitle: 'Screenshot Deck',
    deckHint: 'App Store recommends 3 ~ 10 screenshots',
    addSlide: 'Add Slide',
    moveLeft: 'Move Left',
    moveRight: 'Move Right',
    duplicateSlide: 'Duplicate',
    deleteSlide: 'Delete',

    // Export Modal
    exportModalTitle: 'Export App Store & Google Play Packages',
    exportModalDesc: 'High-res vector rendering engine producing pixel-perfect assets matching Apple & Google submission specs',
    tabUniversal: 'All Specifications',
    tabAppStore: 'App Store (iOS)',
    tabGooglePlay: 'Google Play (Android)',
    quickSelect: 'Quick Select:',
    selRequired: 'Required Specs',
    selAllPhones: 'All Phones',
    selAllWatches: 'All Watches',
    selAllTablets: 'All Tablets',
    selAll: 'Select All',
    exportFormat: 'File Format',
    selectedSpecsCount: 'Selected Specs',
    exportSingleCurrent: 'Download Current Slide',
    batchExportZip: 'Download ZIP Package (Batch Export)',
    renderingProgress: 'Rendering high-resolution assets and building ZIP...',
    exportSuccess: '🎉 Export complete! Download started automatically',
    exportFailed: 'Export failed, please try again',
    requiredBadge: 'Mandatory',
    recommendedBadge: 'Recommended',

    // AI Copy Assistant
    aiAssistantTitle: 'AI Copywriting & ASO Optimizer',
    aiAssistantDesc: 'Leverage Gemini AI to generate high-converting App Store headlines, value propositions, and localized copy',
    aiTabVariations: 'Slide Variations',
    aiTabFullDeck: 'Full Storyline Flow',
    aiTabLocalize: 'Localization',
    appNameLabel: 'App Name',
    appCategoryLabel: 'Category',
    appDescLabel: 'Value Proposition & Summary',
    toneLabel: 'Brand Tone of Voice',
    toneAppleMinimal: 'Apple Minimalist (Refined & Elegant)',
    toneBoldAction: 'Bold Action (High Conversion)',
    toneProblemSolution: 'Problem-Solution (Direct & Clear)',
    toneSocialProof: 'Social Proof & Trust',
    generateVariationsBtn: '✨ Generate Slide Variations',
    generateDeckBtn: '🚀 Generate Full Storyline Flow',
    localizeBtn: '🌐 Translate to EN / JA / KO',
    applyToCurrentSlide: 'Apply to Current Slide',
    applyDeckToAll: 'Apply Full Storyline Flow',
    copyText: 'Copy Text',
    copied: 'Copied!',
    generatingAI: 'AI is crafting high-conversion headlines...',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('appstore_studio_lang');
    if (saved === 'zh-TW' || saved === 'en') return saved;
    // Auto-detect browser language
    if (typeof navigator !== 'undefined' && navigator.language.startsWith('en')) {
      return 'en';
    }
    return 'zh-TW';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appstore_studio_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
