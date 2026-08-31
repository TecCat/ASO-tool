import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  RefreshCw,
  Check,
  TrendingUp,
  Languages,
  Layers,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { SlideItem, AIPitchDeckResponse, AICopyVariation } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AICopyAssistantProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onApplyDeckCopy: (generatedSlides: AIPitchDeckResponse['slides']) => void;
  onApplySlideCopy: (
    slideIndex: number,
    badge: string,
    headline: string,
    subtitle: string
  ) => void;
}

export const AICopyAssistant: React.FC<AICopyAssistantProps> = ({
  slides,
  activeSlideIndex,
  onApplyDeckCopy,
  onApplySlideCopy,
}) => {
  const { t, language: uiLanguage } = useLanguage();
  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Mode: 'full-deck' | 'slide-variations' | 'localize'
  const [activeTab, setActiveTab] = useState<'full-deck' | 'slide-variations' | 'localize'>('slide-variations');

  // Full Deck Form State
  const [appName, setAppName] = useState('My iOS App');
  const [appCategory, setAppCategory] = useState('Productivity & Utilities');
  const [appDescription, setAppDescription] = useState(
    uiLanguage === 'en'
      ? 'Minimalist high-efficiency task manager with AI smart scheduling and real-time team sync'
      : '極簡高效率任務管理工具，AI 智慧排程與團隊即時同步'
  );
  const [tone, setTone] = useState<'apple-minimal' | 'bold-action' | 'problem-solution' | 'social-proof'>('apple-minimal');
  const [language, setLanguage] = useState<'zh-TW' | 'en' | 'ja'>(uiLanguage === 'en' ? 'en' : 'zh-TW');

  // Loading & Data States
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [deckResult, setDeckResult] = useState<AIPitchDeckResponse | null>(null);

  const [loadingVariations, setLoadingVariations] = useState(false);
  const [variations, setVariations] = useState<AICopyVariation[]>([]);

  const [loadingLocalize, setLoadingLocalize] = useState(false);
  const [localizedResults, setLocalizedResults] = useState<any[]>([]);

  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate Deck Copy via API
  const handleGenerateDeck = async () => {
    setLoadingDeck(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          appCategory,
          appDescription,
          slideCount: Math.max(3, slides.length),
          language,
          tone,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || (uiLanguage === 'en' ? 'Generation failed' : '生成失敗'));
      setDeckResult(data.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (uiLanguage === 'en' ? 'Unable to connect to AI engine. Please try again.' : '無法連線至 AI 建議引擎，請稍後再試'));
    } finally {
      setLoadingDeck(false);
    }
  };

  // Generate Single Slide Variations via API
  const handleGenerateVariations = async () => {
    setLoadingVariations(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/suggest-variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          category: appCategory,
          currentHeadline: currentSlide?.textConfig?.headlineText || '',
          currentSubtitle: currentSlide?.textConfig?.subtitleText || '',
          featureContext: currentSlide?.name || (uiLanguage === 'en' ? 'Core Feature Showcase' : '核心功能展示'),
          language,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || (uiLanguage === 'en' ? 'Generation failed' : '生成失敗'));
      setVariations(data.data.variations || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (uiLanguage === 'en' ? 'Unable to generate copy variations' : '無法生成文案變體'));
    } finally {
      setLoadingVariations(false);
    }
  };

  // Generate Multi-language Localization
  const handleLocalize = async (targetLangs: string[]) => {
    setLoadingLocalize(true);
    setErrorMsg(null);
    try {
      const slidesPayload = slides.map((s, idx) => ({
        slideIndex: idx + 1,
        badge: s.textConfig.badgeText,
        headline: s.textConfig.headlineText,
        subtitle: s.textConfig.subtitleText,
      }));

      const res = await fetch('/api/ai/localize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: slidesPayload,
          targetLanguages: targetLangs,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || (uiLanguage === 'en' ? 'Localization failed' : '翻譯在地化失敗'));
      setLocalizedResults(data.data.localizedSets || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (uiLanguage === 'en' ? 'Localization service unavailable' : '在地化服務暫時無法使用'));
    } finally {
      setLoadingLocalize(false);
    }
  };

  // Quick ASO Glance-Test Score Analysis
  const headlineLen = currentSlide?.textConfig?.headlineText?.length || 0;
  const isGoodLength = language === 'zh-TW' ? headlineLen >= 4 && headlineLen <= 24 : headlineLen >= 10 && headlineLen <= 45;
  const hasSubtitle = !!currentSlide?.textConfig?.subtitleText && currentSlide?.textConfig?.showSubtitle;

  return (
    <div className="flex flex-col h-full bg-[#0A0A0C]/95 text-neutral-100 rounded-3xl border border-white/[0.08] p-4 overflow-y-auto space-y-4 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-950/60">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-100">{t.aiAssistantTitle}</h3>
            <p className="text-xs text-neutral-400">{t.aiAssistantDesc}</p>
          </div>
        </div>

        {/* Language selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          aria-label="Select copywriting language"
          className="bg-[#121217] border border-white/[0.1] text-xs rounded-xl px-2.5 py-1.5 text-neutral-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
        >
          <option value="zh-TW">繁體中文 (TW/HK)</option>
          <option value="en">English (US/Global)</option>
          <option value="ja">日本語 (Japan)</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#050507]/80 p-1 rounded-2xl border border-white/[0.08] text-xs">
        <button
          onClick={() => setActiveTab('slide-variations')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'slide-variations'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {t.tabSlideVariations}
        </button>
        <button
          onClick={() => setActiveTab('full-deck')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'full-deck'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {t.tabFullDeck}
        </button>
        <button
          onClick={() => setActiveTab('localize')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'localize'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          {t.tabLocalize}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-2xl text-xs text-red-200 flex items-center gap-2">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {/* Tab 1: Current Slide Variations */}
      {activeTab === 'slide-variations' && (
        <div className="space-y-3.5">
          {/* Quick Context Card */}
          <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-2.5">
            <div className="flex justify-between items-center text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300">
                {t.editingSlide} {activeSlideIndex + 1} ({currentSlide?.name})
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40 font-semibold">
                ASO: {isGoodLength && hasSubtitle ? (uiLanguage === 'en' ? '🌟 95+ Great' : '🌟 95+ 絕佳') : (uiLanguage === 'en' ? '⚡ Can Optimize' : '⚡ 建議優化')}
              </span>
            </div>
            <div className="text-xs bg-[#13131A] p-2.5 rounded-xl border border-white/[0.06] text-neutral-300">
              <span className="text-neutral-500 font-mono text-[10px] block">{t.currentHeadlineLabel}</span>
              <p className="font-bold text-white mt-0.5">{currentSlide?.textConfig?.headlineText || '(No headline)'}</p>
            </div>

            <button
              onClick={handleGenerateVariations}
              disabled={loadingVariations}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 cursor-pointer"
            >
              {loadingVariations ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {t.generatingVariations}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.generateVariationsBtn}
                </>
              )}
            </button>
          </div>

          {/* Generated Variations List */}
          {variations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span>{uiLanguage === 'en' ? 'Click to apply to active slide:' : '點擊即可一鍵套用至當前頁：'}</span>
                <span className="text-[11px] text-blue-400 font-semibold">{variations.length} {uiLanguage === 'en' ? 'angles' : '個策略角度'}</span>
              </div>

              {variations.map((v, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-[#121219]/90 hover:bg-[#161622] border border-white/[0.08] hover:border-blue-500/60 rounded-2xl transition-all space-y-2 group shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40">
                      {v.angle}
                    </span>
                    {v.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 font-mono border border-emerald-800/40">
                        {t.badgeText}: {v.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors whitespace-pre-line">
                      {v.headline}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">{v.subtitle}</p>
                  </div>

                  <p className="text-[11px] text-neutral-400 italic bg-[#0A0A0E] p-2 rounded-xl border border-white/[0.04]">
                    💡 ASO: {v.rationale}
                  </p>

                  <button
                    onClick={() => {
                      onApplySlideCopy(activeSlideIndex, v.badge || '', v.headline, v.subtitle);
                      setCopiedStatus(`applied-${i}`);
                      setTimeout(() => setCopiedStatus(null), 1800);
                    }}
                    className="w-full py-2 bg-white/[0.08] hover:bg-blue-600 text-neutral-200 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/[0.06] hover:border-blue-500 shadow-sm"
                  >
                    {copiedStatus === `applied-${i}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        {uiLanguage === 'en' ? `Applied to Slide ${activeSlideIndex + 1}` : `已套用至 Slide ${activeSlideIndex + 1}`}
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-3.5 h-3.5" />
                        {t.applyCopy}
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Full Deck Story Arc */}
      {activeTab === 'full-deck' && (
        <div className="space-y-3.5">
          <div className="space-y-3 bg-[#0F0F14]/70 p-3.5 rounded-2xl border border-white/[0.06] text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">{t.appNameLabel}</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl px-3 py-1.5 text-white focus:border-blue-500 focus:outline-hidden"
                placeholder="WealthWise"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">{t.appCategoryLabel}</label>
              <input
                type="text"
                value={appCategory}
                onChange={(e) => setAppCategory(e.target.value)}
                className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl px-3 py-1.5 text-white focus:border-blue-500 focus:outline-hidden"
                placeholder="Finance, Health & Fitness, AI Productivity"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">{t.appDescLabel}</label>
              <textarea
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl p-2.5 text-white focus:border-blue-500 focus:outline-hidden resize-none"
                placeholder={uiLanguage === 'en' ? 'Describe key problem solved and core features...' : '簡述您的 App 解決什麼痛點、有什麼讓用戶非下載不可的殺手級功能...'}
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">{t.toneLabel}</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full bg-[#13131A] border border-white/[0.1] rounded-xl px-3 py-1.5 text-white focus:border-blue-500 focus:outline-hidden cursor-pointer"
              >
                <option value="apple-minimal">{t.toneAppleMinimal}</option>
                <option value="bold-action">{t.toneBoldAction}</option>
                <option value="problem-solution">{t.toneProblemSolution}</option>
                <option value="social-proof">{t.toneSocialProof}</option>
              </select>
            </div>

            <button
              onClick={handleGenerateDeck}
              disabled={loadingDeck}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 cursor-pointer"
            >
              {loadingDeck ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {t.generatingDeck}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {uiLanguage === 'en' ? `Generate Complete ${slides.length}-Slide Story Arc` : `生成完整 ${slides.length} 張截圖故事線 (Story Arc)`}
                </>
              )}
            </button>
          </div>

          {/* Deck Results */}
          {deckResult && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {uiLanguage === 'en' ? 'Strategy Summary:' : '策略總覽：'}
                </span>
                <p className="text-neutral-200">{deckResult.appStorylineSummary}</p>
              </div>

              <div className="space-y-2">
                {deckResult.slides.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#121219] border border-white/[0.08] rounded-2xl space-y-1.5 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-300">
                        Slide {s.slideIndex}: {s.featureFocus}
                      </span>
                      {s.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40 font-mono">
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-white text-sm whitespace-pre-line">{s.headline}</p>
                    <p className="text-neutral-400">{s.subtitle}</p>
                    <p className="text-[10px] text-neutral-500">🎯 ASO: {s.asoTip}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onApplyDeckCopy(deckResult.slides);
                  setCopiedStatus('deck-applied');
                  setTimeout(() => setCopiedStatus(null), 2000);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                {copiedStatus === 'deck-applied' ? (
                  <>
                    <Check className="w-4 h-4" />
                    {uiLanguage === 'en' ? 'Successfully applied to all slides!' : '已成功一鍵套用至所有截圖！'}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {t.applyAllDeckCopy}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Multi-language Localization */}
      {activeTab === 'localize' && (
        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 bg-[#0F0F14]/70 rounded-2xl border border-white/[0.06] space-y-3">
            <p className="text-neutral-300">
              {t.localizeDesc}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLocalize(['en', 'ja', 'zh-TW'])}
                disabled={loadingLocalize}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-blue-950/50"
              >
                <Languages className="w-3.5 h-3.5" />
                {loadingLocalize ? t.localizing : t.localizeBtn}
              </button>
            </div>
          </div>

          {localizedResults.length > 0 && (
            <div className="space-y-3">
              {localizedResults.map((locSet, i) => (
                <div key={i} className="p-3.5 bg-[#121219] border border-white/[0.08] rounded-2xl space-y-2 shadow-md">
                  <div className="flex justify-between items-center font-bold text-blue-300">
                    <span>🌍 {locSet.languageName} ({locSet.languageCode})</span>
                    <button
                      onClick={() => {
                        onApplyDeckCopy(locSet.slides);
                        setCopiedStatus(`loc-${i}`);
                        setTimeout(() => setCopiedStatus(null), 1800);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedStatus === `loc-${i}` ? (uiLanguage === 'en' ? 'Applied' : '已套用') : t.applyLocale}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {locSet.slides.map((ls: any, idx: number) => (
                      <div key={idx} className="bg-[#13131A] p-2.5 rounded-xl border border-white/[0.04]">
                        <span className="text-[10px] text-neutral-500 font-mono block">Slide {ls.slideIndex}</span>
                        <p className="font-bold text-white">{ls.headline}</p>
                        <p className="text-neutral-400 text-[11px]">{ls.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
