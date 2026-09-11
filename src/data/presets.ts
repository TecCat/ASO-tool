import {
  AppStoreSpec,
  AppPreset,
  BackgroundConfig,
  TextConfig,
  DeviceConfig,
  SlideItem,
  DeviceType,
  DeviceCategory,
  DeviceColor,
} from '../types';

export interface DeviceModelInfo {
  id: DeviceType;
  name: string;
  category: DeviceCategory;
  brand: 'apple' | 'samsung' | 'google' | 'android';
  screenSize: string;
  bezelStyle: 'dynamic-island' | 'notch' | 'punch-hole' | 'home-button' | 'tablet-bezel' | 'apple-watch';
  defaultColor: DeviceColor;
  supportedColors: DeviceColor[];
  aspectRatio: string;
  recommendedResolution: string;
  description: string;
}

export const DEVICE_MODELS: DeviceModelInfo[] = [
  // --- iPhone Models ---
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    category: 'iphone',
    brand: 'apple',
    screenSize: '6.9"',
    bezelStyle: 'dynamic-island',
    defaultColor: 'desert-titanium',
    supportedColors: ['desert-titanium', 'natural-titanium', 'black-titanium', 'white-titanium'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1290 x 2796',
    description: '超極窄鈦金屬邊框・動態島・旗艦 6.9 吋螢幕',
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    category: 'iphone',
    brand: 'apple',
    screenSize: '6.3"',
    bezelStyle: 'dynamic-island',
    defaultColor: 'natural-titanium',
    supportedColors: ['desert-titanium', 'natural-titanium', 'black-titanium', 'white-titanium'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1179 x 2556',
    description: '輕巧旗艦鈦金屬・動態島・6.3 吋',
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    category: 'iphone',
    brand: 'apple',
    screenSize: '6.7"',
    bezelStyle: 'dynamic-island',
    defaultColor: 'natural-titanium',
    supportedColors: ['natural-titanium', 'black-titanium', 'white-titanium', 'midnight-blue'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1290 x 2796',
    description: '經典鈦金屬・動態島・6.7 吋',
  },
  {
    id: 'iphone-16-base',
    name: 'iPhone 16 / 15',
    category: 'iphone',
    brand: 'apple',
    screenSize: '6.1"',
    bezelStyle: 'dynamic-island',
    defaultColor: 'midnight-blue',
    supportedColors: ['midnight-blue', 'white-titanium', 'black-titanium', 'rose-gold'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1179 x 2556',
    description: '鋁金屬精緻微弧・動態島・6.1 吋',
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    category: 'iphone',
    brand: 'apple',
    screenSize: '6.1"',
    bezelStyle: 'dynamic-island',
    defaultColor: 'black-titanium',
    supportedColors: ['black-titanium', 'gold', 'silver', 'space-gray'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1179 x 2556',
    description: '醫療級不鏽鋼光澤・首代動態島',
  },
  {
    id: 'iphone-13',
    name: 'iPhone 14 / 13 (瀏海款)',
    category: 'iphone',
    brand: 'apple',
    screenSize: '6.1"',
    bezelStyle: 'notch',
    defaultColor: 'midnight-blue',
    supportedColors: ['midnight-blue', 'space-gray', 'silver', 'rose-gold'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1170 x 2532',
    description: '經典頂部相機瀏海 (Classic Notch)',
  },
  {
    id: 'iphone-8-plus',
    name: 'iPhone 8 Plus / SE (Touch ID)',
    category: 'iphone',
    brand: 'apple',
    screenSize: '5.5"',
    bezelStyle: 'home-button',
    defaultColor: 'space-gray',
    supportedColors: ['space-gray', 'silver', 'gold', 'rose-gold'],
    aspectRatio: '16:9',
    recommendedResolution: '1242 x 2208',
    description: '經典 Home 鍵與上/下邊框 (App Store 5.5" 規格)',
  },

  // --- Apple Watch Models ---
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 (49mm)',
    category: 'apple-watch',
    brand: 'apple',
    screenSize: '49mm',
    bezelStyle: 'apple-watch',
    defaultColor: 'natural-titanium',
    supportedColors: ['natural-titanium', 'black-titanium', 'ultra-orange'],
    aspectRatio: '4:5',
    recommendedResolution: '820 x 1004 / 410 x 502',
    description: '49mm 航太鈦金屬・國際橙動作按鈕・數位錶冠護橋',
  },
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10 (46mm)',
    category: 'apple-watch',
    brand: 'apple',
    screenSize: '46mm',
    bezelStyle: 'apple-watch',
    defaultColor: 'jet-black',
    supportedColors: ['jet-black', 'silver', 'rose-gold', 'gold', 'natural-aluminum'],
    aspectRatio: '4:5',
    recommendedResolution: '832 x 992 / 416 x 496',
    description: '46mm 曜石黑鏡面拋光・超薄弧形 Wide-OLED 廣角螢幕',
  },
  {
    id: 'apple-watch-se',
    name: 'Apple Watch SE / S9 (44mm)',
    category: 'apple-watch',
    brand: 'apple',
    screenSize: '44mm',
    bezelStyle: 'apple-watch',
    defaultColor: 'midnight-blue',
    supportedColors: ['midnight-blue', 'silver', 'gold', 'space-gray'],
    aspectRatio: '4:5',
    recommendedResolution: '736 x 896 / 368 x 448',
    description: '44mm 經典圓潤外框・觸覺回饋數位錶冠',
  },

  // --- iPad Models ---
  {
    id: 'ipad-pro-13',
    name: 'iPad Pro 13" (M4 旗艦)',
    category: 'ipad',
    brand: 'apple',
    screenSize: '13"',
    bezelStyle: 'tablet-bezel',
    defaultColor: 'space-gray',
    supportedColors: ['space-gray', 'silver', 'black-titanium'],
    aspectRatio: '4:3',
    recommendedResolution: '2048 x 2732',
    description: '極致超薄對稱窄邊框・Liquid Retina XDR・13 吋',
  },
  {
    id: 'ipad-pro-11',
    name: 'iPad Air / Pro 11"',
    category: 'ipad',
    brand: 'apple',
    screenSize: '11"',
    bezelStyle: 'tablet-bezel',
    defaultColor: 'silver',
    supportedColors: ['space-gray', 'silver', 'rose-gold'],
    aspectRatio: '4.3:3',
    recommendedResolution: '1668 x 2388',
    description: '黃金手持尺寸・全面螢幕對稱邊框・11 吋',
  },
  {
    id: 'ipad-mini',
    name: 'iPad Mini (8.3")',
    category: 'ipad',
    brand: 'apple',
    screenSize: '8.3"',
    bezelStyle: 'tablet-bezel',
    defaultColor: 'space-gray',
    supportedColors: ['space-gray', 'silver', 'rose-gold', 'midnight-blue'],
    aspectRatio: '3:2',
    recommendedResolution: '1488 x 2266',
    description: '輕巧便攜小平板・8.3 吋全螢幕',
  },

  // --- Android Models ---
  {
    id: 'samsung-s25-ultra',
    name: 'Samsung Galaxy S25 / S24 Ultra',
    category: 'android-phone',
    brand: 'samsung',
    screenSize: '6.8"',
    bezelStyle: 'punch-hole',
    defaultColor: 'titanium-gray',
    supportedColors: ['titanium-gray', 'onyx-black', 'cobalt-violet', 'amber-yellow'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1440 x 3120 / 1080 x 2400',
    description: '指標性硬派方正微圓角・中置微型挖孔前鏡頭・極窄邊框',
  },
  {
    id: 'samsung-s24',
    name: 'Samsung Galaxy S24 / S25',
    category: 'android-phone',
    brand: 'samsung',
    screenSize: '6.2"',
    bezelStyle: 'punch-hole',
    defaultColor: 'cobalt-violet',
    supportedColors: ['cobalt-violet', 'onyx-black', 'amber-yellow', 'titanium-gray'],
    aspectRatio: '19.5:9',
    recommendedResolution: '1080 x 2340',
    description: '優雅四邊等寬微弧・中置單挖孔・極簡現代風',
  },
  {
    id: 'google-pixel-9-pro',
    name: 'Google Pixel 9 Pro / 9',
    category: 'android-phone',
    brand: 'google',
    screenSize: '6.7"',
    bezelStyle: 'punch-hole',
    defaultColor: 'obsidian-black',
    supportedColors: ['obsidian-black', 'porcelain-white', 'hazel-green', 'bay-blue'],
    aspectRatio: '20:9',
    recommendedResolution: '1080 x 2400 / 1280 x 2856',
    description: 'Google 原生圓潤風格・中置相機・Material 狀態列',
  },
  {
    id: 'google-pixel-fold',
    name: 'Google Pixel Fold / 折疊機',
    category: 'android-phone',
    brand: 'google',
    screenSize: '7.6"',
    bezelStyle: 'tablet-bezel',
    defaultColor: 'obsidian-black',
    supportedColors: ['obsidian-black', 'porcelain-white'],
    aspectRatio: '6:5',
    recommendedResolution: '1840 x 2208',
    description: '內螢幕大視界折疊屏・旗艦多工體驗',
  },
  {
    id: 'oneplus-13',
    name: 'Android 旗艦旗艦機 (OnePlus / 小米)',
    category: 'android-phone',
    brand: 'android',
    screenSize: '6.82"',
    bezelStyle: 'punch-hole',
    defaultColor: 'onyx-black',
    supportedColors: ['onyx-black', 'hazel-green', 'titanium-gray', 'silver'],
    aspectRatio: '19.8:9',
    recommendedResolution: '1080 x 2400',
    description: '現代主流旗艦 Android・高屏佔比挖孔螢幕',
  },
  {
    id: 'android-tablet-10',
    name: 'Android 10 吋旗艦平板 (Galaxy Tab / Pixel)',
    category: 'android-tablet',
    brand: 'android',
    screenSize: '10.5"',
    bezelStyle: 'tablet-bezel',
    defaultColor: 'titanium-gray',
    supportedColors: ['titanium-gray', 'obsidian-black', 'silver'],
    aspectRatio: '16:10',
    recommendedResolution: '1600 x 2560',
    description: 'Google Play 必備 10 吋平板規格・16:10 黃金比例',
  },
];

export const APP_STORE_SPECS: AppStoreSpec[] = [
  // ==================== iOS App Store Specs ====================
  {
    id: 'iphone-6.7-6.9',
    name: 'iPhone 6.9" / 6.7" (Super Retina XDR)',
    category: 'iPhone',
    store: 'app-store',
    width: 1290,
    height: 2796,
    aspectRatio: '9:19.5 (1:2.167)',
    recommendedDevice: 'iphone-16-pro-max',
    description: 'Apple App Store 核心必填規格 (iPhone 16 Pro Max, 15 Pro Max, 14 Pro Max)',
    required: true,
  },
  {
    id: 'iphone-6.1-6.3',
    name: 'iPhone 6.3" / 6.1" (Super Retina XDR)',
    category: 'iPhone',
    store: 'app-store',
    width: 1179,
    height: 2556,
    aspectRatio: '9:19.5 (1:2.167)',
    recommendedDevice: 'iphone-16-pro',
    description: 'Apple App Store 常用推薦規格 (iPhone 16 Pro, 15 Pro, 14 Pro)',
    required: false,
  },
  {
    id: 'iphone-6.5',
    name: 'iPhone 6.5" (Super Retina)',
    category: 'iPhone',
    store: 'app-store',
    width: 1242,
    height: 2688,
    aspectRatio: '9:19.5 (1:2.164)',
    recommendedDevice: 'iphone-14-pro',
    description: 'Apple App Store 規格 (iPhone 11 Pro Max, XS Max)',
    required: false,
  },
  {
    id: 'iphone-5.5',
    name: 'iPhone 5.5" (Retina Display)',
    category: 'iPhone',
    store: 'app-store',
    width: 1242,
    height: 2208,
    aspectRatio: '9:16 (1:1.777)',
    recommendedDevice: 'iphone-8-plus',
    description: 'Apple App Store 經典機型規格 (iPhone 8 Plus, 7 Plus, SE)',
    required: false,
  },
  {
    id: 'ipad-13',
    name: 'iPad Pro 13" / 12.9" (Liquid Retina XDR)',
    category: 'iPad',
    store: 'app-store',
    width: 2048,
    height: 2732,
    aspectRatio: '3:4 (1:1.334)',
    recommendedDevice: 'ipad-pro-13',
    description: 'iPad App Store 核心旗艦必填規格 (iPad Pro 13" M4, 12.9" 6th Gen)',
    required: true,
  },
  {
    id: 'ipad-11',
    name: 'iPad Air / Pro 11"',
    category: 'iPad',
    store: 'app-store',
    width: 1668,
    height: 2388,
    aspectRatio: '1:1.431',
    recommendedDevice: 'ipad-pro-11',
    description: 'iPad 11 吋推薦規格 (iPad Air 11", iPad Pro 11")',
    required: false,
  },
  {
    id: 'ipad-mini',
    name: 'iPad Mini 8.3"',
    category: 'iPad',
    store: 'app-store',
    width: 1488,
    height: 2266,
    aspectRatio: '1:1.522',
    recommendedDevice: 'ipad-mini',
    description: 'iPad Mini 輕巧規格 (iPad Mini 6/7 代)',
    required: false,
  },

  // ==================== Apple Watch (watchOS) App Store Specs ====================
  {
    id: 'apple-watch-ultra',
    name: 'Apple Watch Ultra 49mm (watchOS)',
    category: 'Apple Watch',
    store: 'app-store',
    width: 820,
    height: 1004,
    aspectRatio: '4:5 (1:1.224)',
    recommendedDevice: 'apple-watch-ultra-2',
    description: 'Apple Watch Ultra 旗艦規格 (410 x 502 pt @2x)',
    required: false,
  },
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10 46mm (watchOS)',
    category: 'Apple Watch',
    store: 'app-store',
    width: 832,
    height: 992,
    aspectRatio: '4:5 (1:1.192)',
    recommendedDevice: 'apple-watch-series-10',
    description: 'Apple Watch Series 10 大螢幕規格 (416 x 496 pt @2x)',
    required: false,
  },
  {
    id: 'apple-watch-45mm',
    name: 'Apple Watch 45mm (Series 7/8/9)',
    category: 'Apple Watch',
    store: 'app-store',
    width: 792,
    height: 968,
    aspectRatio: '4:5 (1:1.222)',
    recommendedDevice: 'apple-watch-series-10',
    description: 'Apple Watch 45mm 規格 (396 x 484 pt @2x)',
    required: false,
  },

  // ==================== Google Play Store Specs ====================
  {
    id: 'google-play-phone-fhd',
    name: 'Android 手機 (FHD+ 9:20 推薦)',
    category: 'Android Phone',
    store: 'google-play',
    width: 1080,
    height: 2400,
    aspectRatio: '9:20 (1:2.222)',
    recommendedDevice: 'google-pixel-9-pro',
    description: 'Google Play 核心必填手機規格 (Pixel 9 / 8 / 7, Galaxy S24/S25, Xiaomi)',
    required: true,
  },
  {
    id: 'google-play-phone-qhd',
    name: 'Android 手機 (QHD+ 旗艦解析度)',
    category: 'Android Phone',
    store: 'google-play',
    width: 1440,
    height: 3120,
    aspectRatio: '9:19.5 (1:2.167)',
    recommendedDevice: 'samsung-s25-ultra',
    description: 'Google Play 旗艦機高解析度 (Galaxy S25 Ultra, Pixel 9 Pro XL)',
    required: false,
  },
  {
    id: 'google-play-phone-standard',
    name: 'Android 手機 (標準 9:16 FHD)',
    category: 'Android Phone',
    store: 'google-play',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16 (1:1.777)',
    recommendedDevice: 'samsung-s24',
    description: 'Google Play 廣泛相容 16:9 規格 (1080 x 1920)',
    required: false,
  },
  {
    id: 'google-play-tablet-7',
    name: 'Android 7 吋平板電腦',
    category: 'Android Tablet',
    store: 'google-play',
    width: 1200,
    height: 1920,
    aspectRatio: '10:16 (1:1.6)',
    recommendedDevice: 'android-tablet-10',
    description: 'Google Play 7 吋平板專用截圖 (若支援平板則為必填)',
    required: false,
  },
  {
    id: 'google-play-tablet-10',
    name: 'Android 10 吋旗艦平板電腦',
    category: 'Android Tablet',
    store: 'google-play',
    width: 1600,
    height: 2560,
    aspectRatio: '10:16 (1:1.6)',
    recommendedDevice: 'android-tablet-10',
    description: 'Google Play 10 吋平板必要規格 (Galaxy Tab S9/S10, Pixel Tablet)',
    required: true,
  },
  {
    id: 'google-play-feature-graphic',
    name: 'Google Play 主打宣傳圖 (Feature Graphic)',
    category: 'Store Graphic',
    store: 'google-play',
    width: 1024,
    height: 500,
    aspectRatio: '1024:500 (橫向橫幅)',
    recommendedDevice: 'samsung-s25-ultra',
    description: 'Google Play 商店必備主打推薦橫幅 (必填，1024 x 500 JPG/PNG)',
    required: true,
  },
  {
    id: 'google-play-app-icon',
    name: '高解析度 App 應用程式圖示 (Icon)',
    category: 'Store Graphic',
    store: 'universal',
    width: 512,
    height: 512,
    aspectRatio: '1:1 (正方形)',
    recommendedDevice: 'iphone-16-pro-max',
    description: 'Google Play & App Store 標準應用圖示 (512 x 512 PNG, 32-bit)',
    required: false,
  },
];

// Helper to generate realistic high-res SVG mockup screens as base64 data URLs
export function generateSampleMockupSvg(
  theme: 'finance' | 'fitness' | 'ai' | 'ecommerce' | 'meditation',
  screenNum: number
): string {
  const width = 450;
  const height = 975;

  let bgGradient = '<stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/>';
  let cardColor = '#1e293b';
  let accentColor = '#38bdf8';
  let accentColor2 = '#818cf8';
  let title = '總資產概況';
  let value = '$128,450.00';
  let change = '+14.8% 本月';
  let itemsSvg = '';

  if (theme === 'finance') {
    if (screenNum === 1) {
      bgGradient = '<stop offset="0%" stop-color="#091815"/><stop offset="100%" stop-color="#020617"/>';
      cardColor = '#0f2922';
      accentColor = '#10b981';
      accentColor2 = '#06b6d4';
      title = '總資產淨值';
      value = '$248,930.50';
      change = '+22.4% 投資報酬';
      itemsSvg = `
        <rect x="25" y="320" width="400" height="90" rx="18" fill="#132f27" />
        <circle cx="65" cy="365" r="22" fill="#10b981" fill-opacity="0.2" />
        <text x="65" y="372" text-anchor="middle" font-size="20" fill="#10b981">✦</text>
        <text x="100" y="358" font-size="16" font-weight="bold" fill="#ffffff" font-family="sans-serif">科技成長 ETF 組合</text>
        <text x="100" y="382" font-size="13" fill="#94a3b8" font-family="sans-serif">已自動定期定額</text>
        <text x="405" y="358" text-anchor="end" font-size="16" font-weight="bold" fill="#10b981" font-family="sans-serif">+$32,450</text>
        <text x="405" y="382" text-anchor="end" font-size="12" fill="#6ee7b7" font-family="sans-serif">+34.8%</text>

        <rect x="25" y="425" width="400" height="90" rx="18" fill="#132f27" />
        <circle cx="65" cy="470" r="22" fill="#06b6d4" fill-opacity="0.2" />
        <text x="65" y="477" text-anchor="middle" font-size="20" fill="#06b6d4">⬡</text>
        <text x="100" y="463" font-size="16" font-weight="bold" fill="#ffffff" font-family="sans-serif">高息被動現金流</text>
        <text x="100" y="487" font-size="13" fill="#94a3b8" font-family="sans-serif">每月 15 號配息入帳</text>
        <text x="405" y="463" text-anchor="end" font-size="16" font-weight="bold" fill="#ffffff" font-family="sans-serif">$112,000</text>
        <text x="405" y="487" text-anchor="end" font-size="12" fill="#34d399" font-family="sans-serif">+8.2% 殖利率</text>

        <rect x="25" y="530" width="400" height="150" rx="20" fill="#0d231e" stroke="#10b981" stroke-opacity="0.3" stroke-width="1.5" />
        <text x="45" y="565" font-size="16" font-weight="bold" fill="#ffffff" font-family="sans-serif">智慧資產再平衡</text>
        <text x="45" y="590" font-size="13" fill="#94a3b8" font-family="sans-serif">AI 自動監控偏離風險，建議低檔補進</text>
        <rect x="45" y="615" width="360" height="42" rx="12" fill="#10b981" />
        <text x="225" y="641" text-anchor="middle" font-size="14" font-weight="bold" fill="#022c22" font-family="sans-serif">立即一鍵執行優化</text>
      `;
    } else if (screenNum === 2) {
      bgGradient = '<stop offset="0%" stop-color="#0c1a2e"/><stop offset="100%" stop-color="#020617"/>';
      cardColor = '#132847';
      accentColor = '#3b82f6';
      accentColor2 = '#60a5fa';
      title = '多帳戶即時同步';
      value = '3 家銀行已連結';
      change = '256-bit 銀行級加密保護';
      itemsSvg = `
        <rect x="25" y="320" width="400" height="240" rx="22" fill="#10233e" stroke="#3b82f6" stroke-opacity="0.2" />
        <text x="45" y="360" font-size="17" font-weight="bold" fill="#ffffff" font-family="sans-serif">各幣別即時餘額</text>
        <rect x="45" y="380" width="360" height="45" rx="10" fill="#1e3a8a" fill-opacity="0.3" />
        <text x="65" y="408" font-size="14" fill="#ffffff" font-family="sans-serif">USD 美元存款</text>
        <text x="385" y="408" text-anchor="end" font-size="14" font-weight="bold" fill="#60a5fa" font-family="sans-serif">$38,500.00</text>
        <rect x="45" y="435" width="360" height="45" rx="10" fill="#1e3a8a" fill-opacity="0.3" />
        <text x="65" y="463" font-size="14" fill="#ffffff" font-family="sans-serif">TWD 台幣活儲</text>
        <text x="385" y="463" text-anchor="end" font-size="14" font-weight="bold" fill="#60a5fa" font-family="sans-serif">NT$ 1,280,000</text>
        <rect x="45" y="490" width="360" height="45" rx="10" fill="#1e3a8a" fill-opacity="0.3" />
        <text x="65" y="518" font-size="14" fill="#ffffff" font-family="sans-serif">JPY 日圓換匯</text>
        <text x="385" y="518" text-anchor="end" font-size="14" font-weight="bold" fill="#60a5fa" font-family="sans-serif">¥ 850,000</text>
      `;
    } else {
      bgGradient = '<stop offset="0%" stop-color="#140f2d"/><stop offset="100%" stop-color="#020617"/>';
      cardColor = '#1f1647';
      accentColor = '#8b5cf6';
      accentColor2 = '#c084fc';
      title = 'AI 財務分析報表';
      value = '98.4 分';
      change = '財務健康指標優良';
      itemsSvg = `
        <rect x="25" y="320" width="400" height="180" rx="20" fill="#1c1340" />
        <path d="M 45 440 Q 140 370 225 410 T 405 350" fill="none" stroke="#c084fc" stroke-width="4" stroke-linecap="round" />
        <circle cx="405" cy="350" r="6" fill="#ffffff" stroke="#8b5cf6" stroke-width="3" />
        <text x="45" y="360" font-size="16" font-weight="bold" fill="#ffffff" font-family="sans-serif">未來 10 年資產滾動預測</text>
        <text x="45" y="480" font-size="12" fill="#a78bfa" font-family="sans-serif">年化複合報酬率 9.2% (複利效應)</text>
      `;
    }
  } else if (theme === 'fitness') {
    bgGradient = '<stop offset="0%" stop-color="#2a0d18"/><stop offset="100%" stop-color="#080205"/>';
    cardColor = '#3f1524';
    accentColor = '#f43f5e';
    accentColor2 = '#fb7185';
    title = screenNum === 1 ? '今日活動圓圈' : '個人訓練專屬計畫';
    value = screenNum === 1 ? '780 / 600 kcal' : '第 14 天 連續達成';
    change = '🔥 超越昨日 125%';
    itemsSvg = `
      <rect x="25" y="320" width="400" height="180" rx="22" fill="#2d0f1c" stroke="#f43f5e" stroke-opacity="0.3" />
      <circle cx="120" cy="410" r="45" fill="none" stroke="#4c1d30" stroke-width="12" />
      <circle cx="120" cy="410" r="45" fill="none" stroke="#f43f5e" stroke-width="12" stroke-dasharray="280" stroke-dashoffset="60" stroke-linecap="round" />
      <text x="120" y="416" text-anchor="middle" font-size="18" font-weight="bold" fill="#ffffff" font-family="sans-serif">130%</text>
      <text x="195" y="380" font-size="17" font-weight="bold" fill="#ffffff" font-family="sans-serif">燃燒動態卡路里</text>
      <text x="195" y="405" font-size="14" fill="#fb7185" font-family="sans-serif">780 / 600 kcal</text>
      <text x="195" y="435" font-size="17" font-weight="bold" fill="#ffffff" font-family="sans-serif">運動鍛鍊時間</text>
      <text x="195" y="460" font-size="14" fill="#34d399" font-family="sans-serif">45 / 30 分鐘</text>
      <rect x="25" y="520" width="400" height="90" rx="18" fill="#240c17" />
      <text x="45" y="555" font-size="16" font-weight="bold" fill="#ffffff" font-family="sans-serif">心率即時監測 (Zone 4)</text>
      <text x="45" y="580" font-size="13" fill="#fda4af" font-family="sans-serif">目前 148 bpm (最佳燃脂區間)</text>
    `;
  } else if (theme === 'ai') {
    bgGradient = '<stop offset="0%" stop-color="#110d29"/><stop offset="100%" stop-color="#030208"/>';
    cardColor = '#1e1642';
    accentColor = '#6366f1';
    accentColor2 = '#a855f7';
    title = 'AI 智慧助理對話';
    value = 'Gemini 3.7 Turbo';
    change = '⚡ 極速 0.1s 反應時間';
    itemsSvg = `
      <rect x="25" y="310" width="330" height="65" rx="18" fill="#2d225e" />
      <text x="45" y="340" font-size="14" fill="#e0e7ff" font-family="sans-serif">幫我用 3 個重點總結這份 50 頁商業合約</text>
      <text x="45" y="360" font-size="11" fill="#818cf8" font-family="sans-serif">9:41 AM</text>

      <rect x="65" y="390" width="360" height="150" rx="20" fill="#1b133b" stroke="#6366f1" stroke-opacity="0.4" />
      <text x="85" y="425" font-size="14" font-weight="bold" fill="#a5b4fc" font-family="sans-serif">✨ AI 已完成合約重點摘要：</text>
      <text x="85" y="452" font-size="13" fill="#ffffff" font-family="sans-serif">1. 終止條款需提前 30 天書面通知</text>
      <text x="85" y="478" font-size="13" fill="#ffffff" font-family="sans-serif">2. 智慧財產權 100% 歸屬買方</text>
      <text x="85" y="504" font-size="13" fill="#ffffff" font-family="sans-serif">3. 免責額度上限為總合約金額 1.5 倍</text>

      <rect x="25" y="560" width="400" height="55" rx="28" fill="#130c2c" stroke="#4f46e5" stroke-opacity="0.5" />
      <text x="55" y="594" font-size="14" fill="#6366f1" font-family="sans-serif">輸入訊息或用語音提問...</text>
      <circle cx="395" cy="587" r="16" fill="#6366f1" />
      <text x="395" y="592" text-anchor="middle" font-size="14" fill="#ffffff">↑</text>
    `;
  } else if (theme === 'ecommerce') {
    bgGradient = '<stop offset="0%" stop-color="#1f150e"/><stop offset="100%" stop-color="#080503"/>';
    cardColor = '#332115';
    accentColor = '#f59e0b';
    accentColor2 = '#fbbf24';
    title = '極簡設計選品';
    value = '最新 2026 春季系列';
    change = '★ 4.9 (12,400+ 滿意好評)';
    itemsSvg = `
      <rect x="25" y="320" width="190" height="240" rx="20" fill="#2d1b10" />
      <rect x="40" y="335" width="160" height="130" rx="14" fill="#452a1a" />
      <text x="120" y="405" text-anchor="middle" font-size="36">🎧</text>
      <text x="40" y="490" font-size="14" font-weight="bold" fill="#ffffff" font-family="sans-serif">無線抗噪耳機 Pro</text>
      <text x="40" y="515" font-size="13" fill="#f59e0b" font-family="sans-serif">NT$ 7,990</text>
      <text x="40" y="540" font-size="11" fill="#a8a29e" font-family="sans-serif">現貨當日秒發</text>

      <rect x="235" y="320" width="190" height="240" rx="20" fill="#2d1b10" />
      <rect x="250" y="335" width="160" height="130" rx="14" fill="#452a1a" />
      <text x="330" y="405" text-anchor="middle" font-size="36">⌚</text>
      <text x="250" y="490" font-size="14" font-weight="bold" fill="#ffffff" font-family="sans-serif">極簡鈦金屬智慧錶</text>
      <text x="250" y="515" font-size="13" fill="#f59e0b" font-family="sans-serif">NT$ 12,500</text>
      <text x="250" y="540" font-size="11" fill="#a8a29e" font-family="sans-serif">限時免運費</text>
    `;
  } else {
    // Meditation
    bgGradient = '<stop offset="0%" stop-color="#0a1526"/><stop offset="100%" stop-color="#020813"/>';
    cardColor = '#12233f';
    accentColor = '#38bdf8';
    accentColor2 = '#a78bfa';
    title = '每日正念與深層睡眠';
    value = '15 分鐘 舒緩冥想';
    change = '🌙 助眠白噪音與引導式呼吸';
    itemsSvg = `
      <rect x="25" y="320" width="400" height="200" rx="22" fill="#0f203a" stroke="#38bdf8" stroke-opacity="0.3" />
      <circle cx="225" cy="400" r="48" fill="#38bdf8" fill-opacity="0.15" />
      <circle cx="225" cy="400" r="32" fill="#38bdf8" fill-opacity="0.3" />
      <text x="225" y="408" text-anchor="middle" font-size="24" fill="#ffffff">▶</text>
      <text x="225" y="475" text-anchor="middle" font-size="16" font-weight="bold" fill="#ffffff" font-family="sans-serif">雨夜森林・深度放鬆</text>
      <text x="225" y="500" text-anchor="middle" font-size="13" fill="#93c5fd" font-family="sans-serif">已引導超過 500,000+ 次安穩入眠</text>
    `;
  }

  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      ${bgGradient}
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cardColor}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${cardColor}" stop-opacity="0.5"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Top App Navigation / Header -->
  <circle cx="45" cy="80" r="18" fill="#ffffff" fill-opacity="0.1" />
  <text x="45" y="86" text-anchor="middle" font-size="14" fill="#ffffff" font-family="sans-serif">≡</text>
  <circle cx="405" cy="80" r="18" fill="${accentColor}" fill-opacity="0.2" />
  <text x="405" y="86" text-anchor="middle" font-size="14" fill="${accentColor}" font-family="sans-serif">🔔</text>

  <!-- Hero Card -->
  <rect x="25" y="125" width="400" height="175" rx="24" fill="url(#cardGrad)" stroke="${accentColor}" stroke-opacity="0.3" stroke-width="1.5" />
  <text x="50" y="165" font-size="14" fill="#94a3b8" font-family="sans-serif">${title}</text>
  <text x="50" y="215" font-size="32" font-weight="900" fill="#ffffff" font-family="sans-serif">${value}</text>
  <rect x="50" y="240" width="180" height="28" rx="8" fill="${accentColor}" fill-opacity="0.15" />
  <text x="60" y="259" font-size="13" font-weight="bold" fill="${accentColor}" font-family="sans-serif">${change}</text>

  <!-- Specific list / interactive items -->
  ${itemsSvg}

  <!-- Bottom Navigation Bar -->
  <rect x="0" y="890" width="${width}" height="85" fill="#020617" fill-opacity="0.95" />
  <line x1="0" y1="890" x2="${width}" y2="890" stroke="#1e293b" stroke-width="1" />
  
  <text x="65" y="930" text-anchor="middle" font-size="20" fill="${accentColor}">❖</text>
  <text x="65" y="950" text-anchor="middle" font-size="11" font-weight="bold" fill="${accentColor}" font-family="sans-serif">總覽</text>

  <text x="170" y="930" text-anchor="middle" font-size="20" fill="#64748b">📊</text>
  <text x="170" y="950" text-anchor="middle" font-size="11" fill="#64748b" font-family="sans-serif">分析</text>

  <text x="280" y="930" text-anchor="middle" font-size="20" fill="#64748b">⚡</text>
  <text x="280" y="950" text-anchor="middle" font-size="11" fill="#64748b" font-family="sans-serif">探索</text>

  <text x="385" y="930" text-anchor="middle" font-size="20" fill="#64748b">⚙</text>
  <text x="385" y="950" text-anchor="middle" font-size="11" fill="#64748b" font-family="sans-serif">設定</text>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// Built-in Gradient Palettes
export const GRADIENT_PRESETS = [
  {
    id: 'deep-indigo-neon',
    name: '極致深邃・霓虹紫',
    color1: '#090a1a',
    color2: '#2e1065',
    color3: '#4338ca',
    angle: 145,
    blurOrbs: true,
    orbColor1: '#818cf8',
    orbColor2: '#c084fc',
  },
  {
    id: 'emerald-luxury',
    name: '翡翠黑金・高階商務',
    color1: '#02120e',
    color2: '#064e3b',
    color3: '#059669',
    angle: 160,
    blurOrbs: true,
    orbColor1: '#34d399',
    orbColor2: '#10b981',
  },
  {
    id: 'cyber-sunset',
    name: '晨曦暮光・動態活力',
    color1: '#180816',
    color2: '#701a75',
    color3: '#be185d',
    angle: 135,
    blurOrbs: true,
    orbColor1: '#f43f5e',
    orbColor2: '#fb923c',
  },
  {
    id: 'apple-pure-slate',
    name: 'Apple 質感・岩石冷灰',
    color1: '#090d16',
    color2: '#1e293b',
    color3: '#0f172a',
    angle: 180,
    blurOrbs: true,
    orbColor1: '#38bdf8',
    orbColor2: '#64748b',
  },
  {
    id: 'warm-sand-light',
    name: '晨光極簡・暖柔白金',
    color1: '#f8fafc',
    color2: '#f1f5f9',
    color3: '#e2e8f0',
    angle: 180,
    blurOrbs: false,
  },
  {
    id: 'hyper-blue-glow',
    name: '科技未來・天際深藍',
    color1: '#020617',
    color2: '#172554',
    color3: '#1d4ed8',
    angle: 150,
    blurOrbs: true,
    orbColor1: '#60a5fa',
    orbColor2: '#38bdf8',
  },
];

// Initial Complete Showcase Presets
export const SAMPLE_PRESETS: AppPreset[] = [
  {
    id: 'finance-pro',
    title: 'WealthWise 理財投資',
    category: 'Finance',
    description: '專為高淨值個人與小資族打造的全方位資產管理與自動投資 App',
    themeColor: '#10b981',
    icon: 'TrendingUp',
    slides: [
      {
        id: 'fin-1',
        name: 'Slide 1: Hero Hook',
        screenshotUrl: generateSampleMockupSvg('finance', 1),
        layout: 'text-top-phone-bottom',
        bgConfig: {
          type: 'gradient',
          gradientPreset: 'emerald-luxury',
          color1: '#02120e',
          color2: '#064e3b',
          color3: '#059669',
          angle: 160,
          noiseOverlay: true,
          blurOrbs: true,
          orbColor1: '#34d399',
          orbColor2: '#10b981',
        },
        textConfig: {
          fontFamily: 'Plus Jakarta Sans',
          showBadge: true,
          badgeText: '★ 4.9 萬人一致推薦',
          badgeBgColor: '#10b981',
          badgeTextColor: '#022c22',
          headlineText: '全資產即時掌握\n讓每一分錢為你工作',
          headlineSize: 48,
          headlineWeight: 'black',
          headlineColor: '#ffffff',
          headlineAlign: 'center',
          headlineLetterSpacing: -0.5,
          showSubtitle: true,
          subtitleText: 'AI 智慧自動定期定額，年化複合報酬一目了然',
          subtitleSize: 19,
          subtitleWeight: 'medium',
          subtitleColor: '#a7f3d0',
          subtitleOpacity: 0.95,
          showRatingStars: true,
          ratingValue: 5,
          ratingCountText: '超過 120,000+ 投資人見證',
        },
        deviceConfig: {
          deviceType: 'iphone-16-pro-max',
          deviceColor: 'desert-titanium',
          showDynamicIsland: true,
          showStatusBar: true,
          statusBarTheme: 'light',
          statusTime: '9:41',
          batteryLevel: 100,
          scale: 1.0,
          offsetX: 0,
          offsetY: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          shadowIntensity: 85,
          glareEffect: true,
          borderWidth: 8,
        },
        asoScore: 98,
      },
      {
        id: 'fin-2',
        name: 'Slide 2: Multi-Bank Sync',
        screenshotUrl: generateSampleMockupSvg('finance', 2),
        layout: 'tilted-3d-left',
        bgConfig: {
          type: 'gradient',
          gradientPreset: 'hyper-blue-glow',
          color1: '#020617',
          color2: '#172554',
          color3: '#1d4ed8',
          angle: 150,
          noiseOverlay: true,
          blurOrbs: true,
          orbColor1: '#60a5fa',
          orbColor2: '#38bdf8',
        },
        textConfig: {
          fontFamily: 'Plus Jakarta Sans',
          showBadge: true,
          badgeText: 'BANK-GRADE ENCRYPTED',
          badgeBgColor: '#3b82f6',
          badgeTextColor: '#ffffff',
          headlineText: '多帳戶秒級同步\n告別手動繁瑣記帳',
          headlineSize: 48,
          headlineWeight: 'black',
          headlineColor: '#ffffff',
          headlineAlign: 'center',
          headlineLetterSpacing: -0.5,
          showSubtitle: true,
          subtitleText: '支援台灣與海外 30+ 家主流銀行與券商自動整合',
          subtitleSize: 19,
          subtitleWeight: 'normal',
          subtitleColor: '#bfdbfe',
          subtitleOpacity: 0.9,
          showRatingStars: false,
          ratingValue: 5,
        },
        deviceConfig: {
          deviceType: 'iphone-16-pro-max',
          deviceColor: 'natural-titanium',
          showDynamicIsland: true,
          showStatusBar: true,
          statusBarTheme: 'light',
          statusTime: '9:41',
          batteryLevel: 100,
          scale: 1.0,
          offsetX: 0,
          offsetY: 0,
          rotateZ: -4,
          rotateY: 14,
          rotateX: 6,
          shadowIntensity: 90,
          glareEffect: true,
          borderWidth: 8,
        },
        asoScore: 95,
      },
      {
        id: 'fin-3',
        name: 'Slide 3: AI Predictive Insights',
        screenshotUrl: generateSampleMockupSvg('finance', 3),
        layout: 'text-top-phone-bottom',
        bgConfig: {
          type: 'gradient',
          gradientPreset: 'deep-indigo-neon',
          color1: '#090a1a',
          color2: '#2e1065',
          color3: '#4338ca',
          angle: 145,
          noiseOverlay: true,
          blurOrbs: true,
          orbColor1: '#818cf8',
          orbColor2: '#c084fc',
        },
        textConfig: {
          fontFamily: 'Plus Jakarta Sans',
          showBadge: true,
          badgeText: 'AI POWERED PREDICTIONS',
          badgeBgColor: '#8b5cf6',
          badgeTextColor: '#ffffff',
          headlineText: 'AI 智慧回測預測\n提早 10 年達到財富自由',
          headlineSize: 48,
          headlineWeight: 'black',
          headlineColor: '#ffffff',
          headlineAlign: 'center',
          headlineLetterSpacing: -0.5,
          showSubtitle: true,
          subtitleText: '客製化複利模擬器，即時調整資產配置策略',
          subtitleSize: 19,
          subtitleWeight: 'normal',
          subtitleColor: '#e9d5ff',
          subtitleOpacity: 0.95,
          showRatingStars: false,
          ratingValue: 5,
        },
        deviceConfig: {
          deviceType: 'iphone-16-pro-max',
          deviceColor: 'black-titanium',
          showDynamicIsland: true,
          showStatusBar: true,
          statusBarTheme: 'light',
          statusTime: '9:41',
          batteryLevel: 100,
          scale: 1.0,
          offsetX: 0,
          offsetY: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          shadowIntensity: 85,
          glareEffect: true,
          borderWidth: 8,
        },
        asoScore: 96,
      },
    ],
  },
  {
    id: 'ai-assistant-pro',
    title: 'Nova AI 智慧助理',
    category: 'Productivity & AI',
    description: '整合全球頂尖大語言模型的終極個人與商務生產力引擎',
    themeColor: '#6366f1',
    icon: 'Sparkles',
    slides: [
      {
        id: 'ai-1',
        name: 'Slide 1: AI Chat Hero',
        screenshotUrl: generateSampleMockupSvg('ai', 1),
        layout: 'text-top-phone-bottom',
        bgConfig: {
          type: 'gradient',
          gradientPreset: 'deep-indigo-neon',
          color1: '#090a1a',
          color2: '#2e1065',
          color3: '#4338ca',
          angle: 145,
          noiseOverlay: true,
          blurOrbs: true,
          orbColor1: '#818cf8',
          orbColor2: '#c084fc',
        },
        textConfig: {
          fontFamily: 'Outfit',
          showBadge: true,
          badgeText: '✨ NEXT-GEN AI MODEL',
          badgeBgColor: '#6366f1',
          badgeTextColor: '#ffffff',
          headlineText: '秒讀萬字長文\n工作效率提升 10 倍',
          headlineSize: 48,
          headlineWeight: 'black',
          headlineColor: '#ffffff',
          headlineAlign: 'center',
          headlineLetterSpacing: -0.5,
          showSubtitle: true,
          subtitleText: '合約摘要、程式碼除錯、商業文案一鍵自動生成',
          subtitleSize: 19,
          subtitleWeight: 'medium',
          subtitleColor: '#c7d2fe',
          subtitleOpacity: 0.95,
          showRatingStars: true,
          ratingValue: 5,
          ratingCountText: 'App of the Day 首頁推薦',
        },
        deviceConfig: {
          deviceType: 'iphone-16-pro-max',
          deviceColor: 'black-titanium',
          showDynamicIsland: true,
          showStatusBar: true,
          statusBarTheme: 'light',
          statusTime: '9:41',
          batteryLevel: 100,
          scale: 1.0,
          offsetX: 0,
          offsetY: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          shadowIntensity: 85,
          glareEffect: true,
          borderWidth: 8,
        },
        asoScore: 99,
      },
    ],
  },
  {
    id: 'fitness-pulse',
    title: 'PulseFit 運動心率追蹤',
    category: 'Health & Fitness',
    description: '科學化心率區間訓練、個人化飲食熱量與動態燃脂追蹤',
    themeColor: '#f43f5e',
    icon: 'Activity',
    slides: [
      {
        id: 'fit-1',
        name: 'Slide 1: Fitness Hero',
        screenshotUrl: generateSampleMockupSvg('fitness', 1),
        layout: 'text-top-phone-bottom',
        bgConfig: {
          type: 'gradient',
          gradientPreset: 'cyber-sunset',
          color1: '#180816',
          color2: '#701a75',
          color3: '#be185d',
          angle: 135,
          noiseOverlay: true,
          blurOrbs: true,
          orbColor1: '#f43f5e',
          orbColor2: '#fb923c',
        },
        textConfig: {
          fontFamily: 'Outfit',
          showBadge: true,
          badgeText: '🔥 燃脂效率提升 200%',
          badgeBgColor: '#f43f5e',
          badgeTextColor: '#ffffff',
          headlineText: '精準掌握心率區間\n每一次鍛鍊都有效',
          headlineSize: 48,
          headlineWeight: 'black',
          headlineColor: '#ffffff',
          headlineAlign: 'center',
          headlineLetterSpacing: -0.5,
          showSubtitle: true,
          subtitleText: '結合 Apple Watch 即時回饋，達成每週運動目標',
          subtitleSize: 19,
          subtitleWeight: 'medium',
          subtitleColor: '#fbcfe8',
          subtitleOpacity: 0.95,
          showRatingStars: true,
          ratingValue: 5,
          ratingCountText: '超過 50 萬跑者口碑力挺',
        },
        deviceConfig: {
          deviceType: 'iphone-16-pro-max',
          deviceColor: 'natural-titanium',
          showDynamicIsland: true,
          showStatusBar: true,
          statusBarTheme: 'light',
          statusTime: '9:41',
          batteryLevel: 100,
          scale: 1.0,
          offsetX: 0,
          offsetY: 0,
          rotateZ: 0,
          rotateY: 0,
          rotateX: 0,
          shadowIntensity: 85,
          glareEffect: true,
          borderWidth: 8,
        },
        asoScore: 97,
      },
    ],
  },
];
