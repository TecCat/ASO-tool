import React, { useState, useEffect } from 'react';
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
  Key,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Settings,
  HelpCircle,
  ExternalLink,
  Cpu,
  AlertCircle,
} from 'lucide-react';
import { SlideItem, AIPitchDeckResponse, AICopyVariation } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ApiKeySettings,
  KeyStorageMode,
  loadApiKeySettings,
  saveApiKeySettings,
  clearApiKeySettings,
  maskApiKey,
  requestDeckCopy,
  requestVariations,
  requestLocalize,
} from '../utils/aiCopyService';

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

  // API Key & Privacy Settings State
  const [apiKeySettings, setApiKeySettings] = useState<ApiKeySettings>({
    apiKey: '',
    storageMode: 'offline',
    hasConfirmedDisclaimer: false,
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [selectedMode, setSelectedMode] = useState<KeyStorageMode>('offline');
  const [showKeyPassword, setShowKeyPassword] = useState(false);
  const [activeEngineSource, setActiveEngineSource] = useState<string | null>(null);

  // Mode: 'full-deck' | 'slide-variations' | 'localize'
  const [activeTab, setActiveTab] = useState<'slide-variations' | 'full-deck' | 'localize'>('slide-variations');

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
  const [noticeMsg, setNoticeMsg] = useState<{ text: string; type: 'info' | 'success' | 'warn' } | null>(null);

  // Initialize Key settings
  useEffect(() => {
    const loaded = loadApiKeySettings();
    setApiKeySettings(loaded);
    setInputKey(loaded.apiKey);
    setSelectedMode(loaded.storageMode);
  }, []);

  const showNotice = (text: string, type: 'info' | 'success' | 'warn' = 'info', duration = 3000) => {
    setNoticeMsg({ text, type });
    setTimeout(() => {
      setNoticeMsg(null);
    }, duration);
  };

  // Save Settings Modal
  const handleSaveSettings = () => {
    const trimmed = inputKey.trim();
    if (selectedMode !== 'offline' && !trimmed) {
      showNotice(
        uiLanguage === 'en' ? 'Please enter a Gemini API Key or choose Offline Mode' : '請輸入 Gemini API Key 或選擇「純離線備援引擎」',
        'warn'
      );
      return;
    }

    saveApiKeySettings(trimmed, selectedMode, true);
    const updated = loadApiKeySettings();
    setApiKeySettings(updated);
    setShowSettingsModal(false);

    showNotice(
      selectedMode === 'offline'
        ? (uiLanguage === 'en' ? '⚡ Switched to Smart Offline ASO Engine (Zero Key)' : '⚡ 已切換至「智慧 ASO 離線備援引擎（免Key）」')
        : (uiLanguage === 'en' ? '🔒 API Key Settings Saved Successfully' : '🔒 API Key 設定已安全儲存'),
      'success'
    );
  };

  const handleClearKey = () => {
    clearApiKeySettings();
    setApiKeySettings({ apiKey: '', storageMode: 'offline', hasConfirmedDisclaimer: true });
    setInputKey('');
    setSelectedMode('offline');
    showNotice(
      uiLanguage === 'en' ? 'API Key cleared from local storage' : '已從瀏覽器清除 API Key',
      'info'
    );
  };

  // Generate Deck Copy
  const handleGenerateDeck = async () => {
    setLoadingDeck(true);
    setNoticeMsg(null);
    try {
      const res = await requestDeckCopy(
        {
          appName,
          appCategory,
          appDescription,
          slideCount: Math.max(3, slides.length),
          language,
          tone,
        },
        apiKeySettings
      );
      setDeckResult(res.data);
      setActiveEngineSource(res.source);
      if (res.source === 'smart-offline') {
        showNotice(
          uiLanguage === 'en' ? '⚡ Generated via Smart Offline ASO Engine' : '⚡ 已使用智慧 ASO 離線備援引擎生成',
          'info',
          2500
        );
      }
    } catch (err: any) {
      console.error(err);
      showNotice(err.message || 'Error generating deck', 'warn');
    } finally {
      setLoadingDeck(false);
    }
  };

  // Generate Single Slide Variations
  const handleGenerateVariations = async () => {
    setLoadingVariations(true);
    setNoticeMsg(null);
    try {
      const res = await requestVariations(
        {
          appName,
          category: appCategory,
          currentHeadline: currentSlide?.textConfig?.headlineText || '',
          currentSubtitle: currentSlide?.textConfig?.subtitleText || '',
          featureContext: currentSlide?.name || (uiLanguage === 'en' ? 'Core Feature Showcase' : '核心功能展示'),
          language,
        },
        apiKeySettings
      );
      setVariations(res.variations || []);
      setActiveEngineSource(res.source);
      if (res.source === 'smart-offline') {
        showNotice(
          uiLanguage === 'en' ? '⚡ 4 Strategy angles generated instantly (Offline Engine)' : '⚡ 智慧 ASO 離線引擎已即時產生 4 大策略角度文案',
          'info',
          2500
        );
      }
    } catch (err: any) {
      console.error(err);
      showNotice(err.message || 'Error generating variations', 'warn');
    } finally {
      setLoadingVariations(false);
    }
  };

  // Generate Multi-language Localization
  const handleLocalize = async (targetLangs: string[]) => {
    setLoadingLocalize(true);
    setNoticeMsg(null);
    try {
      const slidesPayload = slides.map((s, idx) => ({
        slideIndex: idx + 1,
        badge: s.textConfig.badgeText,
        headline: s.textConfig.headlineText,
        subtitle: s.textConfig.subtitleText,
      }));

      const res = await requestLocalize(slidesPayload, targetLangs, apiKeySettings);
      setLocalizedResults(res.localizedSets || []);
      setActiveEngineSource(res.source);
    } catch (err: any) {
      console.error(err);
      showNotice(err.message || 'Localization unavailable', 'warn');
    } finally {
      setLoadingLocalize(false);
    }
  };

  // Quick ASO Glance-Test Score Analysis
  const headlineLen = currentSlide?.textConfig?.headlineText?.length || 0;
  const isGoodLength = language === 'zh-TW' ? headlineLen >= 4 && headlineLen <= 24 : headlineLen >= 10 && headlineLen <= 45;
  const hasSubtitle = !!currentSlide?.textConfig?.subtitleText && currentSlide?.textConfig?.showSubtitle;

  return (
    <div className="flex flex-col h-full bg-[#0A0A0C]/95 text-neutral-100 rounded-3xl border border-white/[0.08] p-4 overflow-y-auto space-y-3.5 backdrop-blur-xl shadow-2xl relative">
      {/* Top Header */}
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

      {/* Engine Status & BYOK Key Banner */}
      <div className="p-2.5 bg-[#0F0F16] rounded-2xl border border-white/[0.07] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          {apiKeySettings.storageMode === 'offline' || !apiKeySettings.apiKey ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {uiLanguage === 'en' ? '⚡ Smart Offline Engine (Free & Instant)' : '⚡ 智慧 ASO 離線備援引擎 (免Key·即時)'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-blue-300 font-medium">
              <Key className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span className="truncate">
                Google Gemini API ({maskApiKey(apiKeySettings.apiKey)})
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-950/80 border border-blue-800/40 rounded-full text-blue-300">
                {apiKeySettings.storageMode === 'local' ? '記住' : '當次'}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setInputKey(apiKeySettings.apiKey);
            setSelectedMode(apiKeySettings.storageMode);
            setShowSettingsModal(true);
          }}
          className="px-2.5 py-1 bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 hover:text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all border border-white/[0.06] shrink-0"
        >
          <Settings className="w-3 h-3" />
          {uiLanguage === 'en' ? 'Engine / Key' : '引擎 / Key 設定'}
        </button>
      </div>

      {/* Notice Toast */}
      {noticeMsg && (
        <div
          className={`p-2.5 rounded-2xl text-xs flex items-center gap-2 border ${
            noticeMsg.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-200'
              : noticeMsg.type === 'warn'
              ? 'bg-amber-950/50 border-amber-800/60 text-amber-200'
              : 'bg-blue-950/50 border-blue-800/60 text-blue-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1">{noticeMsg.text}</span>
        </div>
      )}

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

      {/* API Key & Privacy Disclaimer Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D0D12] border border-white/[0.12] rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-xs text-neutral-200">
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {uiLanguage === 'en' ? 'AI Engine & Privacy Policy' : 'AI 引擎模式與隱私免責說明'}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {uiLanguage === 'en' ? 'Zero server storage • 100% Client-side protection' : '零伺服器儲存 • 100% 本地端點直連保護'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-neutral-400 hover:text-white text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Privacy Disclaimer Box */}
            <div className="p-3.5 bg-blue-950/30 border border-blue-800/40 rounded-2xl space-y-1.5 text-[11px] text-neutral-300">
              <div className="font-bold text-blue-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                {uiLanguage === 'en' ? 'Security & Privacy Guarantee:' : '🔒 特別免責聲明與安全機制：'}
              </div>
              <p className="leading-relaxed">
                {uiLanguage === 'en'
                  ? 'Your Gemini API Key is only used to send direct requests from your browser to the official Google API endpoint. We NEVER upload, log, or store your key on any database or third-party server.'
                  : '本工具尊重您的資料安全。您填寫的 API Key 僅由您的瀏覽器端直接連線至 Google 官方 API 伺服器，本站「絕不收集、絕不上傳、絕不儲存」任何密鑰於雲端伺服器。'}
              </p>
            </div>

            {/* 🔴 3 Major User-side BYOK Risks in Red */}
            <div className="p-3.5 bg-rose-950/40 border-2 border-rose-600/70 rounded-2xl space-y-2 text-rose-100 shadow-lg shadow-rose-950/40">
              <div className="font-bold text-xs text-rose-400 flex items-center gap-1.5 border-b border-rose-800/50 pb-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                <span>{uiLanguage === 'en' ? '⚠️ 3 Critical BYOK User-Side Security Risks' : '⚠️ 自備 API Key (BYOK) 的 3 大使用者端潛在風險'}</span>
              </div>
              
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-300 shrink-0">1. 【公用電腦遭他人讀取】：</span>
                  <span className="text-rose-200/90">
                    {uiLanguage === 'en'
                      ? 'If using a public/shared PC and selecting "Remember", subsequent users might use your key quota. (Solution: Choose "Do Not Remember" or clear storage before leaving).'
                      : '若在公用電腦（如圖書館、網咖）選取「記住」，後續使用者可能調用您的額度。（防範：請選「a. 不記住」或離席前手動清除）。'}
                  </span>
                </div>

                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-300 shrink-0">2. 【螢幕肉眼旁觀窺探】：</span>
                  <span className="text-rose-200/90">
                    {uiLanguage === 'en'
                      ? 'People standing nearby might see your key while typing. (Solution: Keep default password masking •••• active).'
                      : '輸入時若有他人站在背後可能被肉眼窺視。（防範：系統預設啟用密碼點點遮罩，請勿在公開場合隨意切換為明文）。'}
                  </span>
                </div>

                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-300 shrink-0">3. 【惡意瀏覽器擴充外掛】：</span>
                  <span className="text-rose-200/90">
                    {uiLanguage === 'en'
                      ? 'Malicious browser extensions installed on your PC may sniff page inputs. (Solution: Run in Incognito mode without untrusted extensions, or use Option C Offline Engine).'
                      : '若使用者電腦安裝了未受信任的側錄外掛，任何網頁輸入皆有風險。（防範：建議使用無痕模式，或直接選擇「c. 智慧 ASO 離線引擎」零風險）。'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Interactive Mode Selections */}
            <div className="space-y-2">
              <label className="font-bold text-neutral-300 block">
                {uiLanguage === 'en' ? 'Choose how you want to run AI features:' : '請選擇您偏好的運行模式：'}
              </label>

              {/* Choice C: Offline */}
              <label
                onClick={() => setSelectedMode('offline')}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  selectedMode === 'offline'
                    ? 'bg-emerald-950/40 border-emerald-500/70 text-white shadow-md'
                    : 'bg-[#121218] border-white/[0.06] text-neutral-400 hover:border-white/[0.15]'
                }`}
              >
                <input
                  type="radio"
                  name="keyMode"
                  checked={selectedMode === 'offline'}
                  onChange={() => setSelectedMode('offline')}
                  className="mt-0.5 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-xs flex items-center justify-between text-emerald-300">
                    <span>⚡ {uiLanguage === 'en' ? 'c. Smart Offline ASO Engine (Recommended)' : 'c. 只使用 智慧 ASO 備援引擎 (推薦)'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-900/60 rounded-full font-mono">0 元·免Key</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {uiLanguage === 'en'
                      ? '100% offline heuristic generator. Instant 5-angle copy generation without any API keys or configuration.'
                      : '100% 本地演算法運算，秒出 5 大轉化行銷角度與故事線，零設定、完全免填 Key。'}
                  </p>
                </div>
              </label>

              {/* Choice B: Remember locally */}
              <label
                onClick={() => setSelectedMode('local')}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  selectedMode === 'local'
                    ? 'bg-blue-950/40 border-blue-500/70 text-white shadow-md'
                    : 'bg-[#121218] border-white/[0.06] text-neutral-400 hover:border-white/[0.15]'
                }`}
              >
                <input
                  type="radio"
                  name="keyMode"
                  checked={selectedMode === 'local'}
                  onChange={() => setSelectedMode('local')}
                  className="mt-0.5 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-xs flex items-center justify-between text-blue-300">
                    <span>🔑 {uiLanguage === 'en' ? 'b. Remember & Auto-Mask (Local Device)' : 'b. 記住並自動遮罩 (自備 Key)'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-900/60 rounded-full font-mono">localStorage</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {uiLanguage === 'en'
                      ? 'Saved only in your personal browser local storage. Automatically masked as AIzaSy...**** and can be deleted anytime.'
                      : '儲存於您個人的電腦瀏覽器，下次開啟自動帶入並以遮罩顯示，隨時可一鍵刪除。'}
                  </p>
                </div>
              </label>

              {/* Choice A: Session only */}
              <label
                onClick={() => setSelectedMode('session')}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  selectedMode === 'session'
                    ? 'bg-indigo-950/40 border-indigo-500/70 text-white shadow-md'
                    : 'bg-[#121218] border-white/[0.06] text-neutral-400 hover:border-white/[0.15]'
                }`}
              >
                <input
                  type="radio"
                  name="keyMode"
                  checked={selectedMode === 'session'}
                  onChange={() => setSelectedMode('session')}
                  className="mt-0.5 text-indigo-500 focus:ring-0 cursor-pointer"
                />
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-xs flex items-center justify-between text-indigo-300">
                    <span>⏱️ {uiLanguage === 'en' ? 'a. Do Not Remember (Current Tab Only)' : 'a. 不記住 (僅當次有效)'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-indigo-900/60 rounded-full font-mono">sessionStorage</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {uiLanguage === 'en'
                      ? 'Key is kept in tab memory only and permanently wiped when closing the browser tab. Ideal for shared/public PCs.'
                      : '僅在目前瀏覽分頁開啟期間有效，關閉分頁或重整後立即抹除，適合公用電腦。'}
                  </p>
                </div>
              </label>
            </div>

            {/* Input field if choice A or B */}
            {selectedMode !== 'offline' && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1">
                    <Key className="w-3 h-3 text-blue-400" />
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    {uiLanguage === 'en' ? 'Get free key at Google AI Studio' : '免費獲取 Google API Key'}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKeyPassword ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#15151F] border border-white/[0.12] rounded-xl px-3 py-2 pr-20 text-white font-mono text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKeyPassword(!showKeyPassword)}
                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      title={showKeyPassword ? 'Hide' : 'Show'}
                    >
                      {showKeyPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {inputKey && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                        title="Clear Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 rounded-xl font-semibold cursor-pointer"
              >
                {uiLanguage === 'en' ? 'Cancel' : '取消'}
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/60 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {uiLanguage === 'en' ? 'Confirm & Apply' : '確認並儲存設定'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
