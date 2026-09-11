export type DeviceType =
  // iPhone Models
  | 'iphone-16-pro-max' // 6.9" Ultra-thin Titanium, Dynamic Island
  | 'iphone-16-pro'     // 6.3" Ultra-thin Titanium, Dynamic Island
  | 'iphone-15-pro-max' // 6.7" Titanium, Dynamic Island
  | 'iphone-16-base'    // 6.1" Modern Aluminum, Dynamic Island
  | 'iphone-14-pro'     // 6.1" Stainless Steel, Dynamic Island
  | 'iphone-13'         // 6.1" Aluminum, Classic Notch
  | 'iphone-8-plus'     // 5.5" Classic Touch ID Home Button

  // Apple Watch Models
  | 'apple-watch-ultra-2'  // 49mm Titanium, Action Button, Sapphire Glass
  | 'apple-watch-series-10'// 46mm Jet Black / Silver, Wide-angle OLED
  | 'apple-watch-se'       // 44mm Aluminum Classic Retina

  // iPad Models
  | 'ipad-pro-13'       // 13" M4 Ultra-thin symmetric bezels
  | 'ipad-pro-11'       // 11" Liquid Retina
  | 'ipad-mini'         // 8.3" Compact Bezel

  // Android Models
  | 'samsung-s25-ultra' // 6.8" Sharp Titanium Corners, Center Punch Hole
  | 'samsung-s24'       // 6.2" Curved Corners, Center Punch Hole
  | 'google-pixel-9-pro'// 6.7" Distinctive Contour, Center Punch Hole, Material Bar
  | 'google-pixel-fold' // 7.6" Inner Widescreen Foldable
  | 'oneplus-13'        // 6.82" Modern Flagship Android
  | 'android-tablet-10';// 10.5" Android Tablet (Play Store Tablet Spec)

export type DeviceCategory = 'iphone' | 'ipad' | 'apple-watch' | 'android-phone' | 'android-tablet';

export type DeviceColor =
  // Titanium (Apple & Samsung & Watch Ultra)
  | 'desert-titanium'
  | 'natural-titanium'
  | 'black-titanium'
  | 'white-titanium'
  | 'titanium-gray'
  | 'ultra-orange'
  | 'jet-black'
  | 'natural-aluminum'
  // Android Specific Colors
  | 'onyx-black'
  | 'cobalt-violet'
  | 'amber-yellow'
  | 'hazel-green'
  | 'porcelain-white'
  | 'obsidian-black'
  | 'bay-blue'
  // Apple Classic Colors
  | 'midnight-blue'
  | 'space-gray'
  | 'silver'
  | 'gold'
  | 'rose-gold';

export type ExportFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

export type TargetStore = 'app-store' | 'google-play' | 'universal' | 'ios' | 'android' | 'both';

export type LayoutTemplate =
  | 'text-top-phone-bottom'   // Headline top, phone bottom
  | 'phone-top-text-bottom'   // Phone top, headline bottom
  | 'phone-with-watch'        // iPhone + Apple Watch dual-device companion layout
  | 'watch-focus'             // Apple Watch centered hero focus
  | 'watch-top-text-bottom'   // Apple Watch top, text bottom
  | 'centered-floating'       // Device centered with badge
  | 'tilted-3d-left'          // 3D perspective left tilt
  | 'tilted-3d-right'         // 3D perspective right tilt
  | 'dual-devices'            // Two overlapping devices
  | 'full-bleed-zoom'         // Zoomed in hero detail
  | 'frameless-floating';     // Clean card without phone bezels

export type BackgroundType =
  | 'gradient'
  | 'mesh'
  | 'solid'
  | 'image'
  | 'pattern';

export type FontFamily =
  | 'Plus Jakarta Sans'
  | 'Noto Sans TC'
  | 'Outfit'
  | 'Playfair Display'
  | 'System'
  | 'SF Pro'
  | 'Monospace';

export interface BackgroundConfig {
  type: BackgroundType;
  gradientPreset?: string;
  color1: string;
  color2: string;
  color3?: string;
  angle: number; // in degrees
  noiseOverlay: boolean;
  blurOrbs: boolean;
  orbColor1?: string;
  orbColor2?: string;
  imageUrl?: string;
  imageBlur?: number;
  imageOpacity?: number;
  imageDarkOverlay?: number; // 0 to 90%
  imageScale?: number;       // 1.0 to 2.0
  imageFit?: 'cover' | 'contain' | 'fill';
}

export interface TextConfig {
  fontFamily: FontFamily;
  // Badge
  showBadge: boolean;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  badgeIcon?: string;
  
  // Headline
  headlineText: string;
  headlineSize: number; // scale relative to slide
  headlineWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  headlineColor: string;
  headlineGradient?: boolean;
  headlineGradientColors?: [string, string];
  headlineAlign: 'left' | 'center' | 'right';
  headlineLetterSpacing: number; // -1 to 5
  
  // Subtitle
  showSubtitle: boolean;
  subtitleText: string;
  subtitleSize: number;
  subtitleWeight: 'normal' | 'medium' | 'semibold';
  subtitleColor: string;
  subtitleOpacity: number;
  
  // Additional elements
  showRatingStars: boolean;
  ratingValue: number;
  ratingCountText?: string;
  showAppIconPill?: boolean;
  appIconUrl?: string;
  appCategoryPill?: string;

  // Safe zone & Auto-Fix positioning
  safeZoneOffset?: boolean;
  textOffsetY?: number;
}

export interface DeviceConfig {
  deviceType: DeviceType;
  deviceColor: DeviceColor;
  showDynamicIsland: boolean;
  showStatusBar: boolean;
  statusBarTheme: 'light' | 'dark';
  statusTime: string;
  batteryLevel: number;
  scale: number;          // 0.5 to 1.5
  offsetX: number;        // -50% to +50%
  offsetY: number;        // -50% to +50%
  rotateZ: number;        // -45 to 45 deg
  rotateY: number;        // -45 to 45 deg (3D)
  rotateX: number;        // -45 to 45 deg (3D)
  shadowIntensity: number;// 0 to 100%
  glareEffect: boolean;
  borderWidth: number;
  // Apple Watch specific
  watchBandType?: 'ocean-band' | 'sport-band' | 'alpine-loop' | 'trail-loop' | 'milanese' | 'none';
  watchBandColor?: string;
  watchScreenshotUrl?: string;
  // Screenshot inside device frame fitting & scaling
  screenshotFit?: 'cover' | 'contain' | 'fill';
  screenshotScale?: number; // 0.8 to 1.3
}

export interface SlideItem {
  id: string;
  name: string;
  screenshotUrl: string;
  secondaryScreenshotUrl?: string; // for dual-device layout or Apple Watch companion
  layout: LayoutTemplate;
  bgConfig: BackgroundConfig;
  textConfig: TextConfig;
  deviceConfig: DeviceConfig;
  customNotes?: string;
  asoScore?: number;
}

export interface AppStoreSpec {
  id: string;
  name: string;
  category: 'iPhone' | 'iPad' | 'Apple Watch' | 'Android Phone' | 'Android Tablet' | 'Store Graphic';
  store: TargetStore;
  width: number;
  height: number;
  aspectRatio: string;
  recommendedDevice: DeviceType;
  description: string;
  required: boolean;
}

export interface AIPitchDeckResponse {
  appStorylineSummary: string;
  slides: {
    slideIndex: number;
    badge: string;
    headline: string;
    subtitle: string;
    featureFocus: string;
    asoTip: string;
  }[];
}

export interface AICopyVariation {
  angle: string;
  badge: string;
  headline: string;
  subtitle: string;
  rationale: string;
}

export interface AppPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  themeColor: string;
  icon: string;
  slides: SlideItem[];
}
