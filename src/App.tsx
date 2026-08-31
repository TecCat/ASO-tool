import React, { useState } from 'react';
import { SlideItem, AppPreset, AIPitchDeckResponse } from './types';
import { SAMPLE_PRESETS, generateSampleMockupSvg } from './data/presets';
import { AppHeader } from './components/AppHeader';
import { ScreenshotRenderer } from './components/ScreenshotRenderer';
import { EditorSidebar } from './components/EditorSidebar';
import { AICopyAssistant } from './components/AICopyAssistant';
import { SlideThumbnailDeck } from './components/SlideThumbnailDeck';
import { ExportModal } from './components/ExportModal';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Sparkles, Layers, Maximize2, Plus } from 'lucide-react';

function AppContent() {
  const { t, language } = useLanguage();
  // Initialize with the first rich sample preset (WealthWise Finance)
  const [slides, setSlides] = useState<SlideItem[]>(SAMPLE_PRESETS[0].slides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // View settings
  const [isTabletView, setIsTabletView] = useState(false);
  const [isStoryboardMode, setIsStoryboardMode] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [zoom, setZoom] = useState(0.44);

  // Modals & Panels
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  // Active slide
  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Update current slide
  const handleUpdateSlide = (updated: Partial<SlideItem>) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, ...updated } : s))
    );
  };

  // Batch apply configuration to all slides
  const handleApplyToAllSlides = (field: 'bgConfig' | 'deviceConfig' | 'textConfig') => {
    const source = currentSlide[field];
    setSlides((prev) =>
      prev.map((s) => {
        if (field === 'textConfig') {
          // Keep the unique text contents, only inherit font & colors
          return {
            ...s,
            textConfig: {
              ...s.textConfig,
              fontFamily: source.fontFamily,
              headlineColor: source.headlineColor,
              headlineSize: source.headlineSize,
              headlineWeight: source.headlineWeight,
              subtitleColor: source.subtitleColor,
              badgeBgColor: source.badgeBgColor,
              badgeTextColor: source.badgeTextColor,
            },
          };
        }
        return {
          ...s,
          [field]: { ...source },
        };
      })
    );
  };

  // Add new slide
  const handleAddSlide = () => {
    const newIndex = slides.length + 1;
    const newSlide: SlideItem = {
      id: `slide-${Date.now()}`,
      name: `Slide ${newIndex}: ${language === 'en' ? 'Showcase' : '亮點展示'}`,
      screenshotUrl: generateSampleMockupSvg('ai', (newIndex % 3) + 1),
      layout: 'text-top-phone-bottom',
      bgConfig: { ...currentSlide.bgConfig },
      textConfig: {
        ...currentSlide.textConfig,
        headlineText: language === 'en' ? `Powerful Feature ${newIndex}\nSmooth & Intuitive Experience` : `強大功能 ${newIndex}\n直覺操作流暢無比`,
        subtitleText: language === 'en' ? 'Deeply optimized for iOS ecosystem with ultra-fast speed' : '專為 iOS 生態深度優化，極致速度體驗',
        badgeText: '★ PRO FEATURE',
        showBadge: true,
      },
      deviceConfig: { ...currentSlide.deviceConfig },
      asoScore: 92,
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  // Duplicate slide
  const handleDuplicateSlide = (index: number) => {
    const target = slides[index];
    const duplicated: SlideItem = {
      ...target,
      id: `slide-${Date.now()}`,
      name: `${target.name} (${language === 'en' ? 'Copy' : '複製'})`,
    };
    const nextSlides = [...slides];
    nextSlides.splice(index + 1, 0, duplicated);
    setSlides(nextSlides);
    setActiveSlideIndex(index + 1);
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const nextSlides = slides.filter((_, i) => i !== index);
    setSlides(nextSlides);
    setActiveSlideIndex(Math.min(activeSlideIndex, nextSlides.length - 1));
  };

  // Move slide
  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const nextSlides = [...slides];
    const [moved] = nextSlides.splice(fromIndex, 1);
    nextSlides.splice(toIndex, 0, moved);
    setSlides(nextSlides);
    setActiveSlideIndex(toIndex);
  };

  // Load Preset
  const handleSelectPreset = (preset: AppPreset) => {
    setSlides(preset.slides);
    setActiveSlideIndex(0);
  };

  // AI Actions: Apply Full Deck Copy
  const handleApplyDeckCopy = (generatedSlides: AIPitchDeckResponse['slides']) => {
    setSlides((prev) => {
      return prev.map((slide, idx) => {
        const gen = generatedSlides[idx];
        if (!gen) return slide;
        return {
          ...slide,
          name: `Slide ${idx + 1}: ${gen.featureFocus || slide.name}`,
          textConfig: {
            ...slide.textConfig,
            badgeText: gen.badge || slide.textConfig.badgeText,
            headlineText: gen.headline,
            subtitleText: gen.subtitle,
            showBadge: !!gen.badge,
            showSubtitle: !!gen.subtitle,
          },
        };
      });
    });
  };

  // AI Actions: Apply Single Slide Copy
  const handleApplySlideCopy = (
    slideIndex: number,
    badge: string,
    headline: string,
    subtitle: string
  ) => {
    setSlides((prev) =>
      prev.map((s, idx) => {
        if (idx !== slideIndex) return s;
        return {
          ...s,
          textConfig: {
            ...s.textConfig,
            badgeText: badge || s.textConfig.badgeText,
            showBadge: !!badge,
            headlineText: headline,
            subtitleText: subtitle,
            showSubtitle: !!subtitle,
          },
        };
      })
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#050507] text-neutral-100 overflow-hidden font-sans select-none relative">
      {/* Background Ambient Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 40%)',
        }}
      />

      {/* Top Header */}
      <AppHeader
        onSelectPreset={handleSelectPreset}
        isTabletView={isTabletView}
        onToggleTabletView={() => setIsTabletView(!isTabletView)}
        isStoryboardMode={isStoryboardMode}
        onToggleStoryboardMode={() => setIsStoryboardMode(!isStoryboardMode)}
        showSafeZones={showSafeZones}
        onToggleSafeZones={() => setShowSafeZones(!showSafeZones)}
        zoom={zoom}
        onZoomChange={setZoom}
        showAIPanel={showAIPanel}
        onToggleAIPanel={() => setShowAIPanel(!showAIPanel)}
        onOpenExportModal={() => setShowExportModal(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left: Customizer & Property Sidebar */}
        <aside className="w-80 sm:w-96 shrink-0 h-full p-3 bg-[#0A0A0C]/90 backdrop-blur-xl border-r border-white/[0.08] flex flex-col z-20 shadow-2xl">
          <EditorSidebar
            slide={currentSlide}
            onUpdateSlide={handleUpdateSlide}
            onApplyToAllSlides={handleApplyToAllSlides}
          />
        </aside>

        {/* Center: Live Interactive Preview Stage */}
        <main className="flex-1 h-full overflow-auto bg-radial from-[#0e1017]/80 via-[#070709] to-[#050507] p-6 flex flex-col items-center justify-center relative">
          {/* Subtle Grid Canvas Background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          {isStoryboardMode ? (
            // Storyboard Multi-Slide Horizontal Carousel View
            <div className="w-full h-full flex items-center gap-8 overflow-x-auto p-8 scrollbar-thin">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    setIsStoryboardMode(false);
                  }}
                  className={`flex flex-col items-center gap-3 shrink-0 cursor-pointer p-4 rounded-3xl transition-all border ${
                    idx === activeSlideIndex
                      ? 'bg-blue-950/30 border-blue-500/80 shadow-2xl shadow-blue-950/50 ring-2 ring-blue-500/30'
                      : 'bg-[#0F0F14]/70 border-white/[0.06] hover:border-white/[0.15] hover:bg-[#13131A]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full px-2 text-xs font-bold text-neutral-300">
                    <span>
                      #{idx + 1} {slide.name}
                    </span>
                    <span className="text-[10px] text-blue-400 font-semibold">{language === 'en' ? 'Click to Edit' : '點擊切換編輯'}</span>
                  </div>
                  <ScreenshotRenderer
                    slide={slide}
                    zoom={0.34}
                    showSafeZones={showSafeZones}
                    isTabletView={isTabletView}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Single Slide Focus Preview Mode
            <div className="relative flex flex-col items-center justify-center animate-fade-in">
              <ScreenshotRenderer
                slide={currentSlide}
                zoom={zoom}
                showSafeZones={showSafeZones}
                isTabletView={isTabletView}
              />

              {/* Resolution Label Tag */}
              <div className="mt-4 px-4 py-1.5 rounded-full bg-[#0E0E12]/90 border border-white/[0.08] text-[11px] text-neutral-300 font-mono flex items-center gap-2.5 shadow-xl backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50" />
                <span className="font-semibold">
                  {isTabletView ? 'iPad Pro 13" (2048 × 2732 px)' : 'iPhone 6.9" / 6.7" (1290 × 2796 px)'}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-neutral-400">
                  {language === 'en' ? 'Live High-Fidelity Rendering' : '即時高保真算圖'}
                </span>
              </div>
            </div>
          )}
        </main>

        {/* Right: AI ASO & Title Assistant Drawer */}
        {showAIPanel && (
          <aside className="w-80 sm:w-96 shrink-0 h-full p-3 bg-[#0A0A0C]/90 backdrop-blur-xl border-l border-white/[0.08] flex flex-col z-20 shadow-2xl animate-fade-in">
            <AICopyAssistant
              slides={slides}
              activeSlideIndex={activeSlideIndex}
              onApplyDeckCopy={handleApplyDeckCopy}
              onApplySlideCopy={handleApplySlideCopy}
            />
          </aside>
        )}
      </div>

      {/* Bottom: Multi-Slide Deck Carousel Strip */}
      <SlideThumbnailDeck
        slides={slides}
        activeSlideIndex={activeSlideIndex}
        onSelectSlide={setActiveSlideIndex}
        onAddSlide={handleAddSlide}
        onDuplicateSlide={handleDuplicateSlide}
        onDeleteSlide={handleDeleteSlide}
        onMoveSlide={handleMoveSlide}
      />

      {/* App Store Batch Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        slides={slides}
        activeSlideIndex={activeSlideIndex}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
