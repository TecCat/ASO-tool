import React, { useRef, useState } from 'react';
import {
  Type,
  Smartphone,
  Palette,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Layers,
  RotateCcw,
  CheckCircle2,
  Tablet,
  Check,
  Watch,
  Trash2,
  Magnet,
  Crosshair,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import {
  SlideItem,
  FontFamily,
  LayoutTemplate,
  DeviceType,
  DeviceCategory,
  DeviceColor,
  BackgroundType,
} from '../types';
import { GRADIENT_PRESETS, DEVICE_MODELS, DeviceModelInfo, generateSampleMockupSvg } from '../data/presets';
import { useLanguage } from '../i18n/LanguageContext';

interface EditorSidebarProps {
  slide: SlideItem;
  onUpdateSlide: (updated: Partial<SlideItem>) => void;
  onApplyToAllSlides: (field: 'bgConfig' | 'deviceConfig' | 'textConfig') => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  slide,
  onUpdateSlide,
  onApplyToAllSlides,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'text' | 'device' | 'background' | 'upload'>('device');
  const [deviceCategoryTab, setDeviceCategoryTab] = useState<DeviceCategory>('iphone');
  const [alignFeedback, setAlignFeedback] = useState<string | null>(null);
  const [activeAlignMode, setActiveAlignMode] = useState<'golden' | 'safe' | 'center'>('golden');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  const { bgConfig, textConfig, deviceConfig, layout } = slide;

  // Find currently active device model info
  const currentModelInfo = DEVICE_MODELS.find((m) => m.id === deviceConfig.deviceType) || DEVICE_MODELS[0];

  // Helper to color metadata map (supports EN / ZH)
  const COLOR_META_MAP: Record<DeviceColor, { nameEn: string; nameZh: string; hex: string }> = {
    'desert-titanium': { nameEn: 'Desert Titanium', nameZh: '沙漠鈦金', hex: '#c4a480' },
    'natural-titanium': { nameEn: 'Natural Titanium', nameZh: '原色鈦金', hex: '#a39e93' },
    'black-titanium': { nameEn: 'Black Titanium', nameZh: '黑色鈦金', hex: '#38383a' },
    'white-titanium': { nameEn: 'White Titanium', nameZh: '白色鈦金', hex: '#e5e5ea' },
    'titanium-gray': { nameEn: 'Titanium Gray', nameZh: '鈦金屬灰', hex: '#8e9099' },
    'onyx-black': { nameEn: 'Onyx Black', nameZh: '瑪瑙黑', hex: '#2a2b2e' },
    'cobalt-violet': { nameEn: 'Cobalt Violet', nameZh: '鈷紫藍', hex: '#6366a6' },
    'amber-yellow': { nameEn: 'Amber Yellow', nameZh: '琥珀黃', hex: '#ecd189' },
    'hazel-green': { nameEn: 'Hazel Green', nameZh: '薄荷霧綠', hex: '#6b8273' },
    'porcelain-white': { nameEn: 'Porcelain White', nameZh: '陶瓷白', hex: '#fafafa' },
    'obsidian-black': { nameEn: 'Obsidian Black', nameZh: '曜石黑', hex: '#262626' },
    'bay-blue': { nameEn: 'Bay Blue', nameZh: '海灣蔚藍', hex: '#60a5fa' },
    'midnight-blue': { nameEn: 'Midnight Blue', nameZh: '午夜深藍', hex: '#334155' },
    'space-gray': { nameEn: 'Space Gray', nameZh: '太空灰', hex: '#4b5563' },
    'silver': { nameEn: 'Silver', nameZh: '極光銀', hex: '#d1d5db' },
    'gold': { nameEn: 'Gold', nameZh: '經典金色', hex: '#fbbf24' },
    'rose-gold': { nameEn: 'Rose Gold', nameZh: '玫瑰金', hex: '#f472b6' },
    'jet-black': { nameEn: 'Jet Black', nameZh: '曜石鏡黑', hex: '#111215' },
    'natural-aluminum': { nameEn: 'Natural Aluminum', nameZh: '原色霧鋁', hex: '#94a3b8' },
    'ultra-orange': { nameEn: 'Ultra Orange Titanium', nameZh: '國際橙鈦', hex: '#ea580c' },
  };

  // Helpers to update nested objects
  const updateText = (partial: Partial<typeof textConfig>) => {
    onUpdateSlide({ textConfig: { ...textConfig, ...partial } });
  };

  const updateDevice = (partial: Partial<typeof deviceConfig>) => {
    onUpdateSlide({ deviceConfig: { ...deviceConfig, ...partial } });
  };

  const updateBg = (partial: Partial<typeof bgConfig>) => {
    onUpdateSlide({ bgConfig: { ...bgConfig, ...partial } });
  };

  // Smart Alignment Function based on iOS App Store specifications
  const handleSmartAlign = (mode: 'golden' | 'safe' | 'center' = 'golden', applyToAll = false) => {
    setActiveAlignMode(mode);

    let updatedText: Partial<typeof textConfig> = {};
    let updatedDevice: Partial<typeof deviceConfig> = {};
    let message = '';

    if (mode === 'golden') {
      // Golden Ratio (38.2% Top Text / 61.8% Device anchor)
      updatedText = {
        headlineSize: 42,
        headlineLetterSpacing: -0.5,
        subtitleSize: 18,
        subtitleOpacity: 0.95,
        headlineAlign: textConfig.headlineAlign || 'center',
      };
      updatedDevice = {
        scale: layout === 'dual-devices' ? 0.95 : 1.0,
        offsetX: 0,
        offsetY: 0,
        rotateZ: layout === 'tilted-3d-left' ? -6 : layout === 'tilted-3d-right' ? 6 : 0,
        shadowIntensity: 68,
        glareEffect: true,
      };
      message = language === 'en'
        ? '✨ Snapped to iOS App Store Golden Ratio (61.8%)!'
        : '✨ 已依 iOS App Store 黃金分割線 (61.8%) 自動吸附對齊！';
    } else if (mode === 'safe') {
      // Safe Margin Snap (8% Top / 6% Bottom Safe Zones)
      updatedText = {
        headlineSize: 40,
        headlineLetterSpacing: -0.4,
        subtitleSize: 17,
        subtitleOpacity: 0.92,
        headlineAlign: 'center',
      };
      updatedDevice = {
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotateZ: 0,
        shadowIntensity: 60,
        glareEffect: true,
        showStatusBar: true,
      };
      message = language === 'en'
        ? '📐 Snapped to iOS App Store Official Safe Zones!'
        : '📐 已吸附至 iOS App Store 官方安全邊界 (Safe Zones)！';
    } else if (mode === 'center') {
      // Optically Centered
      updatedText = {
        headlineAlign: 'center',
        headlineSize: 42,
        subtitleSize: 18,
      };
      updatedDevice = {
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotateZ: 0,
        shadowIntensity: 65,
      };
      message = language === 'en'
        ? '🎯 Calibrated to optical center symmetry!'
        : '🎯 已校準至光學居中對稱！';
    }

    onUpdateSlide({
      textConfig: { ...textConfig, ...updatedText },
      deviceConfig: { ...deviceConfig, ...updatedDevice },
    });

    if (applyToAll) {
      setTimeout(() => {
        onApplyToAllSlides('deviceConfig');
        onApplyToAllSlides('textConfig');
      }, 50);
      message += language === 'en' ? ' (Applied to all slides)' : ' (已同步套用至全部 Slide)';
    }

    setAlignFeedback(message);
    setTimeout(() => {
      setAlignFeedback(null);
    }, 3500);
  };

  const handleSelectDeviceModel = (model: DeviceModelInfo) => {
    updateDevice({
      deviceType: model.id,
      deviceColor: model.defaultColor,
      showDynamicIsland: model.bezelStyle === 'dynamic-island',
    });
  };

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isSecondary = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isSecondary) {
          onUpdateSlide({ secondaryScreenshotUrl: result });
        } else {
          onUpdateSlide({ screenshotUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle custom background image upload
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateBg({
          type: 'image',
          imageUrl: result,
          imageOpacity: 100,
          imageBlur: 0,
          imageDarkOverlay: 25,
          imageScale: 1.0,
          imageFit: 'cover',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isWatchSelected = deviceConfig.deviceType?.startsWith('apple-watch');

  return (
    <div className="flex flex-col h-full bg-[#0A0A0C]/95 text-neutral-100 rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Smart Alignment Header Action Bar */}
      <div className="p-2.5 bg-gradient-to-r from-blue-950/40 via-[#101322] to-indigo-950/40 border-b border-white/[0.08] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center">
            <Magnet className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block leading-tight">{t.smartAlign}</span>
            <span className="text-[9px] text-blue-300/80 block">{t.smartAlignDesc}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleSmartAlign(activeAlignMode, false)}
            className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-[11px] font-bold shadow-md shadow-blue-900/30 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            title={language === 'en' ? 'Snap device & text to iOS App Store golden ratio and safe zones' : '自動根據 iOS App Store 規範吸附至黃金分割與安全邊界'}
          >
            <Sparkles className="w-3 h-3" />
            {t.smartSnapBtn}
          </button>
        </div>
      </div>

      {/* Alignment Feedback Banner */}
      {alignFeedback && (
        <div className="px-3 py-1.5 bg-emerald-950/90 border-b border-emerald-500/30 text-emerald-300 text-[10px] font-medium flex items-center gap-1.5 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{alignFeedback}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-white/[0.08] bg-[#050507]/80 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-white/[0.12] text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          {t.tabText}
        </button>

        <button
          onClick={() => setActiveTab('device')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'device'
              ? 'bg-white/[0.12] text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          {t.tabDevice}
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'background'
              ? 'bg-white/[0.12] text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          {t.tabBackground}
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white/[0.12] text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          {t.tabUpload}
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* ===================== TAB 1: TEXT ===================== */}
        {activeTab === 'text' && (
          <div className="space-y-3.5">
            {/* Badge Pill */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200 flex items-center gap-1.5">
                  <span>{t.badgeTitle}</span>
                </label>
                <input
                  type="checkbox"
                  checked={textConfig.showBadge}
                  onChange={(e) => updateText({ showBadge: e.target.checked })}
                  aria-label="Toggle feature badge"
                  className="rounded-sm accent-blue-500 cursor-pointer"
                />
              </div>

              {textConfig.showBadge && (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={textConfig.badgeText}
                    onChange={(e) => updateText({ badgeText: e.target.value })}
                    className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-white focus:border-blue-500 focus:outline-hidden"
                    placeholder={language === 'en' ? 'e.g. ★ 4.9 RATED, NEW 2026' : '例如：★ 4.9 萬人好評推薦、NEW 2026'}
                  />
                  {/* Preset Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(language === 'en'
                      ? [
                          '★ 4.9 RATED',
                          '✨ NEW IN 2026',
                          '🔥 #1 TOP CHOICE',
                          '⚡ ULTRA FAST & SECURE',
                          '🏆 EDITORS CHOICE',
                          '⌚ APPLE WATCH SYNC',
                        ]
                      : [
                          '★ 4.9 萬人好評',
                          '✨ 2026 全新功能',
                          '🔥 本週最佳推薦',
                          '⚡ 銀行級加密保護',
                          '🏆 專業首選工具',
                          '⌚ Apple Watch 同步',
                        ]
                    ).map((badge, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => updateText({ badgeText: badge })}
                        className="px-2 py-0.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 text-[10px] transition-colors cursor-pointer"
                      >
                        {badge}
                      </button>
                    ))}
                  </div>

                  {/* Badge colors */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-neutral-400 text-[10px] block mb-1">{t.badgeBgColor}</span>
                      <input
                        type="color"
                        value={textConfig.badgeBgColor}
                        onChange={(e) => updateText({ badgeBgColor: e.target.value })}
                        aria-label="Badge background color"
                        className="w-full h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block mb-1">{t.badgeTextColor}</span>
                      <input
                        type="color"
                        value={textConfig.badgeTextColor}
                        onChange={(e) => updateText({ badgeTextColor: e.target.value })}
                        aria-label="Badge text color"
                        className="w-full h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Headline Editor */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3">
              <label className="font-bold text-neutral-200 block">{t.headlineCopy}</label>
              <textarea
                rows={2}
                value={textConfig.headlineText}
                onChange={(e) => updateText({ headlineText: e.target.value })}
                className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl p-2.5 text-white font-medium focus:border-blue-500 focus:outline-hidden leading-relaxed text-sm resize-none"
                placeholder={language === 'en' ? 'Enter eye-catching headline (supports line break)' : '輸入吸睛主標題 (支援換行)'}
              />

              {/* Font Family Selector */}
              <div className="space-y-1">
                <span className="text-neutral-400 text-[11px] block">{t.fontFamily}</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Plus Jakarta Sans', 'Inter', 'Outfit', 'Playfair Display'] as FontFamily[]).map(
                    (f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => updateText({ fontFamily: f })}
                        className={`p-1.5 rounded-lg border text-left truncate transition-all cursor-pointer ${
                          textConfig.fontFamily === f
                            ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                            : 'bg-[#13131A] border-white/[0.06] text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Headline Controls */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{t.fontSize}</span>
                    <span className="font-mono text-neutral-300">{textConfig.headlineSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="28"
                    max="64"
                    value={textConfig.headlineSize}
                    onChange={(e) => updateText({ headlineSize: Number(e.target.value) })}
                    aria-label="Headline size"
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{t.fontColor}</span>
                  </div>
                  <input
                    type="color"
                    value={textConfig.headlineColor}
                    onChange={(e) => updateText({ headlineColor: e.target.value })}
                    aria-label="Headline color"
                    className="w-full h-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Alignment */}
              <div className="flex items-center gap-1 pt-1 bg-[#13131A] p-1 rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => updateText({ headlineAlign: 'left' })}
                  aria-label={t.alignLeft}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    textConfig.headlineAlign === 'left'
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateText({ headlineAlign: 'center' })}
                  aria-label={t.alignCenter}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    textConfig.headlineAlign === 'center'
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateText({ headlineAlign: 'right' })}
                  aria-label={t.alignRight}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    textConfig.headlineAlign === 'right'
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subtitle Editor */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200">{t.subtitleCopy}</label>
                <input
                  type="checkbox"
                  checked={textConfig.showSubtitle}
                  onChange={(e) => updateText({ showSubtitle: e.target.checked })}
                  aria-label="Toggle subtitle"
                  className="rounded-sm accent-blue-500 cursor-pointer"
                />
              </div>

              {textConfig.showSubtitle && (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    value={textConfig.subtitleText}
                    onChange={(e) => updateText({ subtitleText: e.target.value })}
                    className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl p-2.5 text-white focus:border-blue-500 focus:outline-hidden leading-relaxed resize-none"
                    placeholder={language === 'en' ? 'Provide secondary value proposition or benefits' : '補充核心價值與重點特色'}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between text-neutral-400 mb-1">
                        <span>{t.fontSize}</span>
                        <span className="font-mono text-neutral-300">{textConfig.subtitleSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="26"
                        value={textConfig.subtitleSize}
                        onChange={(e) => updateText({ subtitleSize: Number(e.target.value) })}
                        aria-label="Subtitle size"
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block mb-1">{t.fontColor}</span>
                      <input
                        type="color"
                        value={textConfig.subtitleColor}
                        onChange={(e) => updateText({ subtitleColor: e.target.value })}
                        aria-label="Subtitle color"
                        className="w-full h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rating Stars Widget */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200">{t.ratingStarsBadge}</label>
                <input
                  type="checkbox"
                  checked={textConfig.showRatingStars}
                  onChange={(e) => updateText({ showRatingStars: e.target.checked })}
                  aria-label="Toggle rating stars badge"
                  className="rounded-sm accent-blue-500 cursor-pointer"
                />
              </div>

              {textConfig.showRatingStars && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={textConfig.ratingCountText || ''}
                    onChange={(e) => updateText({ ratingCountText: e.target.value })}
                    className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-white focus:border-blue-500 focus:outline-hidden"
                    placeholder={language === 'en' ? 'e.g. 50,000+ Happy Users' : '例如：50,000+ 投資人見證'}
                  />
                </div>
              )}
            </div>

            {/* Batch Apply Button */}
            <button
              onClick={() => onApplyToAllSlides('textConfig')}
              className="w-full py-2.5 bg-[#14141D] hover:bg-blue-600 border border-white/[0.08] hover:border-blue-500 text-neutral-300 hover:text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Layers className="w-3.5 h-3.5" />
              {t.applyTextToAll}
            </button>
          </div>
        )}

        {/* ===================== TAB 2: DEVICE & LAYOUT ===================== */}
        {activeTab === 'device' && (
          <div className="space-y-3.5">
            {/* Smart Alignment Card */}
            <div className="p-3.5 bg-gradient-to-b from-[#101328]/80 to-[#0F0F14]/70 rounded-2xl border border-blue-500/20 space-y-3 shadow-lg shadow-blue-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Magnet className="w-4 h-4 text-blue-400" />
                  <label className="font-bold text-neutral-100 text-xs">{t.smartAlign}</label>
                </div>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 font-medium">
                  {t.higCompliance}
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {language === 'en'
                  ? 'Automatically aligns device scale and typography with iOS App Store HIG standard (38.2% header / 61.8% device anchor) to prevent clipping in all App Store lists.'
                  : '自動依據 Apple HIG 與黃金比例（38.2% 標題區 + 61.8% 裝置下半區）校準位置與邊界，確保在各機型 App Store 列表中視覺平衡且不被裁切。'}
              </p>

              {/* Mode Selection Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  {
                    id: 'golden',
                    label: t.alignGoldenRatio,
                    desc: language === 'en' ? 'Ideal visual ratio' : '極佳視覺閱讀比例',
                    icon: Sparkles,
                  },
                  {
                    id: 'safe',
                    label: t.alignSafeZones,
                    desc: language === 'en' ? 'Avoids 8% clipping' : '避開 8% 上架裁切',
                    icon: ShieldCheck,
                  },
                  {
                    id: 'center',
                    label: t.alignOpticalCenter,
                    desc: language === 'en' ? 'Precise X:0 / Y:0' : '精準 X:0 / Y:0',
                    icon: Crosshair,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = activeAlignMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSmartAlign(m.id as any, false)}
                      className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/25 border-blue-500 text-white shadow-xs'
                          : 'bg-[#13131A] border-white/[0.06] text-neutral-300 hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Icon className={`w-3 h-3 ${isActive ? 'text-blue-400' : 'text-neutral-400'}`} />
                        <span className="font-bold text-[10px] truncate">{m.label}</span>
                      </div>
                      <span className="text-[9px] text-neutral-400 truncate">{m.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons for Smart Align */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSmartAlign(activeAlignMode, false)}
                  className="py-2 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/30 active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.alignCurrentSlide}
                </button>
                <button
                  type="button"
                  onClick={() => handleSmartAlign(activeAlignMode, true)}
                  className="py-2 px-2.5 bg-[#171926] hover:bg-white/[0.1] border border-blue-500/30 text-blue-300 hover:text-white rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Layers className="w-3.5 h-3.5" />
                  {t.alignAllSlides}
                </button>
              </div>
            </div>

            {/* Layout Mode */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200 block">{t.layoutStyle}</label>
                <span className="text-[10px] text-blue-400">{language === 'en' ? 'Templates' : '熱門樣板'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'text-top-phone-bottom', name: language === 'en' ? 'Text Top · Phone Bottom' : '標準: 標題在上・設備在下' },
                  { id: 'phone-with-watch', name: language === 'en' ? '✨ iPhone + Watch Duo' : '✨ iPhone + Watch 雙機聯動' },
                  { id: 'watch-focus', name: language === 'en' ? '⌚ Apple Watch Focus' : '⌚ Apple Watch 旗艦焦點' },
                  { id: 'watch-top-text-bottom', name: language === 'en' ? 'Watch Top · Text Bottom' : '手錶置頂・文案置底' },
                  { id: 'phone-top-text-bottom', name: language === 'en' ? 'Phone Top · Text Bottom' : '反轉: 設備在上・標題在下' },
                  { id: 'tilted-3d-left', name: language === 'en' ? '3D Left Tilt' : '3D 視角: 向左傾斜透視' },
                  { id: 'tilted-3d-right', name: language === 'en' ? '3D Right Tilt' : '3D 視角: 向右傾斜透視' },
                  { id: 'dual-devices', name: language === 'en' ? 'Dual Phone Showcase' : '雙機流: 雙手機重疊展示' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onUpdateSlide({ layout: item.id as LayoutTemplate });
                      if (item.id === 'watch-focus' || item.id === 'watch-top-text-bottom') {
                        if (!deviceConfig.deviceType.startsWith('apple-watch')) {
                          updateDevice({ deviceType: 'apple-watch-ultra-2', deviceColor: 'natural-titanium' });
                        }
                      }
                    }}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                      layout === item.id
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-sm'
                        : 'bg-[#13131A] border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:border-white/[0.15]'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Diverse Device Selection Matrix */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200">{t.deviceMockup}</label>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {currentModelInfo.brand.toUpperCase()}
                </span>
              </div>

              {/* Category Segmented Selector */}
              <div className="grid grid-cols-5 gap-1 p-1 bg-[#13131A] rounded-xl border border-white/[0.06]">
                {[
                  { id: 'iphone', label: 'iPhone', icon: '🍎' },
                  { id: 'apple-watch', label: 'Watch', icon: '⌚' },
                  { id: 'ipad', label: 'iPad', icon: '💻' },
                  { id: 'android-phone', label: language === 'en' ? 'Android' : '安卓', icon: '🤖' },
                  { id: 'android-tablet', label: language === 'en' ? 'Tablet' : '平板', icon: '📟' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDeviceCategoryTab(cat.id as DeviceCategory)}
                    className={`py-1.5 rounded-lg text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      deviceCategoryTab === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-xs">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Filtered Device Cards List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {DEVICE_MODELS.filter((m) => m.category === deviceCategoryTab).map((model) => {
                  const isSelected = deviceConfig.deviceType === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleSelectDeviceModel(model)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 text-white'
                          : 'bg-[#13131A] border-white/[0.06] text-neutral-300 hover:border-white/[0.15] hover:bg-[#181822]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs">{model.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/[0.08] text-neutral-300 font-mono">
                            {model.screenSize}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-relaxed">{model.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Device Colors Matrix */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <label className="font-semibold text-neutral-300 block text-[11px]">
                  {language === 'en' ? `Bezel & Finish Color (${currentModelInfo.name})` : `機身邊框與材質色系 (${currentModelInfo.name})`}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {currentModelInfo.supportedColors.map((colorKey) => {
                    const colorData = COLOR_META_MAP[colorKey] || { nameEn: colorKey, nameZh: colorKey, hex: '#71717a' };
                    const isSelected = deviceConfig.deviceColor === colorKey;
                    const displayName = language === 'en' ? colorData.nameEn : colorData.nameZh;
                    return (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => updateDevice({ deviceColor: colorKey })}
                        className={`p-1.5 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-white/[0.12] shadow-xs'
                            : 'border-white/[0.06] bg-[#13131A] hover:border-white/[0.15]'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                          style={{ background: colorData.hex }}
                        />
                        <span className="text-[9px] text-neutral-300 truncate w-full text-center">
                          {displayName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apple Watch Band customization when Watch is selected */}
              {isWatchSelected && (
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <label className="font-semibold text-neutral-300 block text-[11px]">
                    {language === 'en' ? 'Apple Watch Band & Style' : 'Apple Watch 錶帶款式與色彩'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'ocean-band', name: language === 'en' ? 'Ocean Band' : '海洋錶帶' },
                      { id: 'alpine-loop', name: language === 'en' ? 'Alpine Loop' : '高山錶環' },
                      { id: 'trail-loop', name: language === 'en' ? 'Trail Loop' : '越野錶環' },
                      { id: 'sport-band', name: language === 'en' ? 'Sport Band' : '運動型錶帶' },
                      { id: 'milanese', name: language === 'en' ? 'Milanese Metal' : '米蘭尼斯金屬' },
                      { id: 'none', name: language === 'en' ? 'No Band' : '純錶身 (無錶帶)' },
                    ].map((band) => (
                      <button
                        key={band.id}
                        type="button"
                        onClick={() => updateDevice({ watchBandType: band.id as any })}
                        className={`p-1.5 rounded-lg border text-center text-[10px] transition-all cursor-pointer ${
                          (deviceConfig.watchBandType || 'ocean-band') === band.id
                            ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                            : 'bg-[#13131A] border-white/[0.06] text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {band.name}
                      </button>
                    ))}
                  </div>

                  {/* Band color palette */}
                  <div className="space-y-1 pt-1">
                    <span className="text-neutral-400 text-[10px] block">{language === 'en' ? 'Band Color' : '錶帶顏色'}</span>
                    <div className="flex gap-2">
                      {[
                        { name: 'Ultra Orange', hex: '#f97316' },
                        { name: 'Midnight Black', hex: '#18181b' },
                        { name: 'Starlight White', hex: '#e2e8f0' },
                        { name: 'Olive Green', hex: '#4d7c0f' },
                        { name: 'Bay Blue', hex: '#0284c7' },
                        { name: 'Bright Yellow', hex: '#eab308' },
                      ].map((bCol) => (
                        <button
                          key={bCol.hex}
                          type="button"
                          title={bCol.name}
                          onClick={() => updateDevice({ watchBandColor: bCol.hex })}
                          className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                            deviceConfig.watchBandColor === bCol.hex ? 'ring-2 ring-blue-500 scale-110' : 'border-white/20'
                          }`}
                          style={{ backgroundColor: bCol.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Device Hardware & Screen Display Controls */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3">
              <label className="font-bold text-neutral-200 block">{t.hardwareControls}</label>

              {/* Scale Slider */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{t.deviceScale}</span>
                  <span className="font-mono text-neutral-300">{Math.round((deviceConfig.scale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.65"
                  max="1.35"
                  step="0.01"
                  value={deviceConfig.scale || 1}
                  onChange={(e) => updateDevice({ scale: Number(e.target.value) })}
                  aria-label="Device scale"
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Offset X & Y */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{t.horizontalOffset}</span>
                    <span className="font-mono text-neutral-300">{deviceConfig.offsetX || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={deviceConfig.offsetX || 0}
                    onChange={(e) => updateDevice({ offsetX: Number(e.target.value) })}
                    aria-label="Horizontal offset"
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{t.verticalOffset}</span>
                    <span className="font-mono text-neutral-300">{deviceConfig.offsetY || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-35"
                    max="35"
                    value={deviceConfig.offsetY || 0}
                    onChange={(e) => updateDevice({ offsetY: Number(e.target.value) })}
                    aria-label="Vertical offset"
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* 3D Perspective Angles */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{t.rotationZ}</span>
                    <span className="font-mono text-neutral-300">{deviceConfig.rotateZ}°</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={deviceConfig.rotateZ}
                    onChange={(e) => updateDevice({ rotateZ: Number(e.target.value) })}
                    aria-label="Plane rotation"
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{t.shadowIntensity}</span>
                    <span className="font-mono text-neutral-300">{deviceConfig.shadowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={deviceConfig.shadowIntensity}
                    onChange={(e) => updateDevice({ shadowIntensity: Number(e.target.value) })}
                    aria-label="Shadow intensity"
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* Hardware Toggles */}
              {!isWatchSelected && (
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  {currentModelInfo.bezelStyle === 'dynamic-island' && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-300">{t.dynamicIsland}</span>
                      <input
                        type="checkbox"
                        checked={deviceConfig.showDynamicIsland}
                        onChange={(e) => updateDevice({ showDynamicIsland: e.target.checked })}
                        aria-label="Toggle dynamic island"
                        className="accent-blue-500 cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-neutral-300 block">{t.statusBar}</span>
                      <span className="text-[10px] text-neutral-500 block">
                        {currentModelInfo.brand === 'apple' ? 'iOS' : 'Android Material'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={deviceConfig.showStatusBar}
                      onChange={(e) => updateDevice({ showStatusBar: e.target.checked })}
                      aria-label="Toggle status bar"
                      className="accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {deviceConfig.showStatusBar && (
                    <div className="flex items-center justify-between pl-2 pt-1 border-l-2 border-blue-500/40">
                      <span className="text-neutral-400 text-[11px]">{t.statusTime}</span>
                      <input
                        type="text"
                        value={deviceConfig.statusTime || '9:41'}
                        onChange={(e) => updateDevice({ statusTime: e.target.value })}
                        className="w-20 bg-[#13131A] border border-white/[0.1] rounded-lg px-2 py-0.5 text-center text-white text-xs font-mono"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">{t.glareEffect}</span>
                    <input
                      type="checkbox"
                      checked={deviceConfig.glareEffect}
                      onChange={(e) => updateDevice({ glareEffect: e.target.checked })}
                      aria-label="Toggle glare sheen"
                      className="accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Batch Apply Button */}
            <button
              onClick={() => onApplyToAllSlides('deviceConfig')}
              className="w-full py-2.5 bg-[#14141D] hover:bg-blue-600 border border-white/[0.08] hover:border-blue-500 text-neutral-300 hover:text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Layers className="w-3.5 h-3.5" />
              {t.applyDeviceToAll}
            </button>
          </div>
        )}

        {/* ===================== TAB 3: BACKGROUND & COLOR ===================== */}
        {activeTab === 'background' && (
          <div className="space-y-3.5">
            {/* Background Mode Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#13131A] rounded-xl border border-white/[0.06]">
              {[
                { id: 'gradient', label: t.bgGradient, icon: '🎨' },
                { id: 'image', label: t.bgImage, icon: '🖼️' },
                { id: 'solid', label: t.bgSolid, icon: '⬛' },
              ].map((bgT) => (
                <button
                  key={bgT.id}
                  type="button"
                  onClick={() => updateBg({ type: bgT.id as BackgroundType })}
                  className={`py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    bgConfig.type === bgT.id || (bgT.id === 'image' && !!bgConfig.imageUrl)
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>{bgT.icon}</span>
                  <span>{bgT.label}</span>
                </button>
              ))}
            </div>

            {/* 1. Custom Background Image Upload Box */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-200 flex items-center gap-1.5">
                  <span>{t.customBgImage}</span>
                </label>
                {bgConfig.imageUrl && (
                  <button
                    onClick={() => updateBg({ imageUrl: undefined, type: 'gradient' })}
                    className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t.clearImage}
                  </button>
                )}
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => bgImageInputRef.current?.click()}
                className="border-2 border-dashed border-white/[0.12] hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group bg-[#13131A]/50 hover:bg-blue-950/20"
              >
                {bgConfig.imageUrl ? (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 border border-white/20">
                    <img
                      src={bgConfig.imageUrl}
                      alt="Background Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {language === 'en' ? 'Click to change background image' : '點擊更換新背景圖片'}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <p className="font-semibold text-neutral-200 text-xs">{t.uploadBgText}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{t.uploadBgHint}</p>
                  </>
                )}
                <input
                  ref={bgImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  className="hidden"
                />
              </div>

              {/* Background Image Fine-tuning Sliders (Blur, Dark Dimmer, Opacity, Scale) */}
              {bgConfig.imageUrl && (
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  {/* Blur slider */}
                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>{t.blurAmount}</span>
                      <span className="font-mono text-neutral-300">{bgConfig.imageBlur || 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={bgConfig.imageBlur || 0}
                      onChange={(e) => updateBg({ imageBlur: Number(e.target.value) })}
                      aria-label="Blur amount"
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Dark Dimmer Overlay to make texts pop */}
                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>{t.darkOverlay}</span>
                      <span className="font-mono text-neutral-300">{bgConfig.imageDarkOverlay ?? 25}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="85"
                      value={bgConfig.imageDarkOverlay ?? 25}
                      onChange={(e) => updateBg({ imageDarkOverlay: Number(e.target.value) })}
                      aria-label="Dark overlay"
                      className="w-full accent-blue-500"
                    />
                  </div>

                  {/* Scale & Opacity */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between text-neutral-400 mb-1">
                        <span>{t.scale}</span>
                        <span className="font-mono text-neutral-300">{Math.round((bgConfig.imageScale || 1.0) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="1.8"
                        step="0.05"
                        value={bgConfig.imageScale || 1.0}
                        onChange={(e) => updateBg({ imageScale: Number(e.target.value) })}
                        aria-label="Scale"
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-neutral-400 mb-1">
                        <span>{t.opacity}</span>
                        <span className="font-mono text-neutral-300">{bgConfig.imageOpacity ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={bgConfig.imageOpacity ?? 100}
                        onChange={(e) => updateBg({ imageOpacity: Number(e.target.value) })}
                        aria-label="Opacity"
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Presets Grid */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-2.5">
              <label className="font-bold text-neutral-200 block">{t.gradientPresets}</label>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      updateBg({
                        type: 'gradient',
                        gradientPreset: preset.id,
                        color1: preset.color1,
                        color2: preset.color2,
                        color3: preset.color3,
                        angle: preset.angle,
                        blurOrbs: preset.blurOrbs,
                        orbColor1: preset.orbColor1,
                        orbColor2: preset.orbColor2,
                        imageUrl: undefined,
                      })
                    }
                    className="p-2 rounded-xl text-left border border-white/[0.06] hover:border-white/[0.2] transition-all flex items-center gap-2 bg-[#13131A] cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-lg shrink-0 shadow-inner"
                      style={{
                        background: `linear-gradient(${preset.angle}deg, ${preset.color1}, ${preset.color2})`,
                      }}
                    />
                    <span className="text-[11px] font-semibold text-neutral-200 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Gradient Controls */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3">
              <label className="font-bold text-neutral-200 block">{t.customGradient}</label>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[10px]">{t.startColor}</span>
                  <input
                    type="color"
                    value={bgConfig.color1}
                    onChange={(e) => updateBg({ color1: e.target.value })}
                    aria-label="Gradient color 1"
                    className="w-full h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[10px]">{t.midColor}</span>
                  <input
                    type="color"
                    value={bgConfig.color2}
                    onChange={(e) => updateBg({ color2: e.target.value })}
                    aria-label="Gradient color 2"
                    className="w-full h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[10px]">{t.endColor}</span>
                  <input
                    type="color"
                    value={bgConfig.color3 || bgConfig.color2}
                    onChange={(e) => updateBg({ color3: e.target.value })}
                    aria-label="Gradient color 3"
                    className="w-full h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{t.angle}</span>
                  <span className="font-mono text-neutral-300">{bgConfig.angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={bgConfig.angle}
                  onChange={(e) => updateBg({ angle: Number(e.target.value) })}
                  aria-label="Gradient angle"
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Glow Orbs & Noise */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">{t.glowOrbs}</span>
                  <input
                    type="checkbox"
                    checked={bgConfig.blurOrbs}
                    onChange={(e) => updateBg({ blurOrbs: e.target.checked })}
                    aria-label="Toggle glow orbs"
                    className="accent-blue-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">{t.noiseTexture}</span>
                  <input
                    type="checkbox"
                    checked={bgConfig.noiseOverlay}
                    onChange={(e) => updateBg({ noiseOverlay: e.target.checked })}
                    aria-label="Toggle noise texture"
                    className="accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Batch Apply Button */}
            <button
              onClick={() => onApplyToAllSlides('bgConfig')}
              className="w-full py-2.5 bg-[#14141D] hover:bg-blue-600 border border-white/[0.08] hover:border-blue-500 text-neutral-300 hover:text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Layers className="w-3.5 h-3.5" />
              {t.applyBgToAll}
            </button>
          </div>
        )}

        {/* ===================== TAB 4: SCREENSHOT UPLOAD ===================== */}
        {activeTab === 'upload' && (
          <div className="space-y-3.5">
            {/* Direct Upload Box */}
            <div className="p-4 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3 text-center">
              <label className="font-bold text-neutral-200 block">
                {isWatchSelected
                  ? (language === 'en' ? 'Replace Current Apple Watch UI Screenshot' : '更換當前 Apple Watch 介面截圖')
                  : t.replaceScreenshotTitle}
              </label>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/[0.12] hover:border-blue-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all group bg-[#13131A]/50 hover:bg-blue-950/20"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="font-semibold text-neutral-200">{t.uploadPrompt}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{t.uploadSupportedFormats}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
              </div>

              {/* Secondary screenshot for Apple Watch companion or dual-device layout */}
              {(layout === 'phone-with-watch' || layout === 'dual-devices') && (
                <div className="pt-2 border-t border-white/[0.06] text-left">
                  <span className="text-neutral-300 block mb-1.5 font-bold">
                    {layout === 'phone-with-watch'
                      ? (language === 'en' ? '⌚ Apple Watch UI Screenshot' : '⌚ Apple Watch 專用手錶介面截圖')
                      : (language === 'en' ? '📱 Secondary Phone Screenshot' : '📱 第二張手機截圖 (雙設備展示)')}
                  </span>
                  <button
                    onClick={() => secondaryFileInputRef.current?.click()}
                    className="w-full py-2.5 bg-[#13131A] hover:bg-blue-600/30 border border-white/[0.1] hover:border-blue-500 rounded-xl text-neutral-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {language === 'en' ? 'Upload Watch/Secondary Screenshot' : '上傳手錶/副機介面截圖'}
                  </button>
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Built-in Sample UI Presets */}
            <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-2.5">
              <label className="font-bold text-neutral-200 block">
                {t.sampleUiTitle}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: language === 'en' ? 'Finance & Portfolio' : '理財投資 UI', theme: 'finance', screen: 1 },
                  { name: language === 'en' ? 'Multi-Currency Account' : '多幣別帳戶 UI', theme: 'finance', screen: 2 },
                  { name: language === 'en' ? 'Heart & Workout' : '心率運動 UI', theme: 'fitness', screen: 1 },
                  { name: language === 'en' ? 'AI Assistant Chat' : 'AI 助理對話 UI', theme: 'ai', screen: 1 },
                  { name: language === 'en' ? 'Ecommerce Store' : '電商選品 UI', theme: 'ecommerce', screen: 1 },
                  { name: language === 'en' ? 'Meditation & Sleep' : '冥想助眠 UI', theme: 'meditation', screen: 1 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const svg = generateSampleMockupSvg(item.theme as any, item.screen);
                      onUpdateSlide({ screenshotUrl: svg });
                    }}
                    className="p-2 rounded-xl bg-[#13131A] hover:bg-[#1B1B24] border border-white/[0.06] text-left text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    📱 {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
